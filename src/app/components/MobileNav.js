'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UploadIcon, UserIcon } from './icons';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: HomeIcon, label: 'Album' },
    { href: '#upload', icon: UploadIcon, label: 'Upload', isAction: true },
    { href: '/login', icon: UserIcon, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/90 backdrop-blur-lg border-t-2 border-pink-pastel/50 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-1.5">
          {navItems.map((item) => {
            const isActive = item.href === pathname;
            const Icon = item.icon;

            if (item.isAction) {
              return (
                <button
                  key={item.label}
                  className="flex flex-col items-center gap-0.5 py-1 px-4 border-0 bg-transparent cursor-pointer"
                  id="mobile-upload-button"
                >
                  <div className="w-11 h-11 rounded-full bg-pink-bold flex items-center justify-center shadow-md -mt-5 border-4 border-white">
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] font-heading font-semibold text-pink-bold">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-5 rounded-xl no-underline transition-colors duration-200 min-w-[56px] ${
                  isActive
                    ? 'text-pink-bold'
                    : 'text-text-secondary hover:text-pink-bold'
                }`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-heading font-semibold">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-pink-bold mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
