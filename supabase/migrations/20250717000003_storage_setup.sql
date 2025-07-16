-- Create storage buckets for images

-- Aircraft photos bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('aircraft-photos', 'aircraft-photos', true);

-- Blog header images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true);

-- Storage policies for aircraft photos
CREATE POLICY "Anyone can view aircraft photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'aircraft-photos');

CREATE POLICY "Authenticated users can upload aircraft photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'aircraft-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own aircraft photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'aircraft-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own aircraft photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'aircraft-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for blog images
CREATE POLICY "Anyone can view blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own blog images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'blog-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own blog images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
