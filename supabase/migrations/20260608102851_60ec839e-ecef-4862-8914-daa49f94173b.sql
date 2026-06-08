CREATE POLICY "Admins manage presentation files"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'presentations' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'presentations' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read presentation files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'presentations');