-- =============================================================
-- uz-teach-hub — FULL SCHEMA (fresh install)
-- Paste this whole file into your NEW Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query) and click RUN.
-- It builds all tables, RLS policies, functions, triggers, seed
-- plans, and the 5 storage buckets. Safe to run once on an empty DB.
-- =============================================================


-- =============================================================
-- migration: 20260608070926_2d6b4ced-2b63-4acd-8458-81e092d22adc.sql
-- =============================================================

-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'student');
CREATE TYPE public.lesson_type AS ENUM ('video', 'presentation', 'text');
CREATE TYPE public.course_mode AS ENUM ('strict', 'free');
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected');

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Default new signups → student
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============ COURSES ============
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category TEXT,
  mode course_mode NOT NULL DEFAULT 'strict',
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ MODULES ============
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- ============ LESSONS ============
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type lesson_type NOT NULL DEFAULT 'video',
  bunny_video_id TEXT,
  bunny_library_id TEXT,
  duration_seconds INT,
  position INT NOT NULL DEFAULT 0,
  has_quiz BOOLEAN NOT NULL DEFAULT false,
  pass_threshold INT NOT NULL DEFAULT 80,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_lessons_updated_at BEFORE UPDATE ON public.lessons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LESSON MATERIALS (PDFs etc.) ============
CREATE TABLE public.lesson_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_materials TO authenticated;
GRANT ALL ON public.lesson_materials TO service_role;
ALTER TABLE public.lesson_materials ENABLE ROW LEVEL SECURITY;

-- ============ QUIZ QUESTIONS ============
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- ============ QUIZ ATTEMPTS ============
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INT NOT NULL,
  answers JSONB NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- ============ LESSON PROGRESS ============
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  watched_seconds INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_position INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_progress_updated_at BEFORE UPDATE ON public.lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PAYMENTS ============
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  payer_name TEXT,
  payer_phone TEXT,
  note TEXT,
  receipt_url TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SUBSCRIPTIONS (course access) ============
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper: does user have active subscription to a course?
CREATE OR REPLACE FUNCTION public.has_course_access(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = _user_id AND course_id = _course_id
      AND active = true
      AND (expires_at IS NULL OR expires_at > now())
  ) OR public.has_role(_user_id, 'admin')
$$;

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- user_roles
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- courses — published visible to all auth users; admins manage
CREATE POLICY "Auth users read published courses" ON public.courses FOR SELECT TO authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- modules
CREATE POLICY "Auth users read modules of accessible courses" ON public.modules FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND (c.published OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "Admins manage modules" ON public.modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- lessons (metadata visible to enrolled users; bunny_video_id is in DB but real video URL requires server-fn signed token)
CREATE POLICY "Enrolled users read lessons" ON public.lessons FOR SELECT TO authenticated
  USING (public.has_course_access(auth.uid(), course_id));
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- lesson_materials
CREATE POLICY "Enrolled users read materials" ON public.lesson_materials FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_id AND public.has_course_access(auth.uid(), l.course_id)));
CREATE POLICY "Admins manage materials" ON public.lesson_materials FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- quiz_questions (enrolled users can read but NOT correct_index — handled in server fn projection)
CREATE POLICY "Enrolled users read quiz questions" ON public.quiz_questions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_id AND public.has_course_access(auth.uid(), l.course_id)));
CREATE POLICY "Admins manage quiz questions" ON public.quiz_questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- quiz_attempts
CREATE POLICY "Users read own attempts" ON public.quiz_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own attempts" ON public.quiz_attempts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- lesson_progress
CREATE POLICY "Users read own progress" ON public.lesson_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users upsert own progress" ON public.lesson_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress" ON public.lesson_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- payments
CREATE POLICY "Users read own payments" ON public.payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own payments" ON public.payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins update payments" ON public.payments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- subscriptions
CREATE POLICY "Users read own subscriptions" ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage subscriptions" ON public.subscriptions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- =============================================================
-- migration: 20260608070956_01037ed2-fa15-4546-a7f4-ddbf074d6ab0.sql
-- =============================================================

