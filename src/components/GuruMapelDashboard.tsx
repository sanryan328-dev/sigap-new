import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardCheck, LogOut, ChevronDown, Repeat } from 'lucide-react';
import GrafikNilai from './GrafikNilai';
import { useAuthStore } from '../store/useAuthStore';

interface MapelKelas {
  mapel: string;
  kelas: string[];
}

interface GuruMapelDashboardProps {
  setSubMenu: (menu: 'jurnal' | 'nilai' | null) => void;
  setCurrentRole: (role: any) => void;
  onSelectMapelKelas: (mapel: string, kelas: string) => void;
  mataPelajaranData: MapelKelas[];
  daftarKelas: string[];
  onSwitchRole?: () => void;
}

const cardHover = {
  whileHover: { scale: 1.02, y: -3 },
  transition: { type: 'spring' as const, stiffness: 350, damping: 18 },
};

export default function GuruMapelDashboard({
  setSubMenu,
  setCurrentRole,
  onSelectMapelKelas,
  mataPelajaranData,
  onSwitchRole,
}: GuruMapelDashboardProps) {
  const profile = useAuthStore((s) => s.profile);
  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');

  const mapelOptions = mataPelajaranData.filter((e) => e.mapel.trim());
  const kelasOptions = mapelOptions.find((e) => e.mapel === selectedMapel)?.kelas ?? [];

  const siap = selectedMapel && selectedKelas;

  const handleMasuk = (menu: 'jurnal' | 'nilai') => {
    onSelectMapelKelas(selectedMapel, selectedKelas);
    setSubMenu(menu);
  };

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
            <div className="badge badge-soft badge-info badge-sm uppercase tracking-widest">
              Panel Guru Mapel
            </div>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {profile?.nama_lengkap}
            </h2>
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

        {/* ── Card Pemilihan Mapel & Kelas ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card border border-sky-200/60 bg-white shadow-lg"
        >
          <div className="card-body gap-5">
            <h3 className="card-title text-sm text-slate-900">
              Pilih Mata Pelajaran & Kelas
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Dropdown Mapel */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">Mata Pelajaran</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedMapel}
                    onChange={(e) => {
                      setSelectedMapel(e.target.value);
                      setSelectedKelas('');
                    }}
                    className="select select-bordered w-full appearance-none pr-8 text-sm"
                  >
                    <option value="">— Pilih Mapel —</option>
                    {mapelOptions.map((e) => (
                      <option key={e.mapel} value={e.mapel}>
                        {e.mapel}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Dropdown Kelas */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">Kelas</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedKelas}
                    onChange={(e) => setSelectedKelas(e.target.value)}
                    disabled={!selectedMapel}
                    className="select select-bordered w-full appearance-none pr-8 text-sm disabled:bg-slate-100"
                  >
                    <option value="">— Pilih Kelas —</option>
                    {kelasOptions.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {selectedMapel && kelasOptions.length === 0 && (
              <p className="text-xs text-amber-600">
                Tidak ada kelas yang terdaftar untuk mapel {selectedMapel}. Silakan hubungi admin.
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Grid Menu (hanya muncul jika mapel & kelas sudah dipilih) ── */}
        {siap && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <motion.button
              {...cardHover}
              onClick={() => handleMasuk('jurnal')}
              className="card border border-blue-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer"
            >
              <div className="card-body gap-3 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm ring-1 ring-blue-500/20">
                  <BookOpen className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">Isi Jurnal & Presensi</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Input materi harian kelas {selectedKelas} dan cek kehadiran siswa.
                </p>
              </div>
            </motion.button>

            <motion.button
              {...cardHover}
              onClick={() => handleMasuk('nilai')}
              className="card border border-emerald-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-emerald-500 cursor-pointer"
            >
              <div className="card-body gap-3 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/20">
                  <ClipboardCheck className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">Input Nilai Siswa</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Rekap angka nilai berkala seperti Tugas, Ulangan Harian, UTS, dan UAS.
                </p>
              </div>
            </motion.button>
          </div>
        )}

        {/* ── Chart Tren Nilai ── */}
        {siap && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card border border-slate-200/60 bg-white shadow-lg"
          >
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <h3 className="card-title text-sm text-slate-900">
                  Tren Rata-rata Nilai — {selectedMapel}
                </h3>
                <span className="badge badge-soft badge-secondary badge-xs">Pekan Ini</span>
              </div>
              <GrafikNilai />
            </div>
          </motion.div>
        )}

        <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
          SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
        </p>
      </div>
    </motion.div>
  );
}
