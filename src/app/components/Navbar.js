'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CameraIcon, MenuIcon, LogOutIcon, UserIcon } from './icons';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Bestie';
  const displayEmail = user?.email || '';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg-cream/90" style={{ borderBottom: '2px solid var(--pink-pastel)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pink-bold text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]">
              <CameraIcon size={20} />
            </div>
            <span className="font-heading text-xl font-bold text-text-primary tracking-tight">
              Efdi<span className="text-pink-bold">App</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/" className="px-4 py-2 rounded-full text-sm font-semibold font-heading text-text-primary no-underline hover:bg-pink-pastel/50 transition-all duration-200">
              Album
            </Link>

            {/* Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-pink-bold border-2 border-pink-pastel bg-white hover:border-pink-bold hover:bg-pink-pastel/30 transition-all duration-200 cursor-pointer"
                  id="profile-button"
                >
                  <span className="text-sm font-bold font-heading">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-lg border border-pink-pastel/50 py-2 animate-scale-in overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-pink-pastel/30">
                      <p className="font-heading font-semibold text-sm text-text-primary">{displayName}</p>
                      <p className="text-xs text-text-secondary truncate">{displayEmail}</p>
                    </div>
                    <button
                      onClick={() => { setProfileOpen(false); signOut(); }}
                      className="w-full px-4 py-2.5 text-left text-sm text-status-error-text hover:bg-status-error-bg/30 flex items-center gap-2 transition-colors cursor-pointer border-0 bg-transparent"
                    >
                      <LogOutIcon size={16} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <Link href="/login" className="btn btn-primary text-sm py-2 px-5 no-underline">
                Masuk
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Click outside handler overlay */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </nav>
  );
}