-- Trigger functions: no one needs direct EXECUTE
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Helper functions used in RLS: only authenticated users
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_course_access(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_course_access(UUID, UUID) TO authenticated;


-- =============================================================
-- migration: 20260608071059_e121cc08-cbb1-4bd1-87ec-97901a9b3d02.sql
-- =============================================================

-- RECEIPTS: user uploads own receipts (path: {user_id}/{filename}); admin reads all
CREATE POLICY "Users upload own receipts" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users read own receipts" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'receipts' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(),'admin')));

-- MATERIALS: only admins write; enrolled users read
CREATE POLICY "Admins write materials" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update materials" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete materials" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Enrolled users read materials files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'));
-- (granular per-course access is handled by server-fn signed URLs)

-- COURSE COVERS: admins write, authenticated read
CREATE POLICY "Admins write course covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'course-covers' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update course covers" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'course-covers' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Auth users read course covers" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'course-covers');

-- AVATARS: users manage own
CREATE POLICY "Users manage own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth users read avatars" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');


-- =============================================================
-- migration: 20260608075109_9b440d0e-1274-4d27-971a-2fafb282b946.sql
-- =============================================================

-- profile extras
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS city text;

-- feedback type enum
DO $$ BEGIN
  CREATE TYPE public.feedback_type AS ENUM ('suggestion', 'feedback', 'complaint', 'question');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.feedback_type NOT NULL DEFAULT 'feedback',
  subject text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  admin_reply text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own feedback" ON public.feedback
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update feedback" ON public.feedback
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feedback" ON public.feedback
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at DESC);


-- =============================================================
-- migration: 20260608095303_c3ef4c77-e31d-48eb-9960-6d4490a5208e.sql
-- =============================================================
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content text;

DROP POLICY IF EXISTS "Enrolled users read materials files" ON storage.objects;
CREATE POLICY "Enrolled users read materials files" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'materials' AND (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1 FROM public.lesson_materials lm
      JOIN public.lessons l ON l.id = lm.lesson_id
      WHERE lm.storage_path = storage.objects.name
        AND public.has_course_access(auth.uid(), l.course_id)
    )
  )
);

-- =============================================================
-- migration: 20260608102814_44558dab-7d48-4882-9e66-6eec57b604d6.sql
-- =============================================================
-- Add presentation fields to lessons
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS presentation_url text,
  ADD COLUMN IF NOT EXISTS presentation_type text,
  ADD COLUMN IF NOT EXISTS presentation_name text;

-- Course-level standalone presentations (takrorlash uchun)
CREATE TABLE IF NOT EXISTS public.course_presentations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  file_type text NOT NULL,
  file_name text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_presentations TO authenticated;
GRANT ALL ON public.course_presentations TO service_role;

ALTER TABLE public.course_presentations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage course presentations"
ON public.course_presentations
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students with access can view course presentations"
ON public.course_presentations
FOR SELECT TO authenticated
USING (public.has_course_access(auth.uid(), course_id));

CREATE TRIGGER set_course_presentations_updated_at
BEFORE UPDATE ON public.course_presentations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS course_presentations_course_id_idx ON public.course_presentations(course_id);

-- =============================================================
-- migration: 20260608102851_60ec839e-ecef-4862-8914-daa49f94173b.sql
-- =============================================================
CREATE POLICY "Admins manage presentation files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'presentations' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'presentations' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read presentation files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'presentations');

-- =============================================================
-- migration: 20260608111522_50bcd777-8357-4a89-aecc-ef8bec9fe6d4.sql
-- =============================================================

ALTER TABLE public.lessons
  DROP COLUMN IF EXISTS presentation_url,
  DROP COLUMN IF EXISTS presentation_type,
  DROP COLUMN IF EXISTS presentation_name,
  ADD COLUMN IF NOT EXISTS presentation_slides text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.course_presentations
  DROP COLUMN IF EXISTS url,
  DROP COLUMN IF EXISTS file_type,
  DROP COLUMN IF EXISTS file_name,
  ADD COLUMN IF NOT EXISTS slides text[] NOT NULL DEFAULT '{}'::text[];


