'use client';

export default function StorageBar({ used = 3.2, total = 10 }) {
  const percentage = Math.round((used / total) * 100);
  const isWarning = percentage > 80;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold font-heading text-text-secondary">
          Penyimpanan
        </span>
        <span className="text-xs font-bold font-heading" style={{ color: isWarning ? 'var(--status-error-text)' : 'var(--text-secondary)' }}>
          {used} GB / {total} GB
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-pink-pastel/40 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: isWarning
              ? 'linear-gradient(90deg, #FF8FB1, #C2185B)'
              : 'linear-gradient(90deg, #FF8FB1, #B89FE8)',
          }}
        />
      </div>
      {isWarning && (
        <p className="text-xs mt-1 text-status-error-text font-body">
          Penyimpanan udah mau penuh nih, yuk cek album lama! 💫
        </p>
      )}
    </div>
  );
}
