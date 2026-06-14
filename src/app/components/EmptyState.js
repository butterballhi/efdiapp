'use client';

import { CloudUploadIcon, SparklesIcon, FlowerIcon } from './icons';

export default function EmptyState({ message = "Belum ada momen di sini, yuk upload kenangan pertama kalian!", onUpload }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
      {/* Decorative elements */}
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD6E8 0%, #E5D4F5 100%)' }}>
          <CloudUploadIcon size={48} className="text-pink-bold deco-float" />
        </div>
        {/* Floating decorations */}
        <div className="absolute -top-2 -right-2 text-yellow-pastel deco-star">
          <SparklesIcon size={20} />
        </div>
        <div className="absolute -bottom-1 -left-3 text-pink-pastel">
          <FlowerIcon size={18} />
        </div>
        <div className="absolute top-0 left-0 text-lavender-pastel deco-star" style={{ animationDelay: '0.5s' }}>
          <SparklesIcon size={14} />
        </div>
      </div>

      <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">
        Belum Ada Kenangan ✨
      </h3>
      <p className="text-text-secondary font-body text-sm max-w-xs mb-6 leading-relaxed">
        {message}
      </p>

      {onUpload && (
        <button onClick={onUpload} className="btn btn-primary">
          <CloudUploadIcon size={18} />
          Upload Sekarang
        </button>
      )}
    </div>
  );
}
