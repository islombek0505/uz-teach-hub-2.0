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