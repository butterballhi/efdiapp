import { getSupabaseServerClient } from '../../lib/supabase/server';
import { getPresignedDownloadUrl } from '../../lib/r2';

export async function GET(request) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('key');

    if (!fileKey) {
      return Response.json(
        { error: 'Missing required query parameter: key' },
        { status: 400 }
      );
    }

    const downloadUrl = await getPresignedDownloadUrl(fileKey);

    return Response.json({ downloadUrl });
  } catch (error) {
    console.error('Download presign error:', error);
    return Response.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
