'use client';

import Link from 'next/link';
import { ImageIcon, VideoIcon, CalendarIcon, EditIcon, TrashIcon } from './icons';

export default function AlbumCard({ album, onEdit, onDelete }) {
  return (
    <Link href={`/album/${album.id}`} className="no-underline group">
      <div className="card cursor-pointer">
        {/* Cover area */}
        <div
          className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden"
          style={{ background: album.coverColor }}
        >
          {album.thumbnail ? (
            <img 
              src={`https://gzihdruyaqihkqmpaquc.supabase.co/storage/v1/object/public/efdiapp-vault/${album.thumbnail.file_key}`}
              alt={album.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 opacity-20">
              {/* Decorative pattern */}
              <div className="absolute top-3 right-3 rotate-12">
                <ImageIcon size={28} className="text-white" />
              </div>
              <div className="absolute bottom-4 left-4 -rotate-6">
                <VideoIcon size={24} className="text-white" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ImageIcon size={56} className="text-white" />
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

          {/* Item count badge */}
          <div className="absolute top-3 right-3 badge badge-count z-10">
            {album.itemCount} item
          </div>

          {/* Bottom gradient overlay for title */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Info */}
        <div className="p-4 relative">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-semibold text-sm text-text-primary truncate group-hover:text-pink-bold transition-colors duration-200">
              {album.name}
            </h3>
            
            {/* Quick Actions (Hover) */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 bg-white/90 backdrop-blur-sm rounded-full shadow-sm p-0.5">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit?.(album); }}
                className="w-7 h-7 flex items-center justify-center rounded-full text-text-secondary hover:text-pink-bold hover:bg-pink-pastel/30 transition-colors border-0 bg-transparent cursor-pointer"
                title="Edit Nama"
              >
                <EditIcon size={14} />
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(album); }}
                className="w-7 h-7 flex items-center justify-center rounded-full text-text-secondary hover:text-status-error-text hover:bg-status-error-bg transition-colors border-0 bg-transparent cursor-pointer"
                title="Hapus Album"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 mt-1.5">
            <CalendarIcon size={12} className="text-text-secondary" />
            <span className="text-xs text-text-secondary font-body">
              {new Date(album.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CreateAlbumCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer bg-transparent border-0 p-0 text-left group"
      id="create-album-button"
    >
      <div
        className="w-full aspect-[4/3] rounded-t-[var(--radius-xl)] flex flex-col items-center justify-center border-2 border-dashed border-pink-pastel bg-pink-pastel/10 group-hover:border-pink-bold group-hover:bg-pink-pastel/25 transition-all duration-300"
      >
        <div className="w-14 h-14 rounded-full bg-pink-pastel/50 flex items-center justify-center mb-3 group-hover:bg-pink-bold/20 group-hover:scale-110 transition-all duration-300">
          <span className="text-2xl text-pink-bold font-light">+</span>
        </div>
        <span className="font-heading font-semibold text-sm text-pink-bold">
          Buat Album Baru
        </span>
        <span className="text-xs text-text-secondary mt-1">
          Simpan momen bersama ✨
        </span>
      </div>
      <div className="p-4 bg-white rounded-b-[var(--radius-xl)] shadow-[var(--shadow-soft)]">
        <h3 className="font-heading font-semibold text-sm text-text-secondary">
          Album Baru
        </h3>
        <span className="text-xs text-text-secondary/60 font-body">Klik untuk membuat</span>
      </div>
    </button>
  );
}
