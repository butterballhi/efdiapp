'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MediaGrid from './MediaGrid';
import UploadZone from './UploadZone';
import EmptyState from './EmptyState';
import { ChevronLeftIcon, DownloadIcon, UploadIcon, CalendarIcon, ImageIcon, TrashIcon, EditIcon, CheckIcon, CloseIcon } from './icons';
import { createMediaItem, deleteMediaItem } from '../lib/actions';

export default function AlbumDetailClient({ album, initialItems }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Delete Album State
  const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);
  const [isDeletingAlbum, setIsDeletingAlbum] = useState(false);

  const handleConfirmDeleteAlbum = async () => {
    setIsDeletingAlbum(true);
    try {
      const { deleteAlbum } = await import('../lib/actions');
      await deleteAlbum(album.id);
      router.push('/');
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus album.');
      setIsDeletingAlbum(false);
      setShowDeleteAlbumModal(false);
    }
  };
  
  // Edit Name State
  const [albumName, setAlbumName] = useState(album.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleSaveName = async () => {
    if (!albumName.trim() || albumName === album.name) {
      setIsEditingName(false);
      setAlbumName(album.name);
      return;
    }
    
    setIsSavingName(true);
    try {
      const { updateAlbum } = await import('../lib/actions');
      await updateAlbum(album.id, albumName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to rename album:', error);
      alert('Gagal mengganti nama album.');
      setAlbumName(album.name); // revert on error
    } finally {
      setIsSavingName(false);
    }
  };

  const handleUploadComplete = useCallback(async ({ fileName, fileKey, fileSize, mimeType, type }) => {
    try {
      const newItem = await createMediaItem({
        albumId: album.id,
        fileName,
        fileKey,
        fileSize,
        mimeType,
        type,
      });
      setItems((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error('Failed to save media item:', error);
    }
  }, [album.id]);

  const requestDelete = useCallback((itemId) => {
    setItemToDelete(itemId);
  }, []);

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMediaItem(itemToDelete, album.id);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Gagal menghapus foto.');
    } finally {
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  // Map Supabase fields to component-expected format
  const mappedItems = items.map((item) => ({
    id: item.id,
    type: item.type,
    fileName: item.file_name || item.fileName,
    fileKey: item.file_key || item.fileKey,
    thumbnailColor: ['#FFD6E8', '#E5D4F5', '#D4F5E9', '#FFF3B0', '#FFE0CC'][
      Math.abs(item.id?.charCodeAt?.(0) || 0) % 5
    ],
    status: item.status,
    uploader: item.uploaded_by_name || 'Bestie',
    date: item.created_at || item.date,
    size: item.file_size ? formatBytes(item.file_size) : '0 B',
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 page-enter">
      {/* Back navigation */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-pink-bold transition-colors no-underline mb-5 font-heading font-semibold group">
        <ChevronLeftIcon size={18} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Album
      </Link>

      {/* Album Header */}
      <div className="rounded-2xl p-5 sm:p-7 mb-6" style={{ background: album.cover_color }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1 w-full">
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-2 w-full max-w-md animate-fade-in">
                <input
                  type="text"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="input py-1.5 px-3 text-lg sm:text-xl font-bold font-heading m-0 flex-1"
                  autoFocus
                  disabled={isSavingName}
                />
                <button 
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="w-9 h-9 rounded-xl bg-pink-bold text-white flex items-center justify-center border-0 cursor-pointer shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                  title="Simpan Nama"
                >
                  {isSavingName ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                  ) : (
                    <CheckIcon size={18} />
                  )}
                </button>
                <button 
                  onClick={() => {
                    setAlbumName(album.name);
                    setIsEditingName(false);
                  }}
                  disabled={isSavingName}
                  className="w-9 h-9 rounded-xl bg-white/50 text-text-secondary hover:text-status-error-text flex items-center justify-center border-0 cursor-pointer transition-colors"
                  title="Batal"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-2 group/title">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary m-0">
                  {albumName}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="w-8 h-8 rounded-full bg-white/50 text-text-secondary hover:text-pink-bold hover:bg-white flex items-center justify-center transition-all border-0 cursor-pointer"
                  title="Edit Nama Album"
                >
                  <EditIcon size={16} />
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-text-secondary font-body">
                <CalendarIcon size={14} />
                {formatDate(album.created_at)}
              </span>
              <span className="flex items-center gap-1.5 text-text-secondary font-body">
                <ImageIcon size={14} />
                {mappedItems.length} item
              </span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button 
              className="btn bg-transparent hover:bg-status-error-bg text-text-secondary hover:text-status-error-text text-sm py-2.5 px-5 transition-colors border-2 border-white/50 hover:border-[var(--status-error-text)]" 
              onClick={() => setShowDeleteAlbumModal(true)}
              title="Hapus Album"
            >
              <TrashIcon size={16} />
              Hapus Album
            </button>
            <button 
              className="btn bg-white/50 hover:bg-white text-[var(--purple-bold)] text-sm py-2.5 px-5 transition-colors border-0" 
              id="download-all-button"
              onClick={() => {
                mappedItems.forEach((item, index) => {
                  setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = `https://gzihdruyaqihkqmpaquc.supabase.co/storage/v1/object/public/efdiapp-vault/${item.fileKey}?download=`;
                    link.download = item.fileName || 'download';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }, index * 500); // 500ms delay between downloads to prevent browser blocking
                });
              }}
            >
              <DownloadIcon size={16} />
              Download Semua
            </button>
          </div>
        </div>
      </div>

      {/* Upload Zone (toggle) */}
      {showUpload && (
        <div className="mb-6">
          <UploadZone albumId={album.id} onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {/* Media Grid */}
      {mappedItems.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-base text-text-primary">
              Semua Media
            </h2>
            <div className="flex items-center gap-2 text-xs text-text-secondary font-body">
              <span className="badge badge-ready">{mappedItems.filter(i => i.status === 'ready').length} ready</span>
              {mappedItems.filter(i => i.status === 'processing').length > 0 && (
                <span className="badge badge-processing">{mappedItems.filter(i => i.status === 'processing').length} processing</span>
              )}
            </div>
          </div>
          <MediaGrid items={mappedItems} onDelete={requestDelete} />
        </div>
      ) : (
        <EmptyState onUpload={() => setShowUpload(true)} />
      )}

      {/* Floating Upload Button (FAB) */}
      <button
        onClick={() => setShowUpload(!showUpload)}
        className="fixed bottom-24 md:bottom-8 right-4 sm:right-8 w-14 h-14 rounded-full bg-pink-bold text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 z-40 cursor-pointer border-0"
        style={{ boxShadow: '0 8px 25px rgba(255, 143, 177, 0.4)' }}
        id="fab-upload"
      >
        <UploadIcon size={24} className={`transition-transform duration-300 ${showUpload ? 'rotate-45' : ''}`} />
      </button>

      {/* Custom Delete Confirmation Modal */}
      {mounted && itemToDelete && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDelete} />
          <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-xs w-full shadow-2xl animate-scale-in text-center border-2 border-white/20">
            <div className="w-16 h-16 rounded-full bg-[var(--status-error-bg)] text-[var(--status-error-text)] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <TrashIcon size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2">Hapus Foto?</h3>
            <p className="text-text-secondary text-sm mb-7">Foto ini akan dihapus permanen. Proses ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={cancelDelete}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-text-secondary bg-gray-100 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-white bg-[var(--status-error-text)] hover:opacity-90 transition-opacity shadow-md border-0 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Album Confirmation Modal */}
      {mounted && showDeleteAlbumModal && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteAlbumModal(false)} />
          <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-scale-in text-center border-2 border-white/20">
            <div className="w-16 h-16 rounded-full bg-[var(--status-error-bg)] text-[var(--status-error-text)] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <TrashIcon size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2">Hapus Album?</h3>
            <p className="text-text-secondary text-sm mb-7">
              Semua foto dan video di dalam album <span className="font-semibold text-pink-bold">{album.name}</span> akan terhapus secara permanen. Apakah kalian yakin? 🥺
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowDeleteAlbumModal(false)}
                disabled={isDeletingAlbum}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-text-secondary bg-gray-100 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmDeleteAlbum}
                disabled={isDeletingAlbum}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-white bg-[var(--status-error-text)] hover:opacity-90 transition-opacity shadow-md border-0 cursor-pointer flex justify-center items-center gap-2"
              >
                {isDeletingAlbum ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
