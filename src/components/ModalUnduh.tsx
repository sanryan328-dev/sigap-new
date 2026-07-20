import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, ChevronDown, FileSpreadsheet } from 'lucide-react';

interface MapelEntry {
  mapel: string;
  kelas: string[];
}

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

interface ModalUnduhProps {
  open: boolean;
  onClose: () => void;
  jenis: 'nilai' | 'jurnal' | 'bk' | 'agenda' | null;
  daftarKelas: string[];
  mataPelajaranData: MapelEntry[];
  isGureBK?: boolean;
  onDownload: (params: {
    jenis: string;
    selectedMapel?: string;
    selectedKelas: string;
    selectedBulan: string;
  }) => void;
}

export default function ModalUnduh({
  open,
  onClose,
  jenis,
  daftarKelas,
  mataPelajaranData,
  isGureBK,
  onDownload,
}: ModalUnduhProps) {
  const [bulan, setBulan] = useState('');
  const [mapel, setMapel] = useState('');
  const [kelas, setKelas] = useState('');
  const [loading, setLoading] = useState(false);

  const bersihMapel = mataPelajaranData.filter((e) => e.mapel.trim());
  const mapelTunggal = bersihMapel.length === 1;
  const kelasOptions = mapel
    ? bersihMapel.find((e) => e.mapel === mapel)?.kelas ?? []
    : [];
  const butuhMapel = jenis === 'nilai' || jenis === 'jurnal';
  const butuhBulan = jenis === 'jurnal' || jenis === 'bk' || jenis === 'agenda';
  const butuhKelas = butuhMapel;

  useEffect(() => {
    if (open) {
      setBulan('');
      setMapel('');
      setKelas('');
      setLoading(false);
      if (mapelTunggal && butuhMapel) setMapel(bersihMapel[0].mapel);
    }
  }, [open, mapelTunggal, butuhMapel]);

  useEffect(() => {
    if (mapel && !mapelTunggal) setKelas('');
  }, [mapel]);

  const siap =
    (!butuhBulan || bulan) &&
    (!butuhMapel || mapel) &&
    (!butuhKelas || kelas);

  const judul =
    jenis === 'nilai'
      ? 'Unduh Nilai Siswa'
      : jenis === 'jurnal'
        ? 'Unduh Rekap Jurnal / Agenda'
        : jenis === 'bk'
          ? 'Unduh Catatan BK'
          : jenis === 'agenda'
            ? 'Unduh Agenda Kelas'
            : '';

  const handleUnduh = async () => {
    if (!siap || !jenis) return;
    setLoading(true);
    onDownload({ jenis, selectedMapel: mapel || undefined, selectedKelas: kelas, selectedBulan: bulan });
  };

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs">
                  <FileSpreadsheet className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{judul}</h3>
              </div>
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
                <X className="size-4" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="space-y-4 px-6 py-5">
              {/* Dropdown Bulan */}
              {butuhBulan && (
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text text-sm font-semibold">Pilih Bulan</span>
                  </label>
                  <div className="relative">
                    <select
                      value={bulan}
                      onChange={(e) => setBulan(e.target.value)}
                      className="select select-bordered w-full appearance-none pr-8 text-sm"
                    >
                      <option value="">— Pilih Bulan —</option>
                      {BULAN.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Dropdown Mapel (khusus nilai) */}
              {butuhMapel && bersihMapel.length > 1 && (
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text text-sm font-semibold">Mata Pelajaran</span>
                  </label>
                  <div className="relative">
                    <select
                      value={mapel}
                      onChange={(e) => setMapel(e.target.value)}
                      className="select select-bordered w-full appearance-none pr-8 text-sm"
                    >
                      <option value="">— Pilih Mapel —</option>
                      {bersihMapel.map((e) => (
                        <option key={e.mapel} value={e.mapel}>{e.mapel}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              )}

              {/* Mapel tunggal (auto, terkunci) */}
              {butuhMapel && mapelTunggal && (
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text text-sm font-semibold">Mata Pelajaran</span>
                  </label>
                  <input
                    type="text"
                    value={bersihMapel[0]?.mapel || ''}
                    readOnly
                    className="input input-bordered input-sm w-full bg-slate-50 text-sm font-semibold text-slate-700"
                  />
                </div>
              )}

              {/* Dropdown Kelas (khusus jurnal/nilai) */}
              {butuhKelas && (
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-semibold">Kelas</span>
                </label>
                <div className="relative">
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    disabled={butuhMapel && !mapel}
                    className="select select-bordered w-full appearance-none pr-8 text-sm disabled:bg-slate-100"
                  >
                    <option value="">— Pilih Kelas —</option>
                    {(butuhMapel ? kelasOptions : daftarKelas).map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
                {butuhMapel && mapel && kelasOptions.length === 0 && (
                  <p className="mt-1 text-[10px] text-amber-600">
                    Tidak ada kelas terdaftar untuk mapel ini.
                  </p>
                )}
              </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={onClose} className="btn btn-ghost btn-sm">
                Batalkan
              </button>
              <button
                onClick={handleUnduh}
                disabled={!siap || loading}
                className="btn btn-primary btn-sm gap-1.5"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Download className="size-4" />
                )}
                Unduh Sekarang
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
