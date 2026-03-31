import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log("🔑 VITE ENV SUPABASE: URL encontrada?", !!supabaseUrl, "| Chave encontada? Tamanho:", supabaseAnonKey.length);

// Prevent crashes if the URL isn't configured yet or is a placeholder
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const isReady = isValidUrl(supabaseUrl) && supabaseAnonKey !== 'SUBSTITUA_PELA_CHAVE_AQUI' && supabaseAnonKey.length > 20;
console.log("🚦 Supabase JS liberado para inicializar?", isReady);

export const supabase = isReady
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
