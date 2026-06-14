// BestiVault Mock Data for Phase 1 Frontend

export const mockUser = {
  id: '1',
  name: 'Rani',
  email: 'rani@bestivault.app',
  avatarUrl: null,
};

export const mockStorage = {
  used: 3.2, // GB
  total: 10,  // GB
  percentage: 32,
};

export const mockAlbums = [
  {
    id: '1',
    name: 'Trip Bromo Juni 2026',
    coverColor: 'linear-gradient(135deg, #FFD6E8 0%, #E5D4F5 100%)',
    itemCount: 24,
    createdAt: '2026-06-10',
    updatedAt: '2026-06-12',
  },
  {
    id: '2',
    name: 'Ulang Tahun Dina ✨',
    coverColor: 'linear-gradient(135deg, #FFF3B0 0%, #FFE0CC 100%)',
    itemCount: 18,
    createdAt: '2026-05-28',
    updatedAt: '2026-05-30',
  },
  {
    id: '3',
    name: 'Cafe Hopping Bandung',
    coverColor: 'linear-gradient(135deg, #D4F5E9 0%, #E5D4F5 100%)',
    itemCount: 32,
    createdAt: '2026-05-15',
    updatedAt: '2026-05-16',
  },
  {
    id: '4',
    name: 'Piknik Pantai Anyer',
    coverColor: 'linear-gradient(135deg, #FFE0CC 0%, #FFD6E8 100%)',
    itemCount: 45,
    createdAt: '2026-04-20',
    updatedAt: '2026-04-22',
  },
  {
    id: '5',
    name: 'Nonton Bareng 🎬',
    coverColor: 'linear-gradient(135deg, #E5D4F5 0%, #FFF3B0 100%)',
    itemCount: 8,
    createdAt: '2026-04-05',
    updatedAt: '2026-04-05',
  },
];

export const mockMediaItems = [
  {
    id: 'm1',
    type: 'photo',
    fileName: 'bromo-sunrise.jpg',
    thumbnailColor: '#FFD6E8',
    status: 'ready',
    uploader: 'Rani',
    date: '2026-06-10',
    size: '3.2 MB',
  },
  {
    id: 'm2',
    type: 'video',
    fileName: 'vlog-bromo-day1.mp4',
    thumbnailColor: '#E5D4F5',
    status: 'ready',
    uploader: 'Sinta',
    date: '2026-06-10',
    size: '1.2 GB',
  },
  {
    id: 'm3',
    type: 'photo',
    fileName: 'group-photo-peak.jpg',
    thumbnailColor: '#D4F5E9',
    status: 'ready',
    uploader: 'Mega',
    date: '2026-06-11',
    size: '4.5 MB',
  },
  {
    id: 'm4',
    type: 'video',
    fileName: 'jeep-adventure.mp4',
    thumbnailColor: '#FFF3B0',
    status: 'processing',
    uploader: 'Dina',
    date: '2026-06-11',
    size: '2.8 GB',
  },
  {
    id: 'm5',
    type: 'photo',
    fileName: 'sunset-view.jpg',
    thumbnailColor: '#FFE0CC',
    status: 'ready',
    uploader: 'Rani',
    date: '2026-06-11',
    size: '2.1 MB',
  },
  {
    id: 'm6',
    type: 'photo',
    fileName: 'cafe-aesthetic.jpg',
    thumbnailColor: '#FFD6E8',
    status: 'ready',
    uploader: 'Sinta',
    date: '2026-06-12',
    size: '1.8 MB',
  },
  {
    id: 'm7',
    type: 'video',
    fileName: 'hiking-timelapse.mp4',
    thumbnailColor: '#E5D4F5',
    status: 'ready',
    uploader: 'Mega',
    date: '2026-06-12',
    size: '890 MB',
  },
  {
    id: 'm8',
    type: 'photo',
    fileName: 'ootd-bromo.jpg',
    thumbnailColor: '#D4F5E9',
    status: 'ready',
    uploader: 'Dina',
    date: '2026-06-12',
    size: '5.1 MB',
  },
  {
    id: 'm9',
    type: 'photo',
    fileName: 'stargazing.jpg',
    thumbnailColor: '#FFF3B0',
    status: 'ready',
    uploader: 'Rani',
    date: '2026-06-12',
    size: '3.7 MB',
  },
];

export function getAlbumById(id) {
  return mockAlbums.find(a => a.id === id) || mockAlbums[0];
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatFileSize(sizeStr) {
  return sizeStr;
}
