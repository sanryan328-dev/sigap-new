import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
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

  return (
    <div className="flex min-h-dvh items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body items-center gap-6">
          <img
            src={logoSekolah}
            alt="Logo SIGAP SPENSAWA"
            className="size-28 rounded-box object-contain shadow-xs"
          />

          {pesanEror && (
            <div role="alert" className="alert alert-error py-2 text-sm">
              <AlertCircle className="size-4 shrink-0" />
              <span>{pesanEror}</span>
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off" className="flex w-full flex-col gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Username Akun Guru</span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username anda…"
                autoComplete="new-username"
                className="input input-bordered w-full"
                required
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <div className="join w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="input input-bordered join-item w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn join-item border-base-300 px-3"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            <button type="submit" className="btn btn-primary mt-2">
              <LogIn className="size-4" />
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
