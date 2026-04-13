import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debugging only in development mode
if (import.meta.env.DEV) {
  console.log("🔑 Supabase URL Configured:", !!supabaseUrl);
}

const isValidUrl = (url) => {
  try {
    return url && new URL(url).protocol.startsWith('http');
  } catch {
    return false;
  }
};

const isReady = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 30;

if (import.meta.env.DEV && !isReady) {
  console.warn("⚠️ Supabase client is NOT ready. Check your .env file.");
}

export const supabase = isReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
