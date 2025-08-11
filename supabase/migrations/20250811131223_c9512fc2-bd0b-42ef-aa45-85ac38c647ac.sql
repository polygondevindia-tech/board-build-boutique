-- 1) Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text generated always as (
    lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
  ) stored,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Enable RLS
alter table public.categories enable row level security;

-- 3) Policies: public read, admin write
create policy if not exists "Categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy if not exists "Only admins can insert categories"
  on public.categories for insert
  with check (has_role(auth.uid(), 'admin'::app_role));

create policy if not exists "Only admins can update categories"
  on public.categories for update
  using (has_role(auth.uid(), 'admin'::app_role));

create policy if not exists "Only admins can delete categories"
  on public.categories for delete
  using (has_role(auth.uid(), 'admin'::app_role));

-- 4) updated_at trigger
create trigger if not exists update_categories_updated_at
before update on public.categories
for each row execute function public.update_updated_at_column();
