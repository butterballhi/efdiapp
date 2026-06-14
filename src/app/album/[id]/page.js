export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import AlbumDetailClient from '../../components/AlbumDetailClient';
import { getAlbumById, getMediaItems } from '../../lib/actions';

export default async function AlbumDetailPage({ params }) {
  const { id } = await params;

  const [album, mediaItems] = await Promise.all([
    getAlbumById(id),
    getMediaItems(id),
  ]);

  if (!album) {
    notFound();
  }

  return (
    <AlbumDetailClient
      album={album}
      initialItems={mediaItems}
    />
  );
}
