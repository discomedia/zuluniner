-- Row Level Security Policies for ZuluNiner

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view basic user info" ON users
  FOR SELECT USING (true);

-- Aircraft table policies
CREATE POLICY "Anyone can view active aircraft" ON aircraft
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can view all aircraft" ON aircraft
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view own aircraft" ON aircraft
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create aircraft" ON aircraft
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own aircraft" ON aircraft
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any aircraft" ON aircraft
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can delete own aircraft" ON aircraft
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any aircraft" ON aircraft
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Aircraft photos policies
CREATE POLICY "Anyone can view photos of active aircraft" ON aircraft_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM aircraft 
      WHERE aircraft.id = aircraft_photos.aircraft_id 
      AND aircraft.status = 'active'
    )
  );

CREATE POLICY "Users can view photos of own aircraft" ON aircraft_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM aircraft 
      WHERE aircraft.id = aircraft_photos.aircraft_id 
      AND aircraft.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all photos" ON aircraft_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can manage photos of own aircraft" ON aircraft_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM aircraft 
      WHERE aircraft.id = aircraft_photos.aircraft_id 
      AND aircraft.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all photos" ON aircraft_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authors can view own blog posts" ON blog_posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Admins can view all blog posts" ON blog_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create blog posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own blog posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can update all blog posts" ON blog_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Authors can delete own blog posts" ON blog_posts
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete all blog posts" ON blog_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
