import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  );
}

// Singleton pattern — safe for Next.js dev hot-reloads
let supabase;

if (typeof globalThis._supabase === 'undefined') {
  globalThis._supabase = createClient(supabaseUrl, supabaseAnonKey);
}
supabase = globalThis._supabase;

export default supabase;
