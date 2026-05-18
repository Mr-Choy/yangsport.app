import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let _client: SupabaseClient | null = null;

if (url && key) {
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = _client;
export const isDbEnabled = !!_client;

if (typeof window !== 'undefined') {
  // helpful hint in dev console

  console.info(
    isDbEnabled
      ? `[Yang Sport] Supabase connected: ${url}`
      : '[Yang Sport] Supabase not configured — using in-memory seed. Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local to enable.',
  );
}
