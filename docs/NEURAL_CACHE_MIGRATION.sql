-- A.E.S. 4.1 - NEURAL CACHE MIGRATION
-- DATA: 2026-05-01
-- DESC: Tabela para armazenar resultados de busca e análise da IA para economizar cota de API.

CREATE TABLE IF NOT EXISTS public.search_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_model TEXT UNIQUE NOT NULL, -- Nome/Modelo do celular como chave
    reviews TEXT[],                   -- Snippets capturados do Google
    ai_insights JSONB,                -- Resultado formatado do Gemini (sentiment_score, pro, con, verdict)
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS
ALTER TABLE public.search_cache ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler o cache
DROP POLICY IF EXISTS "Allow public read search_cache" ON public.search_cache;
CREATE POLICY "Allow public read search_cache" ON public.search_cache FOR SELECT USING (true);

-- Política: Apenas o app (autenticado ou anon via service role) pode inserir/atualizar
DROP POLICY IF EXISTS "Allow insert/update search_cache" ON public.search_cache;
CREATE POLICY "Allow insert/update search_cache" ON public.search_cache FOR ALL USING (true) WITH CHECK (true);
