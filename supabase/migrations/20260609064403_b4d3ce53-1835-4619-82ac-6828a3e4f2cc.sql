
-- =========================
-- NOTIFICATIONS
-- =========================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL = broadcast
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'info', -- info|payment|feedback|news|announcement
  link text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_broadcast ON public.notifications(created_at DESC) WHERE user_id IS NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own or broadcast notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete notifications" ON public.notifications
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================
-- NOTIFICATION READS
-- =========================
CREATE TABLE IF NOT EXISTS public.notification_reads (
  notification_id uuid NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (notification_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.notification_reads TO authenticated;
GRANT ALL ON public.notification_reads TO service_role;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reads" ON public.notification_reads
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =========================
-- NEWS
-- =========================
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  image_url text,
  category text NOT NULL DEFAULT 'announcement', -- announcement|course|discount|event
  link text,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published, published_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read published news" ON public.news
  FOR SELECT TO authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert news" ON public.news
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update news" ON public.news
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete news" ON public.news
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- TRIGGERS for auto notifications
-- =========================

-- 1) Payment status change → notify user
CREATE OR REPLACE FUNCTION public.notify_on_payment_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  course_title text;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('approved','rejected') THEN
    SELECT title INTO course_title FROM public.courses WHERE id = NEW.course_id;
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (user_id, title, body, type, link)
      VALUES (NEW.user_id,
              'To''lovingiz tasdiqlandi ✅',
              'Kurs: ' || COALESCE(course_title, '—') || '. Obunangiz faollashtirildi, darslarni boshlashingiz mumkin.',
              'payment',
              '/app/courses');
    ELSE
      INSERT INTO public.notifications (user_id, title, body, type, link)
      VALUES (NEW.user_id,
              'To''lov rad etildi ❌',
              'Kurs: ' || COALESCE(course_title, '—') || '. Iltimos, to''lov ma''lumotlarini tekshirib qayta yuboring.',
              'payment',
              '/app/subscription');
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_payment_review ON public.payments;
CREATE TRIGGER trg_notify_payment_review AFTER UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_payment_review();

-- 2) Feedback reply → notify user
CREATE OR REPLACE FUNCTION public.notify_on_feedback_reply()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (OLD.admin_reply IS NULL OR OLD.admin_reply = '')
     AND NEW.admin_reply IS NOT NULL AND NEW.admin_reply <> '' THEN
    INSERT INTO public.notifications (user_id, title, body, type, link)
    VALUES (NEW.user_id,
            'Murojaatingizga javob keldi 💬',
            COALESCE(NEW.subject, 'Murojaatingiz') || ' — administrator javob berdi.',
            'feedback',
            '/app/feedback');
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_feedback_reply ON public.feedback;
CREATE TRIGGER trg_notify_feedback_reply AFTER UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_feedback_reply();

-- 3) New published news → broadcast notification
CREATE OR REPLACE FUNCTION public.notify_on_news_publish()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.published = true THEN
    INSERT INTO public.notifications (user_id, title, body, type, link, created_by)
    VALUES (NULL, '📢 ' || NEW.title, NEW.body, 'news', '/app', NEW.created_by);
  ELSIF TG_OP = 'UPDATE' AND NEW.published = true AND OLD.published = false THEN
    INSERT INTO public.notifications (user_id, title, body, type, link, created_by)
    VALUES (NULL, '📢 ' || NEW.title, NEW.body, 'news', '/app', NEW.created_by);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_news_publish ON public.news;
CREATE TRIGGER trg_notify_news_publish AFTER INSERT OR UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_news_publish();
