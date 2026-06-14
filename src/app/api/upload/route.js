import { getSupabaseServerClient } from '../../lib/supabase/server';
import { getPresignedUploadUrl, generateFileKey } from '../../lib/r2';

export async function POST(request) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileName, fileType, albumId } = await request.json();

    if (!fileName || !fileType || !albumId) {
      return Response.json(
        { error: 'Missing required fields: fileName, fileType, albumId' },
        { status: 400 }
      );
    }

    // Verify album exists
    const { data: album } = await supabase
      .from('albums')
      .select('id')
      .eq('id', albumId)
      .single();

    if (!album) {
      return Response.json({ error: 'Album not found' }, { status: 404 });
    }

    // Generate unique file key and presigned URL
    const fileKey = generateFileKey(albumId, fileName);
    const uploadUrl = await getPresignedUploadUrl(fileKey, fileType);

    return Response.json({
      uploadUrl,
      fileKey,
    });
  } catch (error) {
    console.error('Upload presign error:', error);
    return Response.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
