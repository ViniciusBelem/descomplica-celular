-- 1. Create the smartphones table
CREATE TABLE IF NOT EXISTS public.smartphones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Identifier
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    brand TEXT NOT NULL,
    
    -- Pricing
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    affiliate_link TEXT,
    
    -- Visuals
    image_url TEXT,
    description TEXT,
    
    -- Algorithm Data
    match_score INTEGER DEFAULT 0,
    profile_tags TEXT[] DEFAULT '{}',
    priority_tags TEXT[] DEFAULT '{}',
    
    -- Detailed Scores (JSONB for flexibility)
    -- Structure: { "camera": 90, "battery": 85, "performance": 95, "display": 80 }
    scores JSONB DEFAULT '{ "camera": 0, "battery": 0, "performance": 0, "display": 0 }'
);

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.smartphones ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Policy 1: Allow everyone to SELECT (Read) the catalog
CREATE POLICY "Allow public read access" ON public.smartphones
    FOR SELECT USING (true);

-- Policy 2: Allow ONLY authenticated admins to INSERT, UPDATE, DELETE
-- This assumes the user is authenticated via Supabase Auth
CREATE POLICY "Allow authenticated admins to manage catalog" ON public.smartphones
    FOR ALL 
    TO authenticated
    USING (auth.role() = 'authenticated');

-- 4. Enable Realtime (Optional but recommended for Admin)
ALTER PUBLICATION supabase_realtime ADD TABLE smartphones;

-- 5. Helper Function to update the updated_at column automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.smartphones
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. Seed Data (Optional - common phones for initial match)
INSERT INTO public.smartphones (name, model, brand, price, match_score, profile_tags, priority_tags, scores)
VALUES 
('Samsung Galaxy S24 Ultra', 'S24 Ultra', 'Samsung', 7999.00, 98, ARRAY['power_user', 'photography'], ARRAY['camera', 'performance'], '{"camera": 98, "battery": 92, "performance": 99, "display": 98}'),
('iPhone 15 Pro Max', '15 Pro Max', 'Apple', 8999.00, 97, ARRAY['power_user', 'photography'], ARRAY['camera', 'performance'], '{"camera": 99, "battery": 90, "performance": 99, "display": 97}'),
('Redmi Note 13 Pro+', 'Note 13 Pro+', 'Xiaomi', 2500.00, 85, ARRAY['balanced', 'budget'], ARRAY['battery', 'price'], '{"camera": 82, "battery": 95, "performance": 80, "display": 88}'),
('POCO X6 Pro', 'X6 Pro', 'Xiaomi', 2200.00, 88, ARRAY['gamer', 'balanced'], ARRAY['performance', 'price'], '{"camera": 75, "battery": 88, "performance": 94, "display": 85}'),
('Samsung Galaxy A55', 'A55', 'Samsung', 1800.00, 82, ARRAY['balanced', 'casual'], ARRAY['price', 'battery'], '{"camera": 80, "battery": 90, "performance": 75, "display": 82}');
