
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
