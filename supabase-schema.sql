-- ============================================
-- BestiVault Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Albums table
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cover_color TEXT DEFAULT 'linear-gradient(135deg, #FFD6E8 0%, #E5D4F5 100%)',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Media items table
CREATE TABLE media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_key TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  mime_type TEXT,
  type TEXT CHECK (type IN ('photo', 'video')) NOT NULL,
  status TEXT CHECK (status IN ('uploading', 'processing', 'ready', 'error')) DEFAULT 'uploading',
  thumbnail_key TEXT,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  uploaded_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster queries
CREATE INDEX idx_media_items_album_id ON media_items(album_id);
CREATE INDEX idx_media_items_uploaded_by ON media_items(uploaded_by);
CREATE INDEX idx_albums_created_by ON albums(created_by);

-- Row Level Security
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Albums policies
CREATE POLICY "Anyone authenticated can read albums" ON albums
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create albums" ON albums
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Album creators can update" ON albums
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Album creators can delete" ON albums
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Media policies
CREATE POLICY "Anyone authenticated can read media" ON media_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can upload media" ON media_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Media uploaders can update" ON media_items
  FOR UPDATE TO authenticated USING (auth.uid() = uploaded_by);

CREATE POLICY "Media uploaders can delete" ON media_items
  FOR DELETE TO authenticated USING (auth.uid() = uploaded_by);

-- Function to get album item count
CREATE OR REPLACE FUNCTION get_album_with_count()
RETURNS TABLE (
  id UUID,
  name TEXT,
  cover_color TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  item_count BIGINT
) AS $$
  SELECT 
    a.id, a.name, a.cover_color, a.created_by, a.created_at, a.updated_at,
    COUNT(m.id) as item_count
  FROM albums a
  LEFT JOIN media_items m ON m.album_id = a.id
  GROUP BY a.id
  ORDER BY a.updated_at DESC;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to get storage usage for a user
CREATE OR REPLACE FUNCTION get_storage_usage(user_id UUID)
RETURNS TABLE (total_bytes BIGINT, total_files BIGINT) AS $$
  SELECT 
    COALESCE(SUM(file_size), 0)::BIGINT as total_bytes,
    COUNT(*)::BIGINT as total_files
  FROM media_items
  WHERE uploaded_by = user_id;
$$ LANGUAGE sql SECURITY DEFINER;
