-- =============================================================
-- Universal: telefon + parol bilan STUDENT foydalanuvchi yaratish
-- =============================================================
-- Supabase SQL Editor'da ishlatiladi. Faqat pastdagi 3 qatorni
-- o'zgartiring (raqam, parol, ism), qolganiga tegmang.
--
-- Raqam DIGITS-ONLY, mamlakat kodi bilan: 998901234567 (no +, no spaces).
-- Login: ilovada telefon (+998 ...) + shu parol bilan kiradi.
-- Rol: admin raqami (998501882945) dan boshqasiga avtomatik "student".

do $$
declare
  v_phone    text := '998940132505';   -- <-- RAQAM (faqat raqamlar)
  v_password text := 'Student123';      -- <-- PAROL (kamida 6 belgi)
  v_name     text := '';                -- <-- ISM (ixtiyoriy, bo'sh qolsa ham bo'ladi)
  v_email    text := v_phone || '@platform.local';
  uid uuid := gen_random_uuid();
begin
  if exists (select 1 from auth.users where email = v_email) then
    raise notice 'Bu raqam allaqachon mavjud: %', v_email;
    return;
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new,
    email_change_token_current, email_change, phone_change,
    phone_change_token, reauthentication_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
    v_email, extensions.crypt(v_password, extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('phone', v_phone, 'full_name', v_name),
    now(), now(),
    '', '', '', '', '', '', '', ''
  );

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), uid, uid::text,
    jsonb_build_object('sub', uid::text, 'email', v_email),
    'email', now(), now(), now()
  );

  raise notice 'Yaratildi: %  | parol: %', v_email, v_password;
end $$;

-- Tekshirish (ixtiyoriy):
-- select u.email, p.phone, array_agg(r.role) roles
-- from auth.users u
--   left join public.profiles p on p.id = u.id
--   left join public.user_roles r on r.user_id = u.id
-- group by u.email, p.phone order by u.created_at desc;
