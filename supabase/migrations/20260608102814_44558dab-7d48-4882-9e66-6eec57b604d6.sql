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