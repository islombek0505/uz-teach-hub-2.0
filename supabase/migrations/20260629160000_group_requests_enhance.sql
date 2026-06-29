-- =============================================================
-- migration: 20260629160000_group_requests_enhance.sql
--   1. Chiqish so'roviga izoh (leave_note)
--   2. Admin a'zoni guruhdan chiqarganda o'quvchiga bildirishnoma
--   3. (Kafolat) o'quvchi UPDATE siyosatini qayta tasdiqlash —
--      "new row violates RLS" xatosini bartaraf etadi (migration #2
--      to'liq qo'llanmagan bo'lsa).
-- Idempotent. SQL Editor -> RUN.
-- =============================================================

BEGIN;

-- 1. Chiqish so'rovi izohi
ALTER TABLE public.group_members
  ADD COLUMN IF NOT EXISTS leave_note text;

-- 2. O'quvchi o'z qatorini 'approved' bilan ham yangilay olishi (chiqish so'rovi
--    leave_requested_at/leave_note ni yozadi, status 'approved' bo'lib qoladi).
DROP POLICY IF EXISTS "Student updates own membership" ON public.group_members;
CREATE POLICY "Student updates own membership" ON public.group_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND status IN ('pending', 'approved', 'cancelled'));

-- 3. A'zolik o'zgarishida bildirishnoma: qabul / rad / admin tomonidan chiqarish
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
    ELSIF NEW.status = 'cancelled' AND OLD.status = 'approved'
          AND public.has_role(auth.uid(), 'admin') THEN
      -- Admin a'zoni chiqardi (yoki chiqish so'rovini tasdiqladi)
      INSERT INTO public.notifications (user_id, title, body, type, link)
      VALUES (NEW.user_id, 'Siz guruhdan chiqarildingiz',
              'Guruh: ' || COALESCE(g_name,'—') || '. Admin sizni guruhdan chiqardi.',
              'group', '/app/groups');
    END IF;
  END IF;
  RETURN NEW;
END $$;

COMMIT;
