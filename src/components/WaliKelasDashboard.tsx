import { motion } from 'framer-motion';
import { ClipboardList, BookOpen, LogOut, Repeat } from 'lucide-react';
import GrafikPresensi from './GrafikPresensi';
import { useAuthStore } from '../store/useAuthStore';

interface WaliKelasDashboardProps {
  setSubMenuWali: (menu: 'kehadiran' | 'bk' | null) => void;
  setCurrentRole: (role: any) => void;
  onSwitchRole?: () => void;
}

const cardHover = {
  whileHover: { scale: 1.02, y: -3 },
  transition: { type: 'spring' as const, stiffness: 350, damping: 18 },
};

export default function WaliKelasDashboard({ setSubMenuWali, setCurrentRole, onSwitchRole }: WaliKelasDashboardProps) {
  const profile = useAuthStore((s) => s.profile);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
    >
      <div className="w-full max-w-2xl space-y-5">
        {/* ── Navbar Atas ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md"
        >
          <div className="flex-1 flex-col items-start gap-1">
            <div className="badge badge-soft badge-success badge-sm uppercase tracking-widest">
              Panel Wali Kelas
            </div>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {profile?.nama_lengkap}
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Kelas Binaan: <span className="font-semibold text-emerald-700">{profile?.kelas_wali}</span>
            </p>
          </div>
          <div className="flex-none gap-2">
            {onSwitchRole && (
              <button onClick={onSwitchRole} className="btn btn-soft btn-primary btn-sm">
                <Repeat className="size-3.5" />
                Beralih Peran
              </button>
            )}
            <button onClick={() => setCurrentRole(null)} className="btn btn-ghost btn-sm">
              <LogOut className="size-4" />
              Kembali
            </button>
          </div>
        </motion.div>

        {/* ── Chart Presensi ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card border border-slate-200/60 bg-white shadow-lg"
        >
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-sm text-slate-900">
                Rekap Kehadiran Pekan Ini
              </h3>
              <span className="badge badge-soft badge-success badge-xs">Live</span>
            </div>
            <GrafikPresensi />
          </div>
        </motion.div>

        {/* ── Grid Menu ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <motion.button
            {...cardHover}
            onClick={() => setSubMenuWali('kehadiran')}
            className="card border border-emerald-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-emerald-500 cursor-pointer"
          >
            <div className="card-body gap-3 text-left">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/20">
                <ClipboardList className="size-5" />
              </div>
              <h3 className="card-title text-sm text-slate-900">Kehadiran Harian Siswa</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Isi/rekap absensi mandiri harian untuk seluruh siswa di kelas binaan Anda.
              </p>
            </div>
          </motion.button>

          <motion.button
            {...cardHover}
            onClick={() => setSubMenuWali('bk')}
            className="card border border-amber-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
          >
            <div className="card-body gap-3 text-left">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm ring-1 ring-amber-500/20">
                <BookOpen className="size-5" />
              </div>
              <h3 className="card-title text-sm text-slate-900">Rekap Catatan BK</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Pantau riwayat kasus dan status penanganan bimbingan konseling siswa Anda.
              </p>
            </div>
          </motion.button>
        </div>

        <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
          SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
        </p>
      </div>
    </motion.div>
  );
}