-- =============================================================
-- migration: 20260608114446_81736a35-6168-42c6-b99e-0e3e824ca162.sql
-- =============================================================

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


-- =============================================================
-- migration: 20260608120335_3e30d2a3-64ea-4b89-8c42-1857c35b7339.sql
-- =============================================================

-- Profile additions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS expertise TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS headline TEXT;

-- Allow any authenticated user to read mentor profiles (needed for course pages, mentor listing)
DROP POLICY IF EXISTS "Anyone reads mentor profile" ON public.profiles;
CREATE POLICY "Anyone reads mentor profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(profiles.id, 'mentor'));

-- mentor_courses link table
CREATE TABLE IF NOT EXISTS public.mentor_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (mentor_id, course_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_courses TO authenticated;
GRANT ALL ON public.mentor_courses TO service_role;

ALTER TABLE public.mentor_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads mentor_courses" ON public.mentor_courses;
CREATE POLICY "Anyone reads mentor_courses" ON public.mentor_courses
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage mentor_courses" ON public.mentor_courses;
CREATE POLICY "Admins manage mentor_courses" ON public.mentor_courses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow mentors to read subscriptions assigned to them (so mentor portal can list their students)
DROP POLICY IF EXISTS "Mentors read assigned subscriptions" ON public.subscriptions;
CREATE POLICY "Mentors read assigned subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (mentor_id = auth.uid());

-- Allow mentors to read their assigned students' basic profile info
DROP POLICY IF EXISTS "Mentors read assigned student profiles" ON public.profiles;
CREATE POLICY "Mentors read assigned student profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = profiles.id
      AND s.mentor_id = auth.uid()
      AND s.active = true
  ));


-- =============================================================
-- migration: 20260608121646_aef951d4-43f2-4309-ab5e-bf151ff7214f.sql
-- =============================================================
CREATE POLICY "Admins manage user_roles insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage user_roles update" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage user_roles delete" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- migration: 20260608123625_706adbda-4ea5-46e2-8eb6-e6a90f6138de.sql
-- =============================================================
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS price_self numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_mentor numeric(12,2) NOT NULL DEFAULT 0;

UPDATE public.courses SET price_self = price WHERE price_self = 0 AND price > 0;
UPDATE public.courses SET price_mentor = price WHERE price_mentor = 0 AND price > 0;

-- =============================================================
-- migration: 20260609064403_b4d3ce53-1835-4619-82ac-6828a3e4f2cc.sql
-- =============================================================

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


-- =============================================================
-- migration: 20260609064435_39968c8f-e453-4ae1-ad2d-1dc56508ae1d.sql
-- =============================================================

REVOKE EXECUTE ON FUNCTION public.notify_on_payment_review() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_on_feedback_reply() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_on_news_publish() FROM PUBLIC, anon, authenticated;


-- =============================================================
-- migration: 20260609070412_cbb95a88-bdd8-4f9f-a46d-e6e69d6320f6.sql
-- =============================================================

-- Payment cards (admin can add multiple cards, show/hide individually)
CREATE TABLE public.payment_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  card_number text NOT NULL,
  holder_name text NOT NULL,
  bank text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_cards TO authenticated;
GRANT ALL ON public.payment_cards TO service_role;
ALTER TABLE public.payment_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can read active cards" ON public.payment_cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage cards" ON public.payment_cards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_payment_cards_updated BEFORE UPDATE ON public.payment_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contact channels (telegram, phone, instagram, whatsapp, email, website)
CREATE TABLE public.contact_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('telegram','phone','instagram','whatsapp','email','website','youtube','facebook')),
  label text NOT NULL,
  value text NOT NULL,
  url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_channels TO authenticated;
