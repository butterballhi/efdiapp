'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HomeIcon, LogOutIcon } from './icons';
import { useAuth } from './AuthProvider';

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  if (!user) return null; // Don't show bottom nav if not logged in

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'B';
  const initial = displayName.charAt(0).toUpperCase();

  const handleNavigation = (e, href) => {
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    setIsNavigating(true);
    // Timeout to reset navigating state in case navigation is fast
    setTimeout(() => setIsNavigating(false), 1000);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-fade-in-up">
        <div className="bg-white/95 backdrop-blur-xl border-t border-pink-pastel/30 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-around py-2">
            
            {/* Album Button */}
            <Link
              href="/"
              onClick={(e) => handleNavigation(e, '/')}
              className={`flex flex-col items-center gap-1 py-1.5 px-6 rounded-2xl no-underline transition-all duration-300 min-w-[70px] ${
                pathname === '/' || pathname.startsWith('/album')
                  ? 'text-pink-bold bg-pink-pastel/20'
                  : 'text-text-secondary hover:text-pink-bold hover:bg-pink-pastel/10'
              }`}
            >
              {isNavigating && pathname !== '/' ? (
                <span className="w-6 h-6 border-2 border-pink-bold/30 border-t-pink-bold rounded-full animate-spin" />
              ) : (
                <HomeIcon size={24} />
              )}
              <span className="text-[10px] font-heading font-bold">Album</span>
            </Link>

            {/* Profile / Initial Button */}
            <div className="flex flex-col items-center gap-0 py-1 border-0 bg-transparent -mt-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-bold to-purple-bold flex items-center justify-center shadow-lg border-4 border-white mb-0.5">
                <span className="text-white font-bold font-heading text-lg">{initial}</span>
              </div>
              <span className="text-[10px] font-heading font-bold text-text-primary">
                Profil
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex flex-col items-center gap-1 py-1.5 px-6 rounded-2xl text-text-secondary transition-all duration-300 min-w-[70px] border-0 bg-transparent cursor-pointer hover:text-status-error-text hover:bg-status-error-bg/30 active:scale-95"
            >
              <LogOutIcon size={24} />
              <span className="text-[10px] font-heading font-bold">Keluar</span>
            </button>

          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {mounted && showLogoutModal && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <div className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 max-w-xs w-full shadow-2xl animate-scale-in text-center border-2 border-white/20">
            <div className="w-16 h-16 rounded-full bg-[var(--status-error-bg)] text-[var(--status-error-text)] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <LogOutIcon size={32} />
            </div>
            <h3 className="font-heading font-bold text-xl text-text-primary mb-2">Keluar Akun?</h3>
            <p className="text-text-secondary text-sm mb-7">Apakah kamu yakin ingin keluar dari aplikasi?</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-text-secondary bg-gray-100 hover:bg-gray-200 transition-colors border-0 cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={() => { setShowLogoutModal(false); signOut(); }}
                className="flex-1 py-3 px-4 rounded-xl font-body font-semibold text-white bg-[var(--status-error-text)] hover:opacity-90 transition-opacity shadow-md border-0 cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
