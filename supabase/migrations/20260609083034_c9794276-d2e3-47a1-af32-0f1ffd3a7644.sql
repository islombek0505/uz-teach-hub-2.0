-- Cleanup: only +998501882945 may have admin role
DELETE FROM public.user_roles
WHERE role = 'admin'
  AND user_id NOT IN (SELECT id FROM public.profiles WHERE phone IN ('998501882945', '+998501882945'));

-- Remove student role from the designated admin
DELETE FROM public.user_roles
WHERE role = 'student'
  AND user_id IN (SELECT id FROM public.profiles WHERE phone IN ('998501882945', '+998501882945'));

-- Ensure admin role exists for that phone (if user already registered)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM public.profiles WHERE phone IN ('998501882945', '+998501882945')
ON CONFLICT DO NOTHING;

-- Update trigger: auto-assign admin only for the designated phone, otherwise student
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_phone text;
BEGIN
  user_phone := regexp_replace(COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''), '\D', '', 'g');
  IF user_phone = '998501882945' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;