-- 1) Create enum for roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3) Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4) Policies for user_roles
-- Allow users to read only their own roles
DO $$ BEGIN
  CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Do NOT allow insert/update/delete from clients (no policies created)

-- 5) Function to check if a user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 6) Tighten products policies: allow reads for everyone, writes only for admins
-- Ensure RLS is enabled (it should be already)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing write policies if they exist, then recreate
DO $$ BEGIN
  DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
  DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
  DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Keep/ensure select policy for everyone
DO $$ BEGIN
  CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create admin-only write policies
DO $$ BEGIN
  CREATE POLICY "Only admins can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Only admins can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Only admins can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;