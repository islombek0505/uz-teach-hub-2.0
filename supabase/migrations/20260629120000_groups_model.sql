-- =============================================================
-- migration: 20260629120000_groups_model.sql
-- Online o'quv markaz modeliga o'tish — 0-bosqich (DB poydevor)
--
-- Qo'shadi: group_status / membership_status enumlari, `groups` va
-- `group_members` jadvallari, modules/lessons/payments/notifications/
-- lesson_progress ga ustunlar, helper funksiyalar, RLS siyosatlari,
-- sig'im + bildirishnoma triggerlari. Eski kurs darajasidagi
-- darsliklarni (group_id IS NULL) tozalaydi (yangidan boshlash).
--
-- Idempotent: qayta ishga tushirish xavfsiz.
-- Supabase Dashboard -> SQL Editor -> New query -> butun faylni
-- joylashtiring -> RUN.
-- =============================================================

BEGIN;

-- =========================================================
-- 1. ENUM'lar
-- =========================================================
DO $$ BEGIN
  CREATE TYPE public.group_status AS ENUM ('draft','recruiting','active','completed','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_status AS ENUM ('pending','approved','rejected','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2. GROUPS (guruhlar) — kurs = yo'nalish, guruh = oqim
-- =========================================================
CREATE TABLE IF NOT EXISTS public.groups (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     uuid NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  name          text NOT NULL,
  description   text,
  status        public.group_status NOT NULL DEFAULT 'draft',
  capacity      int NOT NULL DEFAULT 25 CHECK (capacity > 0),
  min_capacity  int CHECK (min_capacity IS NULL OR min_capacity >= 0),
  price         numeric(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  price_period  text NOT NULL DEFAULT 'monthly' CHECK (price_period IN ('monthly','course')),
  schedule_days smallint[] NOT NULL DEFAULT '{}',         -- ISO: 1=Dush ... 7=Yak
  start_time    time,
  end_time      time,
  starts_on     date,
  duration_weeks int CHECK (duration_weeks IS NULL OR duration_weeks > 0),
  telegram_link text,
  cover_url     text,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups TO authenticated;
GRANT ALL ON public.groups TO service_role;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_groups_course ON public.groups(course_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON public.groups(status);
DROP TRIGGER IF EXISTS trg_groups_updated_at ON public.groups;
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 3. GROUP_MEMBERS (a'zolik + qo'shilish so'rovlari)
--    Bitta (group,user) = bitta qator; lifecycle status orqali.
--    Seat faqat 'approved' bilan to'ladi.
-- =========================================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id     uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       public.membership_status NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at   timestamptz,
  decided_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members TO authenticated;
GRANT ALL ON public.group_members TO service_role;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id, status);
CREATE INDEX IF NOT EXISTS idx_group_members_user  ON public.group_members(user_id, status);
DROP TRIGGER IF EXISTS trg_group_members_updated_at ON public.group_members;
CREATE TRIGGER trg_group_members_updated_at BEFORE UPDATE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 4. Mavjud jadvallarga ustunlar
-- =========================================================
-- Kontent endi guruh ichida (course_id legacy uchun nullable bo'ladi)
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.modules ALTER COLUMN course_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_modules_group ON public.modules(group_id);

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.lessons ALTER COLUMN course_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_lessons_group ON public.lessons(group_id);

ALTER TABLE public.lesson_progress
  ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE;
ALTER TABLE public.lesson_progress ALTER COLUMN course_id DROP NOT NULL;

-- To'lov: guruhga bog'lash + oylik davr
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS group_id     uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS period_month date;
CREATE INDEX IF NOT EXISTS idx_payments_group ON public.payments(group_id);
-- Bitta o'quvchi + guruh + oy uchun bitta faol to'lov (rad etilganlar mustasno)
CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_period
  ON public.payments(user_id, group_id, period_month)
  WHERE group_id IS NOT NULL AND status <> 'rejected';

-- Bildirishnoma: guruhga yo'naltirish
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_notifications_group
  ON public.notifications(group_id) WHERE group_id IS NOT NULL;

-- =========================================================
-- 5. Helper funksiyalar
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id uuid, _group_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE user_id = _user_id AND group_id = _group_id AND status = 'approved'
  ) OR public.has_role(_user_id, 'admin')
$$;
REVOKE EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_group_member(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.group_approved_count(_group_id uuid)
RETURNS int LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::int FROM public.group_members
  WHERE group_id = _group_id AND status = 'approved'
$$;
REVOKE EXECUTE ON FUNCTION public.group_approved_count(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.group_approved_count(uuid) TO authenticated;

-- =========================================================
-- 6. RLS — groups
-- =========================================================
DROP POLICY IF EXISTS "Read visible groups" ON public.groups;
CREATE POLICY "Read visible groups" ON public.groups FOR SELECT TO authenticated
  USING (
    status IN ('recruiting','active','completed')
    OR public.has_role(auth.uid(),'admin')
    OR public.is_group_member(auth.uid(), id)
  );
DROP POLICY IF EXISTS "Admins manage groups" ON public.groups;
CREATE POLICY "Admins manage groups" ON public.groups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =========================================================
-- 6b. RLS — group_members
-- =========================================================
DROP POLICY IF EXISTS "Read own membership" ON public.group_members;
CREATE POLICY "Read own membership" ON public.group_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- O'quvchi o'zi uchun pending so'rov yarata oladi (qoidalar trigger'da)
DROP POLICY IF EXISTS "Student requests join" ON public.group_members;
CREATE POLICY "Student requests join" ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- O'quvchi o'z so'rovini bekor qila oladi yoki qayta yubora oladi (pending/cancelled)
DROP POLICY IF EXISTS "Student updates own membership" ON public.group_members;
CREATE POLICY "Student updates own membership" ON public.group_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND status IN ('pending','cancelled'));

DROP POLICY IF EXISTS "Admins manage members" ON public.group_members;
CREATE POLICY "Admins manage members" ON public.group_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =========================================================
-- 6c. RLS — kontent endi guruh a'zoligiga ko'ra ko'rinadi
-- =========================================================
DROP POLICY IF EXISTS "Auth users read modules of accessible courses" ON public.modules;
DROP POLICY IF EXISTS "Members read group modules" ON public.modules;
CREATE POLICY "Members read group modules" ON public.modules FOR SELECT TO authenticated
  USING (group_id IS NOT NULL AND public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Enrolled users read lessons" ON public.lessons;
DROP POLICY IF EXISTS "Members read group lessons" ON public.lessons;
CREATE POLICY "Members read group lessons" ON public.lessons FOR SELECT TO authenticated
  USING (group_id IS NOT NULL AND public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Enrolled users read materials" ON public.lesson_materials;
DROP POLICY IF EXISTS "Members read group materials" ON public.lesson_materials;
CREATE POLICY "Members read group materials" ON public.lesson_materials FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.lessons l
    WHERE l.id = lesson_id
      AND l.group_id IS NOT NULL
      AND public.is_group_member(auth.uid(), l.group_id)
  ));

-- Storage: materiallar fayllariga kirish ham guruh a'zoligiga ko'ra
DROP POLICY IF EXISTS "Enrolled users read materials files" ON storage.objects;
CREATE POLICY "Enrolled users read materials files" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'materials' AND (
      public.has_role(auth.uid(),'admin') OR EXISTS (
        SELECT 1 FROM public.lesson_materials lm
        JOIN public.lessons l ON l.id = lm.lesson_id
        WHERE lm.storage_path = storage.objects.name
          AND l.group_id IS NOT NULL
          AND public.is_group_member(auth.uid(), l.group_id)
      )
    )
  );

-- =========================================================
-- 6d. RLS — notifications (platforma / o'quvchi / guruh)
-- =========================================================
DROP POLICY IF EXISTS "Users read own or broadcast notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users read targeted notifications" ON public.notifications;
CREATE POLICY "Users read targeted notifications" ON public.notifications FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR user_id = auth.uid()                                          -- bitta o'quvchiga
    OR (user_id IS NULL AND group_id IS NULL)                        -- butun platformaga
    OR (group_id IS NOT NULL AND public.is_group_member(auth.uid(), group_id)) -- guruhga
  );

-- =========================================================
-- 7. Trigger — a'zolik qoidalari (qabul ochiqligi + sig'im)
-- =========================================================
CREATE OR REPLACE FUNCTION public.enforce_group_membership_rules()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_cap     int;
  v_status  public.group_status;
  v_count   int;
  v_is_admin boolean := public.has_role(auth.uid(), 'admin');
BEGIN
  SELECT capacity, status INTO v_cap, v_status FROM public.groups WHERE id = NEW.group_id;
  IF v_cap IS NULL THEN
    RAISE EXCEPTION 'Guruh topilmadi';
  END IF;

  -- O'quvchi (admin emas) UPDATE'da guruh/user'ni o'zgartira olmaydi
  IF TG_OP = 'UPDATE' AND auth.uid() IS NOT NULL AND NOT v_is_admin THEN
    IF NEW.group_id <> OLD.group_id OR NEW.user_id <> OLD.user_id THEN
      RAISE EXCEPTION 'Ruxsat berilmagan o''zgartirish';
    END IF;
  END IF;

  -- Yangi pending so'rov: faqat qabul ochiq guruhga (admin/service_role mustasno)
  IF NEW.status = 'pending'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'pending')
     AND auth.uid() IS NOT NULL AND NOT v_is_admin THEN
    IF v_status <> 'recruiting' THEN
      RAISE EXCEPTION 'Bu guruhga hozircha qabul ochiq emas';
    END IF;
  END IF;

  -- Tasdiqlash: sig'im tekshiriladi (har kim uchun hard-limit)
  IF NEW.status = 'approved'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT count(*) INTO v_count FROM public.group_members
      WHERE group_id = NEW.group_id AND status = 'approved';
    IF v_count >= v_cap THEN
      RAISE EXCEPTION 'Guruh to''lgan (% / %)', v_count, v_cap;
    END IF;
    IF NEW.decided_at IS NULL THEN NEW.decided_at := now(); END IF;
  END IF;

  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.enforce_group_membership_rules() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_group_membership_rules ON public.group_members;
CREATE TRIGGER trg_group_membership_rules BEFORE INSERT OR UPDATE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.enforce_group_membership_rules();

-- =========================================================
-- 8. Trigger — a'zolik o'zgarishida avto-bildirishnoma
-- =========================================================
CREATE OR REPLACE FUNCTION public.notify_on_membership_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  g_name text;
  g_tg   text;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    SELECT name, telegram_link INTO g_name, g_tg FROM public.groups WHERE id = NEW.group_id;
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (user_id, title, body, type, link, group_id)
      VALUES (NEW.user_id, '✅ Guruhga qabul qilindingiz',
              'Guruh: ' || COALESCE(g_name,'—')
                || CASE WHEN COALESCE(g_tg,'') <> '' THEN '. Telegram guruhga qo''shiling: ' || g_tg ELSE '' END,
              'group', '/app/groups', NEW.group_id);
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, title, body, type, link)
      VALUES (NEW.user_id, 'Guruhga so''rovingiz rad etildi',
              'Guruh: ' || COALESCE(g_name,'—') || '. Boshqa ochiq guruhlarni ko''rishingiz mumkin.',
              'group', '/app/admissions');
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.notify_on_membership_change() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_notify_membership ON public.group_members;
CREATE TRIGGER trg_notify_membership AFTER INSERT OR UPDATE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_membership_change();

