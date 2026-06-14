'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import MediaGrid from './MediaGrid';
import UploadZone from './UploadZone';
import EmptyState from './EmptyState';
import { ChevronLeftIcon, DownloadIcon, UploadIcon, CalendarIcon, ImageIcon } from './icons';
import { createMediaItem } from '../lib/actions';

export default function AlbumDetailClient({ album, initialItems }) {
  const [showUpload, setShowUpload] = useState(false);
  const [items, setItems] = useState(initialItems);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              {album.name}
            </h1>
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
            <button className="btn btn-secondary text-sm py-2.5 px-5" id="download-all-button">
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
          <MediaGrid items={mappedItems} />
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
