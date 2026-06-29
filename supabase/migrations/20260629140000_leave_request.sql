-- =============================================================
-- migration: 20260629140000_leave_request.sql
-- Darsdan chiqish so'rovi: darslar boshlangan (active) guruhdan o'quvchi
-- o'zicha chiqib keta olmaydi — chiqish uchun so'rov yuboradi, admin
-- tasdiqlaydi. Hamda o'quvchi o'zini o'zi qabul qila olmasligi
-- kafolatlanadi.
-- Idempotent. SQL Editor -> RUN.
-- =============================================================

BEGIN;

-- 1. Chiqish so'rovi vaqti (NULL = so'rov yo'q)
ALTER TABLE public.group_members
  ADD COLUMN IF NOT EXISTS leave_requested_at timestamptz;

-- 2. O'quvchi o'z qatorini yangilashi: 'approved' ham ruxsat (chiqish
--    so'rovini belgilash uchun a'zo bo'lib qoladi). Qattiq qoidalar trigger'da.
DROP POLICY IF EXISTS "Student updates own membership" ON public.group_members;
CREATE POLICY "Student updates own membership" ON public.group_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND status IN ('pending', 'approved', 'cancelled'));

-- 3. A'zolik qoidalari trigger'i (yangilangan):
--    + o'quvchi o'zini o'zi 'approved' qila olmaydi (faqat admin);
--    + 'active' guruhdan o'quvchi o'zicha 'cancelled' qila olmaydi
--      (chiqish so'rovi orqali, admin tasdig'i bilan).
CREATE OR REPLACE FUNCTION public.enforce_group_membership_rules()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_cap      int;
  v_status   public.group_status;
  v_count    int;
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
    -- O'quvchi o'zini qabul qila olmaydi
    IF NEW.status = 'approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
      RAISE EXCEPTION 'Faqat admin guruhga qabul qiladi';
    END IF;
    -- Darslar boshlangan guruhdan o'zicha chiqib bo'lmaydi
    IF NEW.status = 'cancelled' AND OLD.status = 'approved' AND v_status = 'active' THEN
      RAISE EXCEPTION 'Darslar boshlangan — chiqish uchun admin tasdig''i kerak';
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
    -- Qabul qilinganda eski chiqish so'rovi tozalanadi
    NEW.leave_requested_at := NULL;
  END IF;

  RETURN NEW;
END $$;

COMMIT;

-- Tekshiruv (ixtiyoriy):
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name='group_members' AND column_name='leave_requested_at';
