
-- =====================================================================
-- 1. Drop mentor-related policies & tables
-- =====================================================================
DROP POLICY IF EXISTS "Anyone reads mentor profile" ON public.profiles;
DROP POLICY IF EXISTS "Mentors read assigned student profiles" ON public.profiles;
DROP POLICY IF EXISTS "Students read assigned mentor profile" ON public.profiles;

DROP TABLE IF EXISTS public.mentor_courses CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;

-- =====================================================================
-- 2. Clean non-admin users (admin phone = 998501882945)
-- =====================================================================
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM public.profiles WHERE phone = '998501882945' LIMIT 1;
  IF admin_id IS NULL THEN
    RAISE NOTICE 'Admin not found, skipping deletion';
  ELSE
    DELETE FROM auth.users WHERE id <> admin_id;
  END IF;
END $$;

-- =====================================================================
-- 3. Clean courses: drop price-related columns (no more per-course price)
-- =====================================================================
ALTER TABLE public.courses
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS price_self,
  DROP COLUMN IF EXISTS price_mentor;

-- =====================================================================
-- 4. Payments rework: plan-based instead of per-course
-- =====================================================================
ALTER TABLE public.payments
  DROP COLUMN IF EXISTS tariff,
  ALTER COLUMN course_id DROP NOT NULL;

-- (plan_id FK added below after plans table is created)

-- =====================================================================
-- 5. Profiles: trial flag
-- =====================================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trial_activated_at timestamptz;

-- =====================================================================
-- 6. plans table
-- =====================================================================
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  price numeric(12,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads active plans" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "Admins manage plans" ON public.plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 7. user_plan table (one active plan per user)
-- =====================================================================
CREATE TABLE public.user_plan (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL,
  is_trial boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_plan TO authenticated;
GRANT ALL ON public.user_plan TO service_role;

ALTER TABLE public.user_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own plan" ON public.user_plan
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage user_plan" ON public.user_plan
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow user to activate own trial (only when no plan row yet)
CREATE POLICY "Users insert own trial" ON public.user_plan
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_trial = true);

CREATE TRIGGER trg_user_plan_updated_at BEFORE UPDATE ON public.user_plan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- 8. payments.plan_id (after plans table exists)
-- =====================================================================
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES public.plans(id) ON DELETE SET NULL;

-- =====================================================================
-- 9. has_active_plan + updated has_course_access
-- =====================================================================
CREATE OR REPLACE FUNCTION public.has_active_plan(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_plan
    WHERE user_id = _user_id AND expires_at > now()
  ) OR public.has_role(_user_id, 'admin'::app_role)
$$;

CREATE OR REPLACE FUNCTION public.has_course_access(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_active_plan(_user_id)
$$;

-- =====================================================================
-- 10. Drop legacy course_tariff enum (no longer used)
-- =====================================================================
DROP TYPE IF EXISTS public.course_tariff;

-- =====================================================================
-- 11. Default plans
-- =====================================================================
INSERT INTO public.plans (code, title, description, duration_days, price, sort_order)
VALUES
  ('m3',  '3 oylik tarif',  '3 oy davomida barcha kurslar va video darslarga to''liq ruxsat', 90,  290000, 1),
  ('m6',  '6 oylik tarif',  '6 oy davomida barcha kurslar va video darslarga to''liq ruxsat', 180, 540000, 2),
  ('y1',  '12 oylik tarif', '1 yil davomida barcha kurslar va video darslarga to''liq ruxsat', 365, 990000, 3)
ON CONFLICT (code) DO NOTHING;
