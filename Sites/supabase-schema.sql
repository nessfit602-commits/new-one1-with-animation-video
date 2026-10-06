-- ========================================================
-- SUPABASE DATABASE SETUP FOR ADRESS SHOES
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- ========================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('winter', 'men', 'ladies', 'kids')),
    tag TEXT DEFAULT 'New Arrival',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sizes TEXT NOT NULL DEFAULT '39, 40, 41, 42, 43',
    description TEXT,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert to products" ON public.products;
DROP POLICY IF EXISTS "Allow public update to products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete to products" ON public.products;

-- 4. Create RLS Policies
CREATE POLICY "Allow public read access to products" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert to products" 
    ON public.products FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update to products" 
    ON public.products FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete to products" 
    ON public.products FOR DELETE 
    USING (true);

-- 5. Create Storage Bucket for Shoe Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('adress shoes 22', 'adress shoes 22', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies (Safely re-creatable)
DROP POLICY IF EXISTS "Public Read Access for Shoe Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access for Shoe Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access for Shoe Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access for Shoe Images" ON storage.objects;

CREATE POLICY "Public Read Access for Shoe Images"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('adress shoes 22', 'adress shoes', 'shoe-images'));

CREATE POLICY "Public Upload Access for Shoe Images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('adress shoes 22', 'adress shoes', 'shoe-images'));

CREATE POLICY "Public Update Access for Shoe Images"
    ON storage.objects FOR UPDATE
    USING (bucket_id IN ('adress shoes 22', 'adress shoes', 'shoe-images'));

CREATE POLICY "Public Delete Access for Shoe Images"
    ON storage.objects FOR DELETE
    USING (bucket_id IN ('adress shoes 22', 'adress shoes', 'shoe-images'));

-- 7. Insert Initial Sample Data (Optional)
INSERT INTO public.products (title, category, tag, price, sizes, description, image_url)
VALUES 
('Urban High-Top Warm Boot', 'winter', 'Winter Special', 4500, '39, 40, 41, 42, 43, 44, 45', 'Water-resistant leather build with thermal inner lining and durable non-slip sole.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'),
('Executive Oxford Leather', 'men', 'Pure Leather', 5200, '40, 41, 42, 43, 44', '100% Genuine polished cow leather, ergonomic cushioned footbed, durable heel sole.', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'),
('Elegance Heel Sandals', 'ladies', 'Ladies Comfort', 3800, '36, 37, 38, 39, 40, 41', 'Soft cushioned interior with fashionable exterior finish and non-slip grip heel.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'),
('Junior Active Sports Runner', 'kids', 'Kids Durable', 2800, '26, 28, 30, 32, 34, 35', 'Breathable mesh upper, velcro easy strap, shock-absorbing soft sole for active kids.', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80'),
('Rugged Trail Sneakerboot', 'winter', 'Heavy Duty', 4900, '40, 41, 42, 43, 44, 45', 'Thick rubber lug outsole, padded ankle collar, premium heavy duty leather body.', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80'),
('Comfort Suede Slip-On Loafer', 'men', 'Daily Wear', 3500, '39, 40, 41, 42, 43, 44', 'Soft suede upper material, flexible rubber grip bottom, memory foam insole.', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80');
