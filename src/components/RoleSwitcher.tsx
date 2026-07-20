import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  ClipboardList,
  GraduationCap,
  Users,
  Trophy,
  ShieldCheck,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import type { UserProfile } from '../store/useAuthStore';

interface RoleSwitcherProps {
  onSelect: (panel: 'kurikulum' | 'wali_kelas' | 'pembina_ekskul' | 'guru_piket' | 'guru_mapel') => void;
  onLogout: () => void;
}

type SubMenu = 'guru' | null;

interface PortalCard {
  role: 'wali_kelas' | 'pembina_ekskul' | 'guru_piket' | 'guru_mapel';
  icon: typeof GraduationCap;
  label: string;
  desc: string;
  color: string;
  gradient: string;
  ring: string;
}

const cardHover = {
  whileHover: { scale: 1.03, y: -4 },
  transition: { type: 'spring' as const, stiffness: 350, damping: 16 },
};

export default function RoleSwitcher({ onSelect, onLogout }: RoleSwitcherProps) {
  const profile = useAuthStore((s) => s.profile);
  const [subMenu, setSubMenu] = useState<SubMenu>(null);

  const portals: PortalCard[] = [
    {
      role: 'guru_mapel',
      icon: GraduationCap,
      label: 'Guru Mata Pelajaran',
      desc: 'Input jurnal mengajar, absensi jam ke-1, dan nilai siswa.',
      color: 'border-emerald-200/60',
      gradient: 'from-emerald-500 to-emerald-600',
      ring: 'ring-emerald-500/20',
    },
    ...(profile?.is_wali_kelas
      ? [{
          role: 'wali_kelas' as const,
          icon: Users,
          label: 'Panel Wali Kelas',
          desc: profile.kelas_wali
            ? `Kelola absensi & BK kelas ${profile.kelas_wali}.`
            : 'Kelola absensi & BK kelas binaan.',
          color: 'border-amber-200/60',
          gradient: 'from-amber-500 to-orange-500',
          ring: 'ring-amber-500/20',
        }]
      : []),
    ...(profile?.nama_ekstrakurikuler
      ? [{
          role: 'pembina_ekskul' as const,
          icon: Trophy,
          label: 'Panel Pembina Ekskul',
          desc: `Input jurnal, absensi, dan nilai ${profile.nama_ekstrakurikuler}.`,
          color: 'border-violet-200/60',
          gradient: 'from-violet-500 to-purple-600',
          ring: 'ring-violet-500/20',
        }]
      : []),
    ...(profile?.hari_piket && profile.hari_piket !== 'Tidak Ada'
      ? [{
          role: 'guru_piket' as const,
          icon: ShieldCheck,
          label: 'Panel Guru Piket',
          desc: 'Validasi izin guru dan pantau radar absensi harian.',
          color: 'border-indigo-200/60',
          gradient: 'from-indigo-500 to-indigo-600',
          ring: 'ring-indigo-500/20',
        }]
      : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-4"
    >
      <div className="w-full max-w-lg space-y-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-center"
        >
          <div className="badge badge-soft badge-primary badge-sm mb-2 uppercase tracking-widest">
            {subMenu === 'guru' ? 'Pilih Portal Tugas' : 'Pilih Panel Akses'}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {profile?.nama_lengkap}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {subMenu === 'guru'
              ? 'Pilih portal yang ingin Anda buka untuk memulai tugas.'
              : 'Anda memiliki akses lebih dari satu peran.'}
          </p>
        </motion.div>

        {/* ── STAGE 1: Pilihan Utama ── */}
        <AnimatePresence mode="wait">
          {subMenu === null && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Card 1: Kurikulum */}
              <motion.button
                {...cardHover}
                onClick={() => onSelect('kurikulum')}
                className="card w-full cursor-pointer border border-blue-200/60 bg-white text-left shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <div className="card-body gap-4 sm:flex-row sm:items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm ring-1 ring-blue-500/20">
                    <ClipboardList className="size-6" />
                  </div>
                  <div>
                    <h3 className="card-title text-sm text-slate-900">Portal Manajemen Kurikulum</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      Pantau jurnal mengajar global, absensi guru, dan tugas tendik di seluruh kelas.
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* Card 2: Guru & Tugas Tambahan */}
              <motion.button
                {...cardHover}
                onClick={() => setSubMenu('guru')}
                className="card w-full cursor-pointer border border-emerald-200/60 bg-white text-left shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-emerald-500"
              >
                <div className="card-body gap-4 sm:flex-row sm:items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/20">
                    <BookOpen className="size-6" />
                  </div>
                  <div>
                    <h3 className="card-title text-sm text-slate-900">Portal Guru &amp; Tugas Tambahan</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {portals.length} portal tersedia — akses tugas mengajar dan tambahan Anda.
                    </p>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STAGE 2: Sub-menu Portal Guru ── */}
        <AnimatePresence mode="wait">
          {subMenu === 'guru' && (
            <motion.div
              key="guru"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Tombol Kembali */}
              <button
                onClick={() => setSubMenu(null)}
                className="btn btn-ghost btn-sm -ml-2 gap-1.5 text-slate-600"
              >
                <ArrowLeft className="size-4" />
                Kembali ke pilihan utama
              </button>

              {/* Grid Portal Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {portals.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <motion.button
                      key={p.role}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.35, ease: 'easeOut' }}
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelect(p.role)}
                      className={`card cursor-pointer border ${p.color} bg-white text-left shadow-md transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-emerald-500`}
                    >
                      <div className="card-body gap-3">
                        <div
                          className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-white shadow-sm ring-1 ${p.ring}`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h4 className="card-title text-sm text-slate-900">{p.label}</h4>
                          <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Logout ── */}
        <div className="text-center">
          <button onClick={onLogout} className="btn btn-soft btn-error btn-sm">
            <LogOut className="size-4" />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </motion.div>
  );
}
