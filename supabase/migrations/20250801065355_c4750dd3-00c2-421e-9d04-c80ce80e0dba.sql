-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image_url TEXT,
  category TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view products)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert products (for admin functionality)
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update products
CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true);

-- Create policy for authenticated users to delete products
CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (true);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create policies for product image uploads
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'product-images');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, original_price, image_url, category, in_stock, rating, review_count) VALUES
('Arduino Compatible Dev Board', 'High-quality development board compatible with Arduino IDE. Perfect for prototyping and learning electronics.', 24.99, 29.99, '', 'Development Boards', true, 4.8, 156),
('Multi-Sensor Module PCB', 'Advanced sensor module featuring temperature, humidity, and motion sensors on a single PCB.', 18.99, null, '', 'Sensor Modules', true, 4.9, 89),
('Custom Prototype Board', 'Versatile prototyping board with standard spacing and multiple connection options.', 15.99, null, '', 'Prototyping', false, 4.7, 234),
('ESP32 WiFi Development Kit', 'Powerful ESP32-based development board with built-in WiFi and Bluetooth capabilities.', 32.99, 39.99, '', 'Development Boards', true, 4.9, 342),
('Raspberry Pi HAT Expansion', 'Custom HAT board for Raspberry Pi with GPIO expansion and LED indicators.', 28.50, null, '', 'Expansion Boards', true, 4.6, 128),
('IoT Sensor Hub PCB', 'Centralized sensor hub for IoT projects with multiple sensor interfaces and wireless connectivity.', 45.99, 52.99, '', 'Sensor Modules', true, 4.8, 97);