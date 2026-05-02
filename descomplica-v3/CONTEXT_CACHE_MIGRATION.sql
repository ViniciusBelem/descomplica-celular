-- NEURAL NEXUS 4.1: CONTEXT CACHE MIGRATION
-- Objetivo: Armazenar cenários completos para latência zero em buscas repetidas.

CREATE TABLE IF NOT EXISTS public.context_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_hash TEXT UNIQUE NOT NULL, -- Ex: B5000_Pgamer_Pperformance
    results JSONB NOT NULL, -- Os top 3/4 celulares formatados
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.context_cache ENABLE ROW LEVEL SECURITY;

-- Política de Leitura Pública
CREATE POLICY "Enable read for everyone" ON public.context_cache
    FOR SELECT USING (true);

-- Política de Inserção Pública (Modo Autônomo)
CREATE POLICY "Enable autonomous insertion" ON public.context_cache
    FOR INSERT WITH CHECK (true);

-- Index para busca rápida por hash
CREATE INDEX IF NOT EXISTS idx_scenario_hash ON public.context_cache(scenario_hash);
