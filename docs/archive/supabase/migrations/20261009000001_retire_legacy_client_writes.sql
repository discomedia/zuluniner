-- Content is managed only by the server-side MCP service role.
-- Retain anonymous/public SELECT policies for published site content.
BEGIN;
REVOKE INSERT, UPDATE, DELETE ON public.users, public.aircraft,
  public.aircraft_photos, public.blog_posts FROM anon, authenticated;

-- Public signup metadata must never decide an administrative role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NEW.email, 'buyer');
  RETURN NEW;
END;
$$;

-- Signed uploads are issued and verified by the Storage server. Browser users
-- no longer need broad upload permissions to the public image buckets.
DROP POLICY IF EXISTS "Authenticated users can upload aircraft photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own aircraft photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own aircraft photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own blog images" ON storage.objects;
COMMIT;
