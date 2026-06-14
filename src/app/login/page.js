'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CameraIcon, SparklesIcon, HeartIcon, StarIcon, FlowerIcon } from '../components/icons';
import { getSupabaseBrowserClient } from '../lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const supabase = getSupabaseBrowserClient();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccess('Berhasil masuk! Sedang memuat halaman...');
        router.push('/');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });
        if (error) throw error;
        
        if (data?.session) {
          // Auto login jika email confirmation mati
          setSuccess('Berhasil mendaftar! Mengarahkan ke dashboard...');
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 1500);
        } else {
          // Perlu konfirmasi email
          setSuccess('Akun berhasil dibuat! Silakan cek email kamu untuk verifikasi sebelum masuk.');
          setLoading(false);
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
          }, 5000);
        }
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email atau password salah, coba lagi ya~'
        : err.message === 'User already registered'
          ? 'Email sudah terdaftar, coba masuk aja~'
          : err.message
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden -mt-16 pt-16"
      style={{ background: 'linear-gradient(135deg, #FFD6E8 0%, #E5D4F5 50%, #FFF3B0 100%)' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] text-white/30 deco-float" style={{ animationDelay: '0s' }}>
          <HeartIcon size={40} />
        </div>
        <div className="absolute top-[20%] right-[8%] text-white/20 deco-float" style={{ animationDelay: '1s' }}>
          <StarIcon size={32} />
        </div>
        <div className="absolute bottom-[15%] left-[10%] text-white/25 deco-float" style={{ animationDelay: '0.5s' }}>
          <FlowerIcon size={36} />
        </div>
        <div className="absolute bottom-[25%] right-[12%] text-white/20 deco-float" style={{ animationDelay: '1.5s' }}>
          <SparklesIcon size={28} />
        </div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-white/10">
          <HeartIcon size={300} />
        </div>
        <div className="absolute top-[40%] left-[25%] text-white/15 deco-star">
          <StarIcon size={16} />
        </div>
        <div className="absolute top-[60%] right-[30%] text-white/15 deco-star" style={{ animationDelay: '0.8s' }}>
          <StarIcon size={12} />
        </div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="bg-bg-cream rounded-3xl shadow-2xl p-7 sm:p-9 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #FF8FB1, #B89FE8, #FF8FB1)' }} />

          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-pink-bold text-white mb-3 shadow-md animate-[bounceIn_0.6s_ease_both]">
              <CameraIcon size={28} />
            </div>
            <h1 className="font-heading text-2xl font-bold text-text-primary">
              Efdi<span className="text-pink-bold">App</span>
            </h1>
            <p className="text-sm text-text-secondary font-body mt-1">
              Simpan kenangan bersama ✨
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-status-error-bg/50 border border-status-error-bg animate-fade-in">
              <p className="text-sm text-status-error-text font-body text-center">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-100/50 border border-green-200 animate-fade-in">
              <p className="text-sm text-green-700 font-body text-center">{success}</p>
            </div>
          )}

          {/* Tab toggle */}
          <div className="flex bg-pink-pastel/30 rounded-full p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-heading font-semibold transition-all duration-300 cursor-pointer border-0 ${
                isLogin
                  ? 'bg-white text-pink-bold shadow-sm'
                  : 'bg-transparent text-text-secondary hover:text-text-primary'
              }`}
              id="login-tab"
            >
              Masuk
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-heading font-semibold transition-all duration-300 cursor-pointer border-0 ${
                !isLogin
                  ? 'bg-white text-pink-bold shadow-sm'
                  : 'bg-transparent text-text-secondary hover:text-text-primary'
              }`}
              id="register-tab"
            >
              Daftar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-heading font-semibold text-text-secondary mb-1.5 ml-1">
                  Nama Kamu
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Nama panggilanmu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="register-name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-semibold text-text-secondary mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="login-email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-text-secondary mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="login-password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-base mt-2 disabled:opacity-60"
              disabled={loading}
              id="auth-submit"
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                isLogin ? 'Masuk' : 'Buat Akun'
              )}
            </button>
          </form>

          {/* Bottom text */}
          <p className="text-center text-xs text-text-secondary mt-5 font-body">
            {isLogin ? (
              <>Belum punya akun? <button onClick={() => { setIsLogin(false); setError(''); }} className="text-pink-bold font-semibold cursor-pointer bg-transparent border-0 font-body hover:underline">Daftar yuk!</button></>
            ) : (
              <>Sudah punya akun? <button onClick={() => { setIsLogin(true); setError(''); }} className="text-pink-bold font-semibold cursor-pointer bg-transparent border-0 font-body hover:underline">Masuk di sini</button></>
            )}
          </p>
        </div>

        {/* Bottom decorative */}
        <div className="flex justify-center mt-6 gap-2 text-white/40">
          <StarIcon size={12} className="deco-star" />
          <HeartIcon size={14} />
          <StarIcon size={12} className="deco-star" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}