-- =========================================================
-- 9. Payment review bildirishnomasini guruhga moslashtirish
-- =========================================================
CREATE OR REPLACE FUNCTION public.notify_on_payment_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ref_title text;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('approved','rejected') THEN
    IF NEW.group_id IS NOT NULL THEN
      SELECT name INTO ref_title FROM public.groups WHERE id = NEW.group_id;
    ELSE
      SELECT title INTO ref_title FROM public.courses WHERE id = NEW.course_id;
    END IF;
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (user_id, title, body, type, link, group_id)
      VALUES (NEW.user_id, 'To''lovingiz tasdiqlandi ✅',
              COALESCE(ref_title,'—') || ' uchun to''lov qabul qilindi.',
              'payment', '/app/subscription', NEW.group_id);
    ELSE
      INSERT INTO public.notifications (user_id, title, body, type, link, group_id)
      VALUES (NEW.user_id, 'To''lov rad etildi ❌',
              COALESCE(ref_title,'—') || ' uchun to''lov rad etildi. Iltimos, tekshirib qayta yuboring.',
              'payment', '/app/subscription', NEW.group_id);
    END IF;
  END IF;
  RETURN NEW;
END $$;

-- =========================================================
-- 10. Eski kurs darajasidagi darsliklarni tozalash (yangidan boshlash)
--     group_id IS NULL = eski/test kontent. CASCADE bilan unga bog'liq
--     materiallar, quiz savollari/urinishlari va progress ham o'chadi.
-- =========================================================
DELETE FROM public.lessons WHERE group_id IS NULL;
DELETE FROM public.modules WHERE group_id IS NULL;

COMMIT;

-- =============================================================
-- Tekshiruv (ixtiyoriy, alohida ishga tushiring):
--   SELECT * FROM public.groups;
--   SELECT proname FROM pg_proc WHERE proname IN ('is_group_member','group_approved_count');
--   SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('groups','group_members');
-- =============================================================
