export const dynamic = 'force-dynamic';

import DashboardClient from './components/DashboardClient';
import { getAlbums, getStorageUsage, getCurrentUser } from './lib/actions';

export default async function Home() {
  let albums = [];
  let storage = { used: 0, total: 10, percentage: 0 };
  let userName = 'Bestie';

  try {
    [albums, storage] = await Promise.all([
      getAlbums(),
      getStorageUsage(),
    ]);

    const user = await getCurrentUser();
    if (user) {
      userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Bestie';
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }

  return (
    <DashboardClient
      albums={albums}
      storage={storage}
      userName={userName}
    />
  );
}
