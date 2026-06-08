
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
