
-- 1. Drop course mode
ALTER TABLE public.courses DROP COLUMN IF EXISTS mode;
DROP TYPE IF EXISTS public.course_mode;

-- 2. Add 'mentor' to app_role enum (if not exists)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.app_role'::regtype AND enumlabel = 'mentor') THEN
    ALTER TYPE public.app_role ADD VALUE 'mentor';
  END IF;
END $$;

-- 3. Mentor contacts on profile
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_url text,
  ADD COLUMN IF NOT EXISTS instagram_url text;

-- 4. Tariff enum
DO $$ BEGIN
  CREATE TYPE public.course_tariff AS ENUM ('mentor', 'self');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Subscriptions: tariff + assigned mentor
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS tariff public.course_tariff NOT NULL DEFAULT 'self',
  ADD COLUMN IF NOT EXISTS mentor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 6. Payments: tariff requested by user
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS tariff public.course_tariff NOT NULL DEFAULT 'self';

-- 7. RLS: allow a student to read their assigned mentor's profile (name + socials)
DROP POLICY IF EXISTS "Students read assigned mentor profile" ON public.profiles;
CREATE POLICY "Students read assigned mentor profile"
ON public.profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = auth.uid()
      AND s.mentor_id = profiles.id
      AND s.active = true
      AND (s.expires_at IS NULL OR s.expires_at > now())
  )
);

-- 8. RLS: admins can read all profiles (so admin can list mentors)
-- Already covered by existing "Users read own profile" policy using has_role check.
