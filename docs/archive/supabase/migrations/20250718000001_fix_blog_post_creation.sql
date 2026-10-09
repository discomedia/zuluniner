-- Fix blog post creation for admins
-- Add policy to allow admins to create blog posts

CREATE POLICY "Admins can create blog posts" ON blog_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );