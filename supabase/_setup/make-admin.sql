-- =============================================================
-- Make a registered user an ADMIN
-- =============================================================
-- Run this in your Supabase SQL Editor AFTER the person has registered
-- in the app at least once (so their profile exists).
--
-- NOTE: the database already auto-grants admin to the phone 998501882945
-- (see handle_new_user_role trigger). If you register with that number you
-- become admin automatically and DON'T need this script.
--
-- Otherwise: replace the phone below with YOUR admin phone — DIGITS ONLY,
-- with country code, e.g. 998901234567 (no +, no spaces).

insert into public.user_roles (user_id, role)
select id, 'admin'::app_role
from public.profiles
where phone = '998901234567'        --  <-- CHANGE THIS
on conflict do nothing;

-- Optional: drop the student role so the account is admin-only.
delete from public.user_roles
where role = 'student'
  and user_id in (
    select id from public.profiles where phone = '998901234567'   --  <-- SAME NUMBER
  );

-- Verify:
-- select p.phone, r.role from public.user_roles r
--   join public.profiles p on p.id = r.user_id;
