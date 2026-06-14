'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AlbumCard, { CreateAlbumCard } from './AlbumCard';
import StorageBar from './StorageBar';
import { SparklesIcon, StarIcon, HeartIcon, TrashIcon, CheckIcon, CloseIcon } from './icons';
import { createAlbum, deleteAlbum, updateAlbum } from '../lib/actions';

export default function DashboardClient({ albums: initialAlbums, storage, userName }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [creating, setCreating] = useState(false);
  const [albums, setAlbums] = useState(initialAlbums);

  // Edit State
  const [albumToEdit, setAlbumToEdit] = useState(null);
  const [editAlbumName, setEditAlbumName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Delete State
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim() || creating) return;
    setCreating(true);

    try {
      const newAlbum = await createAlbum(newAlbumName);
      setAlbums((prev) => [{ ...newAlbum, itemCount: 0 }, ...prev]);
      setNewAlbumName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create album:', error);
      alert('Gagal membuat album: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleEditAlbum = (album) => {
    setAlbumToEdit(album);
    setEditAlbumName(album.name);
  };

  const handleSaveEdit = async () => {
    if (!editAlbumName.trim() || editAlbumName === albumToEdit.name || isSavingName) return;
    setIsSavingName(true);
    try {
      await updateAlbum(albumToEdit.id, editAlbumName.trim());
      setAlbums((prev) => prev.map(a => a.id === albumToEdit.id ? { ...a, name: editAlbumName.trim() } : a));
      setAlbumToEdit(null);
    } catch (e) {
      console.error(e);
      alert('Gagal mengganti nama album.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!albumToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteAlbum(albumToDelete.id);
      setAlbums((prev) => prev.filter(a => a.id !== albumToDelete.id));
      setAlbumToDelete(null);
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus album.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 page-enter">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-text-secondary font-body">Selamat datang kembali</span>
            <SparklesIcon size={14} className="text-yellow-pastel deco-star" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-primary">
            Halo, {userName || 'Bestie'}! <span className="inline-block animate-[bounceIn_0.6s_ease_0.3s_both]">👋</span>
          </h1>
          <p className="text-sm text-text-secondary font-body mt-1">
            Ayo lihat kenangan-kenangan kalian~ 💕
          </p>
        </div>
        <div className="w-full sm:w-64">
          <StorageBar used={storage.used} total={storage.total} />
        </div>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-pastel to-transparent" />
        <div className="flex items-center gap-1.5 text-pink-pastel">
          <StarIcon size={10} />
          <HeartIcon size={12} />
          <StarIcon size={10} />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-pastel to-transparent" />
      </div>

      {/* Section title */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading font-semibold text-lg text-text-primary">
          Album Kalian
        </h2>
        <span className="text-xs text-text-secondary font-body">
          {albums.length} album
        </span>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="animate-fade-in-up delay-1">
          <CreateAlbumCard onClick={() => setShowCreateModal(true)} />
        </div>

        {albums.map((album, index) => (
          <div key={album.id} className={`animate-fade-in-up delay-${Math.min(index + 2, 6)}`}>
            <AlbumCard 
              album={{
                ...album,
                coverColor: album.cover_color || album.coverColor,
                itemCount: album.itemCount ?? album.item_count ?? 0,
                createdAt: album.created_at || album.createdAt,
              }} 
              onEdit={handleEditAlbum}
              onDelete={setAlbumToDelete}
            />
          </div>
        ))}
      </div>

      {/* Create Album Modal */}
      {mounted && showCreateModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-scale-in z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-pink-bold">
              <StarIcon size={14} className="deco-star" />
              <HeartIcon size={18} />
              <StarIcon size={14} className="deco-star" style={{ animationDelay: '0.3s' }} />
            </div>

            <h3 className="font-heading font-bold text-xl text-text-primary text-center mb-2">
              Album Baru ✨
            </h3>
            <p className="text-sm text-text-secondary text-center mb-6 font-body">
              Beri nama untuk momen spesial kalian~
            </p>

            <input
              type="text"
              className="input mb-4"
              placeholder="Contoh: Trip Bromo Juni 2026"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateAlbum()}
              autoFocus
              id="new-album-name-input"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary flex-1"
                disabled={creating}
              >
                Batal
              </button>
              <button
                onClick={handleCreateAlbum}
                className="btn btn-primary flex-1"
                disabled={!newAlbumName.trim() || creating}
                id="create-album-submit"
              >
                {creating ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  'Buat Album'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Album Modal */}
      {mounted && albumToEdit && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAlbumToEdit(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-scale-in z-10">
            <h3 className="font-heading font-bold text-xl text-text-primary text-center mb-2">
              Edit Nama Album
            </h3>
            <p className="text-sm text-text-secondary text-center mb-6 font-body">
              Ganti nama album sesuai keinginan kalian
            </p>

            <input
              type="text"
              className="input mb-4"
              placeholder="Contoh: Trip Bromo Juni 2026"
              value={editAlbumName}
              onChange={(e) => setEditAlbumName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setAlbumToEdit(null)}
                className="btn btn-secondary flex-1"
                disabled={isSavingName}
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn btn-primary flex-1"
                disabled={!editAlbumName.trim() || editAlbumName === albumToEdit.name || isSavingName}
              >
                {isSavingName ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  'Simpan'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Album Modal */}
      {mounted && albumToDelete && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAlbumToDelete(null)} />
          <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-scale-in text-center border-2 border-white/20">
            <div className="w-16 h-16 rounded-full bg-[var(--status-error-bg)] text-[var(--status-error-text)] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <TrashIcon size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2">Hapus Album?</h3>
            <p className="text-text-secondary text-sm mb-7">
              Semua foto dan video di dalam album <span className="font-semibold text-pink-bold">{albumToDelete.name}</span> akan terhapus secara permanen. Apakah kalian yakin? 🥺
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setAlbumToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-text-secondary bg-gray-100 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={handleDeleteAlbum}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-white bg-[var(--status-error-text)] hover:opacity-90 transition-opacity shadow-md border-0 cursor-pointer flex justify-center items-center gap-2"
              >
                {isDeleting ? (
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
