import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client — reads credentials from Vite env vars.
 * Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
 *
 * Free Supabase project: https://supabase.com
 */
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || "";
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;
