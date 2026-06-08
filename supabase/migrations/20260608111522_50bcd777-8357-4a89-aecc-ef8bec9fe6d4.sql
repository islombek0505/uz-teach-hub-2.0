
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
