'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseServerClient } from './supabase/server';

// ============ Album Actions ============

export async function createAlbum(name) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const gradients = [
    'linear-gradient(135deg, #FFD6E8 0%, #E5D4F5 100%)',
    'linear-gradient(135deg, #FFF3B0 0%, #FFE0CC 100%)',
    'linear-gradient(135deg, #D4F5E9 0%, #E5D4F5 100%)',
    'linear-gradient(135deg, #FFE0CC 0%, #FFD6E8 100%)',
    'linear-gradient(135deg, #E5D4F5 0%, #FFF3B0 100%)',
  ];

  const { data, error } = await supabase
    .from('albums')
    .insert({
      name,
      cover_color: gradients[Math.floor(Math.random() * gradients.length)],
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/');
  return data;
}

export async function updateAlbum(id, name) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('albums')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('created_by', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath(`/album/${id}`);
  return data;
}

export async function deleteAlbum(id) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Get all media items to delete from R2
  const { data: mediaItems } = await supabase
    .from('media_items')
    .select('file_key')
    .eq('album_id', id);

  // Delete Supabase Storage objects
  if (mediaItems && mediaItems.length > 0) {
    const fileKeys = mediaItems.map(item => item.file_key);
    try {
      await supabase.storage.from('efdiapp-vault').remove(fileKeys);
    } catch (e) {
      console.error('Failed to delete storage objects:', e);
    }
  }

  // Delete album (cascade deletes media_items)
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', id)
    .eq('created_by', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/');
}

// ============ Media Actions ============

export async function createMediaItem({ albumId, fileName, fileKey, fileSize, mimeType, type }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const uploaderName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown';

  const { data, error } = await supabase
    .from('media_items')
    .insert({
      album_id: albumId,
      file_name: fileName,
      file_key: fileKey,
      file_size: fileSize,
      mime_type: mimeType,
      type,
      status: 'ready', // For now, mark as ready immediately (no compression pipeline yet)
      uploaded_by: user.id,
      uploaded_by_name: uploaderName,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Update album updated_at
  await supabase
    .from('albums')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', albumId);

  revalidatePath(`/album/${albumId}`);
  revalidatePath('/');
  return data;
}

export async function deleteMediaItem(id, albumId) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Get file key first
  const { data: item } = await supabase
    .from('media_items')
    .select('file_key')
    .eq('id', id)
    .single();

  if (item) {
    try {
      await supabase.storage.from('efdiapp-vault').remove([item.file_key]);
    } catch (e) {
      console.error('Failed to delete storage object:', item.file_key, e);
    }
  }

  const { error } = await supabase
    .from('media_items')
    .delete()
    .eq('id', id)
    .eq('uploaded_by', user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/album/${albumId}`);
  revalidatePath('/');
}

// ============ Data Fetching ============

export async function getAlbums() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('albums')
    .select(`
      *,
      media_items(count)
    `)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);

  const albumsWithThumbnails = await Promise.all(data.map(async (album) => {
    const { data: latestMedia } = await supabase
      .from('media_items')
      .select('file_key, type')
      .eq('album_id', album.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      ...album,
      itemCount: album.media_items?.[0]?.count || 0,
      thumbnail: latestMedia || null,
    };
  }));

  return albumsWithThumbnails;
}

export async function getAlbumById(id) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getMediaItems(albumId) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('media_items')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getStorageUsage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { used: 0, total: 10, percentage: 0 };

  const { data, error } = await supabase
    .from('media_items')
    .select('file_size');

  if (error) return { used: 0, total: 10, percentage: 0 };

  const totalBytes = data.reduce((sum, item) => sum + (item.file_size || 0), 0);
  const usedGB = totalBytes / (1024 * 1024 * 1024);
  const totalGB = 10; // Free tier limit

  return {
    used: Math.round(usedGB * 100) / 100,
    total: totalGB,
    percentage: Math.round((usedGB / totalGB) * 100),
  };
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
