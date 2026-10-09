-- Application profile IDs are preserved; external identity maps through auth_subject.
CREATE TABLE users (
  id UUID PRIMARY KEY ,
  auth_subject TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  phone TEXT,
  location TEXT,
  role TEXT CHECK (role IN ('admin', 'seller', 'buyer')) DEFAULT 'buyer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create aircraft table
CREATE TABLE aircraft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- USD whole dollars, matching the existing MCP/site contract
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  hours INTEGER, -- Flight hours
  engine_type TEXT,
  avionics TEXT,
  airport_code TEXT,
  city TEXT,
  country TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT CHECK (status IN ('active', 'sold', 'pending', 'draft')) DEFAULT 'draft',
  slug TEXT UNIQUE NOT NULL,
  meta_description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create aircraft_photos table
CREATE TABLE aircraft_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aircraft_id UUID NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  blurb TEXT,
  content TEXT, -- Markdown content
  header_photo TEXT, -- Storage path to header image
  meta_description TEXT,
  published BOOLEAN DEFAULT FALSE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_aircraft_status ON aircraft(status);
CREATE INDEX idx_aircraft_make_model ON aircraft(make, model);
CREATE INDEX idx_aircraft_price ON aircraft(price);
CREATE INDEX idx_aircraft_year ON aircraft(year);
CREATE INDEX idx_aircraft_location ON aircraft(latitude, longitude);
CREATE INDEX idx_aircraft_user_id ON aircraft(user_id);
CREATE INDEX idx_aircraft_created_at ON aircraft(created_at);

CREATE INDEX idx_aircraft_photos_aircraft_id ON aircraft_photos(aircraft_id);
CREATE INDEX idx_aircraft_photos_display_order ON aircraft_photos(aircraft_id, display_order);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aircraft_updated_at
  BEFORE UPDATE ON aircraft
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE mcp_auth_records(key text PRIMARY KEY,value jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE site_publications(id uuid PRIMARY KEY,status text NOT NULL CHECK(status IN ('queued','building','deployed','failed')),created_at timestamptz NOT NULL DEFAULT now(),finished_at timestamptz,deployment_url text);
CREATE OR REPLACE FUNCTION replace_aircraft_gallery(aircraft_uuid uuid,photos jsonb,primary_index integer,expected timestamptz) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE parent aircraft; photo jsonb; ordinal integer:=0; gallery jsonb;
BEGIN
 SELECT * INTO parent FROM aircraft WHERE id=aircraft_uuid FOR UPDATE;
 IF NOT FOUND OR (expected IS NOT NULL AND parent.updated_at<>expected) THEN RAISE EXCEPTION 'Aircraft changed or was removed; read it again before changing images.'; END IF;
 DELETE FROM aircraft_photos WHERE aircraft_id=aircraft_uuid;
 FOR photo IN SELECT * FROM jsonb_array_elements(photos) LOOP
  INSERT INTO aircraft_photos(aircraft_id,storage_path,alt_text,caption,display_order,is_primary) VALUES(aircraft_uuid,photo->>'storage_path',photo->>'alt_text',photo->>'caption',ordinal,ordinal=primary_index);
  ordinal:=ordinal+1;
 END LOOP;
 UPDATE aircraft SET updated_at=now() WHERE id=aircraft_uuid RETURNING * INTO parent;
 SELECT coalesce(jsonb_agg(p ORDER BY p.display_order),'[]'::jsonb) INTO gallery FROM aircraft_photos p WHERE aircraft_id=aircraft_uuid;
 RETURN jsonb_build_object('aircraft_id',aircraft_uuid,'updated_at',parent.updated_at,'photos',gallery,'old_images_retained',true);
END $$;
