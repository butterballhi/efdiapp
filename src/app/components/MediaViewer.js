'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon, ImageIcon, VideoIcon, CalendarIcon, UserIcon, TrashIcon } from './icons';

export default function MediaViewer({ items, initialIndex = 0, onClose, onDelete }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const currentItem = items[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in" id="media-viewer">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div 
        className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 sm:p-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 z-20">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm font-heading font-semibold">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-[var(--status-error-text)] hover:bg-[var(--status-error-bg)] transition-all cursor-pointer border-0"
                title="Hapus Foto"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(currentItem.id);
                  if (items.length <= 1) {
                    onClose();
                  } else {
                    // if deleting the last item, go to previous
                    if (currentIndex === items.length - 1) {
                      goPrev();
                    }
                  }
                }}
              >
                <TrashIcon size={18} />
              </button>
            )}
            <button
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer border-0"
              title="Download"
              id="viewer-download"
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = `https://gzihdruyaqihkqmpaquc.supabase.co/storage/v1/object/public/efdiapp-vault/${currentItem.fileKey}?download=`;
                link.download = currentItem.fileName || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <DownloadIcon size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer border-0"
              id="viewer-close"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* Main media area */}
        <div 
          className="flex-1 flex items-center justify-center w-full max-w-4xl relative"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Prev button */}
          {items.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-0 sm:left-[-60px] w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer z-10 border-0"
              id="viewer-prev"
            >
              <ChevronLeftIcon size={22} />
            </button>
          )}

          {/* Media display */}
          <div className="w-full h-full max-h-[85vh] flex items-center justify-center animate-scale-in px-4" key={currentIndex}>
            {currentItem.type === 'video' ? (
              <video 
                src={`https://gzihdruyaqihkqmpaquc.supabase.co/storage/v1/object/public/efdiapp-vault/${currentItem.fileKey}`}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-black/50"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img 
                src={`https://gzihdruyaqihkqmpaquc.supabase.co/storage/v1/object/public/efdiapp-vault/${currentItem.fileKey}`}
                alt={currentItem.fileName}
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>

          {/* Next button */}
          {items.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-0 sm:right-[-60px] w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer z-10 border-0"
              id="viewer-next"
            >
              <ChevronRightIcon size={22} />
            </button>
          )}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-heading font-semibold truncate">
                {currentItem.fileName}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-white/60 text-xs font-body">
                  <UserIcon size={11} /> {currentItem.uploader}
                </span>
                <span className="flex items-center gap-1 text-white/60 text-xs font-body">
                  <CalendarIcon size={11} /> {new Date(currentItem.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
            {currentItem.status === 'processing' && (
              <div className="badge text-[10px] badge-processing">
                ⏳ Processing
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
