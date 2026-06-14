'use client';

import { useState } from 'react';
import { PlayIcon, DownloadIcon, ImageIcon, VideoIcon, TrashIcon } from './icons';
import MediaViewer from './MediaViewer';

export default function MediaGrid({ items, onDelete }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (index) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {items.map((item, index) => (
          <MediaItem
            key={item.id}
            item={item}
            index={index}
            onClick={() => openViewer(index)}
            onDelete={onDelete}
          />
        ))}
      </div>

      {viewerOpen && (
        <MediaViewer
          items={items}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

function MediaItem({ item, index, onClick, onDelete }) {
  return (
    <div
      onClick={onClick}
      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-0 p-0 bg-transparent animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.04}s` }}
      id={`media-item-${item.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      }}
    >
      {/* Thumbnail placeholder or Image */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-gray-100"
        style={{ background: item.type === 'video' ? '#000' : '#f3f4f6' }}
      >
        {item.type === 'video' ? (
          <video 
            src={`https://gzihdruyaqihkqmpaquc.supabase.co/storage/v1/object/public/efdiapp-vault/${item.fileKey}#t=0.1`}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
          />
        ) : (
          <img 
            src={`https://gzihdruyaqihkqmpaquc.supabase.co/storage/v1/object/public/efdiapp-vault/${item.fileKey}`}
            alt={item.fileName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Video Play Icon Overlay */}
      {item.type === 'video' && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
            <PlayIcon size={18} className="text-pink-bold ml-0.5" />
          </div>
        </div>
      )}

      {/* Video indicator */}
      {item.type === 'video' && (
        <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <PlayIcon size={10} /> Video
        </div>
      )}

      {/* Status badge */}
      {item.status === 'processing' && (
        <div className="absolute top-2 right-2 badge badge-processing text-[10px] py-0.5 px-2">
          ⏳ Processing
        </div>
      )}
      {item.status === 'ready' && (
        <div className="absolute top-2 right-2 badge badge-ready text-[10px] py-0.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          ✓ Ready
        </div>
      )}
    </div>
  );
}
