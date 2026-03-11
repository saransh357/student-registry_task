import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Fetches all students from Supabase DB.
 * Returns null if Supabase is not configured (falls back to seed data).
 */
export async function fetchFromDB() {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Safely publishes all in-memory students to Supabase.
 *
 * Strategy — avoids ever leaving the table empty:
 *   1. Validate no duplicate emails locally before touching the DB
 *   2. UPSERT all current students (insert new, update existing by email)
 *   3. DELETE only rows whose email is no longer in the local list
 *
 * @param {Array<{ name: string, email: string, age: number }>} students
 * @returns {Promise<{ count: number }>}
 */
export async function publishToBackend(students) {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. " +
      "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
    );
  }

  // ── Step 1: Catch duplicate emails in local state BEFORE touching DB ──
  const emails = students.map((s) => s.email.trim().toLowerCase());
  const duplicates = emails.filter((e, i) => emails.indexOf(e) !== i);

  if (duplicates.length > 0) {
    const unique = [...new Set(duplicates)].join(", ");
    throw new Error(
      `Duplicate email${duplicates.length > 1 ? "s" : ""} found: ${unique}. ` +
      `Please fix before publishing.`
    );
  }

  // ── Step 2: Upsert all current students (safe — never empties the table) ──
  const rows = students.map(({ name, email, age }) => ({
    name:  name.trim(),
    email: email.trim().toLowerCase(),
    age:   Number(age),
  }));

  if (rows.length > 0) {
    const { error: upsertError } = await supabase
      .from("students")
      .upsert(rows, {
        onConflict:        "email",  // update row if email already exists
        ignoreDuplicates:  false,    // always overwrite name + age
      });

    if (upsertError) {
      throw new Error(`Publish failed: ${upsertError.message}`);
    }
  }

  // ── Step 3: Remove DB rows that no longer exist locally ──
  if (emails.length > 0) {
    const { error: deleteError } = await supabase
      .from("students")
      .delete()
      .not("email", "in", `(${emails.map((e) => `"${e}"`).join(",")})`);

    if (deleteError) {
      // Non-fatal: upsert already succeeded, just log the cleanup failure
      console.warn("Cleanup delete failed:", deleteError.message);
    }
  } else {
    // No students locally — clear the whole table intentionally
    await supabase.from("students").delete().not("name", "is", null);
  }

  return { count: rows.length };
}
