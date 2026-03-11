import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Fetches all students from Supabase DB.
 * Returns null if Supabase is not configured (falls back to seed data).
 *
 * @returns {Promise<Array|null>}
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
 * Publishes (full-sync) all in-memory students to Supabase.
 * Deletes all existing rows then re-inserts every current record.
 *
 * @param {Array<{ id: number, name: string, email: string, age: number }>} students
 * @returns {Promise<{ count: number }>}
 */
export async function publishToBackend(students) {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured.\n" +
      "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.\n" +
      "See README.md → Backend Setup for instructions."
    );
  }

  // Delete all existing rows (full sync / replace strategy)
  const { error: deleteError } = await supabase
    .from("students")
    .delete()
    .gte("id", 0); // matches every row

  if (deleteError) throw new Error(deleteError.message);

  // Insert all current in-memory students
  const rows = students.map(({ name, email, age }) => ({ name, email, age }));

  const { data, error: insertError } = await supabase
    .from("students")
    .insert(rows)
    .select();

  if (insertError) throw new Error(insertError.message);

  return { count: data.length };
}
