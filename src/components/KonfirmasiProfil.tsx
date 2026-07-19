import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Trash2, School, Users, Trophy } from 'lucide-react';

interface MapelKelas {
  mapel: string;
  kelas: string[];
}

interface KonfirmasiProfilProps {
  namaLengkap: string;
  daftarKelas: string[];
  onSimpanProfil: (data: {
    mapel: string | null;
    mataPelajaran: MapelKelas[];
    isWaliKelas: boolean;
    kelasWali: string | null;
    namaEkskul: string | null;
  }) => void;
  loading: boolean;
}

export default function KonfirmasiProfil({
  namaLengkap,
  daftarKelas,
  onSimpanProfil,
  loading,
}: KonfirmasiProfilProps) {
  const [entries, setEntries] = useState<MapelKelas[]>([{ mapel: '', kelas: [] }]);

  const [pilihWali, setPilihWali] = useState(false);
  const [kelasWaliInput, setKelasWaliInput] = useState(daftarKelas[0] || '');

  const [pilihEkskul, setPilihEkskul] = useState(false);
  const [ekskulInput, setEkskulInput] = useState('');

  const updateEntry = (idx: number, patch: Partial<MapelKelas>) => {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  };

  const toggleKelas = (entryIdx: number, k: string) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === entryIdx
          ? { ...e, kelas: e.kelas.includes(k) ? e.kelas.filter((c) => c !== k) : [...e.kelas, k] }
          : e
      )
    );
  };

  const tambahEntry = () => setEntries((prev) => [...prev, { mapel: '', kelas: [] }]);
  const hapusEntry = (idx: number) => setEntries((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bersih = entries.filter((en) => en.mapel.trim());
    onSimpanProfil({
      mapel: bersih.length > 0 ? bersih.map((e) => e.mapel).join(', ') : null,
      mataPelajaran: bersih,
      isWaliKelas: pilihWali,
      kelasWali: pilihWali ? kelasWaliInput : null,
      namaEkskul: pilihEkskul ? ekskulInput : null,
    });
  };

  const adaMapelValid = entries.some((e) => e.mapel.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-8 sm:p-8"
    >
      <div className="w-full max-w-2xl">
        {/* ── Header Card ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md mb-6"
        >
          <div className="flex-1 flex-col items-start gap-1">
            <div className="badge badge-soft badge-warning badge-sm uppercase tracking-widest">
              Konfirmasi Tugas Pertama Kali
            </div>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              Halo, {namaLengkap}!
            </h2>
            <p className="text-xs leading-relaxed text-slate-500">
              Silakan tentukan tugas / amanah yang Anda emban di SMPN 1 Wanayasa tahun ini.
            </p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── Bagian: Guru Mata Pelajaran ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card border border-sky-200/60 bg-white shadow-lg"
          >
            <div className="card-body gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-sm ring-1 ring-sky-500/20">
                  <BookOpen className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">Mata Pelajaran yang Saya Ampu</h3>
              </div>

              <AnimatePresence mode="popLayout">
                {entries.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
                            Nama Mata Pelajaran
                          </label>
                          <input
                            type="text"
                            value={entry.mapel}
                            onChange={(e) => updateEntry(idx, { mapel: e.target.value })}
                            placeholder="Contoh: Informatika, Prakarya"
                            className="input input-bordered input-sm w-full"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-600">
            Kelas yang Diajar untuk Mapel Ini
          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {daftarKelas.map((k) => {
                              const aktif = entry.kelas.includes(k);
                              return (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() => toggleKelas(idx, k)}
                                  className={`badge cursor-pointer gap-1.5 px-3 py-2 text-[11px] font-semibold transition-all ${
                                    aktif
                                      ? 'badge-soft badge-info ring-1 ring-sky-400/40'
                                      : 'badge-soft badge-ghost text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  {aktif && (
                                    <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                  )}
                                  {k}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {entries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => hapusEntry(idx)}
                          className="btn btn-ghost btn-xs text-red-500 shrink-0"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                type="button"
                onClick={tambahEntry}
                className="btn btn-soft btn-info btn-sm self-start gap-1.5"
              >
                <Plus className="size-4" />
                Tambah Mapel Lain
              </button>
            </div>
          </motion.div>

          {/* ── Bagian: Wali Kelas ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card border border-amber-200/60 bg-white shadow-lg"
          >
            <div className="card-body gap-4">
              <label className="flex cursor-pointer items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm ring-1 ring-amber-500/20">
                  <Users className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="card-title text-sm text-slate-900">Wali Kelas</h3>
                </div>
                <input
                  type="checkbox"
                  checked={pilihWali}
                  onChange={(e) => setPilihWali(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
              </label>
              <AnimatePresence>
                {pilihWali && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <select
                      value={kelasWaliInput}
                      onChange={(e) => setKelasWaliInput(e.target.value)}
                      className="select select-bordered select-sm w-full max-w-xs"
                    >
                      {daftarKelas.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Bagian: Pembina Ekskul ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="card border border-emerald-200/60 bg-white shadow-lg"
          >
            <div className="card-body gap-4">
              <label className="flex cursor-pointer items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/20">
                  <Trophy className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="card-title text-sm text-slate-900">Pembina Ekstrakurikuler</h3>
                </div>
                <input
                  type="checkbox"
                  checked={pilihEkskul}
                  onChange={(e) => setPilihEkskul(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
              </label>
              <AnimatePresence>
                {pilihEkskul && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      value={ekskulInput}
                      onChange={(e) => setEkskulInput(e.target.value)}
                      placeholder="Contoh: Hortikultura, Pramuka, PMR"
                      className="input input-bordered input-sm w-full max-w-xs"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Tombol Simpan ── */}
          <motion.button
            type="submit"
            disabled={loading || (!adaMapelValid && !pilihWali && !pilihEkskul)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="btn btn-primary btn-block"
          >
            {loading ? (
              <><span className="loading loading-spinner loading-xs" /> Menyimpan Profil...</>
            ) : (
              'Simpan & Masuk Ke Aplikasi'
            )}
          </motion.button>

          <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
            SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
          </p>
        </form>
      </div>
    </motion.div>
  );
}
