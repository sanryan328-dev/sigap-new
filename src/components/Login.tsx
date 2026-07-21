import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, AlertCircle, LogIn, X, History } from 'lucide-react';
import { getSavedAccounts, removeSavedAccount } from '../utils/savedAccounts';
import type { SavedAccount } from '../utils/savedAccounts';
import logoSekolah from '../assets/logo.jpg';

interface LoginProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  pesanEror: string;
}

export default function Login({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
  pesanEror,
}: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSavedAccounts(getSavedAccounts());
  }, []);

  const pickAccount = (acc: SavedAccount) => {
    setUsername(acc.username);
    setTimeout(() => passwordRef.current?.focus(), 50);
  };

  const removeAccount = (username: string) => {
    removeSavedAccount(username);
    setSavedAccounts((prev) => prev.filter((a) => a.username !== username));
  };

  return (
    <div
      className="flex min-h-dvh items-center justify-center p-4"
      style={{ backgroundColor: '#fefaef' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 sm:p-8 border space-y-6"
        style={{
          backgroundColor: '#fefaef',
          borderColor: '#f4aa18',
          color: '#1d1601',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src={logoSekolah}
            alt="Logo SIGAP SPENSAWA"
            className="size-28 rounded-box object-contain shadow-xs"
          />
          <h2 className="text-base font-bold" style={{ color: '#1d1601' }}>SIGAP SPENSAWA</h2>
        </div>

        {pesanEror && (
          <div
            className="flex items-center gap-2 p-3 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#fefaef', border: '1px solid #f4aa18', color: '#1d1601' }}
          >
            <AlertCircle className="size-4 shrink-0" />
            <span>{pesanEror}</span>
          </div>
        )}

        {/* ── Akun Tersimpan ── */}
        {savedAccounts.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: '#1d1601' }}>
              <History className="size-4" />
              Akun tersimpan
            </p>
            <div className="flex flex-wrap gap-2">
              {savedAccounts.map((acc) => (
                <div
                  key={acc.username}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border text-sm cursor-pointer group"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#f4aa18',
                    color: '#1d1601',
                  }}
                  onClick={() => pickAccount(acc)}
                >
                  <span className="font-semibold">{acc.nama_lengkap || acc.username}</span>
                  <span className="text-xs opacity-60">{acc.role || ''}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAccount(acc.username);
                    }}
                    className="ml-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-100"
                    aria-label={`Hapus ${acc.username}`}
                  >
                    <X className="size-3.5" style={{ color: '#1d1601' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Username Akun Guru</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username anda…"
              autoComplete="new-username"
              className="w-full p-2.5 border rounded-lg text-base outline-none"
              style={{
                backgroundColor: '#fefaef',
                borderColor: '#f4aa18',
                color: '#1d1601',
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Password</label>
            <div className="flex">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full p-2.5 border rounded-l-lg text-base outline-none"
                style={{
                  backgroundColor: '#fefaef',
                  borderColor: '#f4aa18',
                  color: '#1d1601',
                  borderRight: 'none',
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 border rounded-r-lg cursor-pointer"
                style={{
                  backgroundColor: '#fefaef',
                  borderColor: '#f4aa18',
                  color: '#1d1601',
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-lg text-base font-bold cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
          >
            <LogIn className="size-4" />
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
