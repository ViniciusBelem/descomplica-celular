-- A.E.S. 4.0 - SUPABASE SCHEMA MIGRATION V3
-- DATA: 2026-04-13
-- DESC: Estrutura completa para o Advisor e Painel Admin

-- 1. TABELA DE SMARTPHONES
CREATE TABLE IF NOT EXISTS public.smartphones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    img_url TEXT,
    match_score INTEGER DEFAULT 0,
    profile_tags TEXT[] DEFAULT '{}', -- ['balanced', 'heavy', 'entry']
    priority_tags TEXT[] DEFAULT '{}', -- ['camera', 'battery', 'performance', 'screen']
    specs JSONB DEFAULT '{}',          -- Dados técnicos: { "ram": "8GB", "storage": "256GB" }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE RECOMENDAÇÕES (HISTÓRICO)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Null se for anônimo
    budget NUMERIC(10, 2),
    profile TEXT,
    priority TEXT,
    result_ids UUID[], -- Array de IDs de smartphones recomendados
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEGURANÇA (RLS)
ALTER TABLE public.smartphones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: SMARTPHONES
DROP POLICY IF EXISTS "Allow public read access" ON public.smartphones;
CREATE POLICY "Allow public read access" ON public.smartphones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access" ON public.smartphones;
CREATE POLICY "Allow admin full access" ON public.smartphones FOR ALL USING (auth.role() = 'authenticated');

-- POLÍTICAS: RECOMMENDATIONS
DROP POLICY IF EXISTS "Allow anon insert recommendations" ON public.recommendations;
CREATE POLICY "Allow anon insert recommendations" ON public.recommendations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to see their own recommendations" ON public.recommendations;
CREATE POLICY "Allow users to see their own recommendations" ON public.recommendations FOR SELECT USING (auth.uid() = user_id);

-- 4. DADOS INICIAIS (SEED)
INSERT INTO public.smartphones (name, brand, price, description, profile_tags, priority_tags, match_score, img_url)
VALUES 
('Samsung Galaxy A55 5G', 'Samsung', 2199.00, 'Equilíbrio premium com IA de câmera.', ARRAY['balanced'], ARRAY['camera', 'screen'], 90, 'https://images.samsung.com/is/image/samsung/p6pim/br/sm-a556ezkrzto/gallery/br-galaxy-a55-5g-sm-a556-sm-a556ezkrzto-thumb-540342672'),
('POCO X6 Pro', 'Xiaomi', 2450.00, 'Performance extrema para jogos e multitasking.', ARRAY['heavy'], ARRAY['performance'], 88, 'https://m.media-amazon.com/images/I/51v68uYfSXL._AC_SL1000_.jpg'),
('Motorola Edge 40 Neo', 'Motorola', 1899.00, 'Design sofisticado e tela curva imersiva.', ARRAY['balanced', 'entry'], ARRAY['screen', 'design'], 82, 'https://m.media-amazon.com/images/I/61U0aD-O6KL._AC_SL1000_.jpg'),
('iPhone 15 Pro Max', 'Apple', 8200.00, 'O ápice da tecnologia mobile e vídeo.', ARRAY['professional', 'heavy'], ARRAY['camera', 'status'], 98, 'https://m.media-amazon.com/images/I/81+GIkwqLIL._AC_SL1500_.jpg');
