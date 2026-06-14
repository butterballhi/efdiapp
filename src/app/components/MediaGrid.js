'use client';

import { useState } from 'react';
import { PlayIcon, DownloadIcon, ImageIcon, VideoIcon } from './icons';
import MediaViewer from './MediaViewer';

export default function MediaGrid({ items }) {
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
          />
        ))}
      </div>

      {viewerOpen && (
        <MediaViewer
          items={items}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

function MediaItem({ item, index, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-0 p-0 bg-transparent animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.04}s` }}
      id={`media-item-${item.id}`}
    >
      {/* Thumbnail placeholder */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: item.thumbnailColor }}
      >
        {item.type === 'video' ? (
          <VideoIcon size={32} className="text-white/60" />
        ) : (
          <ImageIcon size={32} className="text-white/60" />
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-250 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-250 flex gap-2">
          {item.type === 'video' && (
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
              <PlayIcon size={18} className="text-pink-bold ml-0.5" />
            </div>
          )}
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
            <DownloadIcon size={16} className="text-purple-bold" />
          </div>
        </div>
      </div>

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
    </button>
  );
}
