-- Add payment_method column to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'online';

-- Create an enum for payment methods for better data integrity
CREATE TYPE payment_method_type AS ENUM ('online', 'cod');

-- Update the column to use the enum
ALTER TABLE public.orders 
ALTER COLUMN payment_method TYPE payment_method_type USING payment_method::payment_method_type;