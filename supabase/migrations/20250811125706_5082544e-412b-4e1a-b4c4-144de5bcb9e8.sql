-- Promote a user to admin by email
-- Safe if run multiple times due to ON CONFLICT
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role
from auth.users
where email = 'pnihanshu@gmail.com'
on conflict (user_id, role) do nothing;