GRANT ALL ON public.contact_channels TO service_role;
ALTER TABLE public.contact_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can read channels" ON public.contact_channels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage channels" ON public.contact_channels FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_contact_channels_updated BEFORE UPDATE ON public.contact_channels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Platform settings (singleton key/value store)
CREATE TABLE public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.platform_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth can read settings" ON public.platform_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.platform_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_platform_settings_updated BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed defaults from previous hard-coded values
INSERT INTO public.platform_settings (key, value) VALUES
  ('platform', '{"name":"LearnHub","tagline":"Online ta''lim platformasi"}'::jsonb),
  ('system', '{"allow_registration":true,"sms_verification":true,"block_video_download":true,"auto_expire_subscriptions":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.payment_cards (label, card_number, holder_name, bank, sort_order)
VALUES ('Asosiy karta', '8600 1234 5678 9012', 'Yusupov A.K.', 'Humo / Uzcard', 0);

INSERT INTO public.contact_channels (type, label, value, url, sort_order) VALUES
  ('phone','Telefon','+998 90 123 45 67','tel:+998901234567',0),
  ('telegram','Telegram','@learnhub_uz','https://t.me/learnhub_uz',1);


-- =============================================================
-- migration: 20260609083034_c9794276-d2e3-47a1-af32-0f1ffd3a7644.sql
-- =============================================================
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

-- =============================================================
-- migration: 20260612073954_2b344731-5bde-4070-8ec8-8e7858a8486f.sql
-- =============================================================
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS description text;

-- =============================================================
-- migration: 20260617092857_58292977-2c4b-45c7-b3af-46e709825460.sql
-- =============================================================

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


-- =============================================================
-- migration: 20260619120000_security_hardening.sql
-- =============================================================
-- =====================================================================
-- Security hardening
-- =====================================================================
-- Closes three issues found in a security review:
--   1. Users could grant themselves unlimited free access by inserting a
--      user_plan row with is_trial=true and an arbitrary far-future expires_at.
--   2. Enrolled users could read quiz_questions.correct_index directly,
--      exposing the answer key.
--   3. platform_settings was readable by every authenticated user.
--
-- Trial activation and quiz question delivery now go exclusively through
-- server functions that use the service-role key (which bypasses RLS).

-- 1. Remove the client-side trial insert path. Trials are now created by the
--    `activateTrial` server function (service role), which sets a controlled
--    7-day expiry and enforces one-trial-per-user.
DROP POLICY IF EXISTS "Users insert own trial" ON public.user_plan;

-- 2. Stop students from reading quiz answers directly. Admins keep full access
--    via "Admins manage quiz questions"; students receive questions (without
--    correct_index) through the `getQuizQuestions` server function.
DROP POLICY IF EXISTS "Enrolled users read quiz questions" ON public.quiz_questions;

-- 3. Restrict platform settings to admins only (no app code reads them as a
--    non-admin). Admins retain access through "Admins manage settings".
DROP POLICY IF EXISTS "Auth can read settings" ON public.platform_settings;


-- =============================================================
-- migration: 20260619130000_lesson_html_presentation.sql
-- =============================================================
-- =====================================================================
-- HTML-file presentations for lessons
-- =====================================================================
-- A lesson presentation can now be EITHER a sequence of slide images
-- (existing `presentation_slides text[]`) OR a single self-contained HTML
-- file stored in the "presentations" bucket. This column holds the storage
-- path of that HTML file; when set, the lesson uses the HTML deck.
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS presentation_html_path text;


-- =============================================================
-- STORAGE BUCKETS (private — the app serves everything via signed URLs)
-- =============================================================
insert into storage.buckets (id, name, public) values
  ('avatars','avatars', false),
  ('course-covers','course-covers', false),
  ('materials','materials', false),
  ('receipts','receipts', false),
  ('presentations','presentations', false)
on conflict (id) do nothing;


-- =============================================================
-- migration: 20260629120000_groups_model.sql (Online o'quv markaz)
-- =============================================================
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
