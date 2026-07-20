import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Info, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/useAuthStore';

interface Siswa {
  id: string;
  nama_siswa: string;
  nisn: string;
}

interface KehadiranWaliProps {
  setSubMenuWali: (menu: 'kehadiran' | 'bk' | null) => void;
  kelas: string;
  daftarSiswa: Siswa[];
}

type StatusKehadiran = 'Hadir' | 'Sakit' | 'Izin' | 'Alpha';

const STATUS_LIST: StatusKehadiran[] = ['Hadir', 'Sakit', 'Izin', 'Alpha'];

const STATUS_WARNA: Record<StatusKehadiran, string> = {
  Hadir: 'bg-emerald-600 text-white',
  Sakit: 'bg-amber-500 text-white',
  Izin: 'bg-blue-600 text-white',
  Alpha: 'bg-rose-600 text-white',
};

const batasHariIni = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
};

export default function KehadiranWali({ setSubMenuWali, kelas, daftarSiswa }: KehadiranWaliProps) {
  const profile = useAuthStore((s) => s.profile);
  const [presensi, setPresensi] = useState<Record<string, StatusKehadiran>>({});
  const [syncIds, setSyncIds] = useState<string[]>([]);
  const [syncInfo, setSyncInfo] = useState<{ mapel: string; jamKe: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Pre-fetch absensi dari guru mapel jam pertama ──
  useEffect(() => {
    if (daftarSiswa.length === 0) return;

    const defaults: Record<string, StatusKehadiran> = {};
    daftarSiswa.forEach((s) => { defaults[s.id] = 'Hadir'; });
    setPresensi(defaults);
    setSyncIds([]);
    setSyncInfo(null);

    let cancelled = false;

    const fetchSync = async () => {
      setLoading(true);
      const { start, end } = batasHariIni();

      try {
        const { data: journals } = await supabase
          .from('teaching_journals')
          .select('id, mata_pelajaran, jam_ke')
          .eq('kelas', kelas)
          .gte('created_at', start)
          .lte('created_at', end)
          .ilike('jam_ke', '1%')
          .order('created_at', { ascending: true })
          .limit(1);

        if (cancelled) return;

        if (journals && journals.length > 0) {
          const j = journals[0];
          const { data: absen } = await supabase
            .from('student_attendances')
            .select('student_id, status')
            .eq('teaching_journal_id', j.id);

          if (cancelled) return;

          if (absen && absen.length > 0) {
            const merged = { ...defaults };
            const synced: string[] = [];
            absen.forEach((a) => {
              if (a.student_id) {
                merged[a.student_id] = (['Hadir', 'Sakit', 'Izin', 'Alpha'].includes(a.status)
                  ? a.status
                  : 'Hadir') as StatusKehadiran;
                synced.push(String(a.student_id));
              }
            });
            setPresensi(merged);
            setSyncIds(synced);
            setSyncInfo({ mapel: j.mata_pelajaran, jamKe: j.jam_ke });
          }
        }
      } catch (err) {
        console.error('Gagal sinkronisasi absensi:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSync();
    return () => { cancelled = true; };
  }, [kelas, daftarSiswa]);

  const handleStatusChange = (id: string, status: StatusKehadiran) => {
    setPresensi((prev) => ({ ...prev, [id]: status }));
    setSyncIds((prev) => prev.filter((x) => x !== id));
  };

  // ── Simpan / Upsert ──
  const handleSimpanKehadiran = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const { start, end } = batasHariIni();

      const { data: existing } = await supabase
        .from('teaching_journals')
        .select('id')
        .eq('user_id', profile.user_id)
        .eq('kelas', kelas)
        .eq('mata_pelajaran', 'Rekapitulasi Absensi Wali Kelas')
        .gte('created_at', start)
        .lte('created_at', end)
        .limit(1);

      let journalId: number;

      if (existing && existing.length > 0) {
        journalId = existing[0].id;
        const { error: delErr } = await supabase
          .from('student_attendances')
          .delete()
          .eq('teaching_journal_id', journalId);
        if (delErr) throw delErr;
      } else {
        const { data: baru, error: errJ } = await supabase
          .from('teaching_journals')
          .insert([{
            user_id: profile.user_id,
            kelas,
            mata_pelajaran: 'Rekapitulasi Absensi Wali Kelas',
            jam_ke: '0',
            materi_pembelajaran: 'Kehadiran Harian Siswa - Validasi',
            catatan_kelas: '-',
          }])
          .select()
          .single();
        if (errJ || !baru) throw errJ || new Error('Gagal membuat jurnal');
        journalId = baru.id;
      }

      const inserts = daftarSiswa.map((s) => ({
        teaching_journal_id: journalId,
        student_id: s.id,
        status: presensi[s.id] || 'Hadir',
      }));

      const { error: absErr } = await supabase.from('student_attendances').insert(inserts);
      if (absErr) throw absErr;

      toast.success('Kehadiran harian berdivalidasi dan disimpan!');
      setSubMenuWali(null);
    } catch (err: any) {
      toast.error(`Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
    >
      <div className="w-full max-w-4xl space-y-5">
        {/* ── Navbar ── */}
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
              Kehadiran Harian Siswa
            </h2>
          </div>
          <div className="flex-none gap-2">
            <span className="text-sm font-semibold text-slate-600">
              Kelas: <span className="text-emerald-700">{kelas}</span>
            </span>
            <button onClick={() => setSubMenuWali(null)} className="btn btn-ghost btn-sm">
              <ArrowLeft className="size-4" />
              Kembali
            </button>
          </div>
        </motion.div>

        {/* ── Info Sync ── */}
        {syncInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50 p-4"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Info className="size-4" />
            </div>
            <div className="text-sm leading-relaxed text-emerald-800">
              <p className="font-semibold">
                Tersinkronisasi otomatis dari jam ke-{syncInfo.jamKe} ({syncInfo.mapel})
              </p>
              <p className="mt-0.5 text-emerald-600">
                Status di bawah adalah hasil absensi Guru Mapel jam pertama. Anda dapat merevisi jika ada
                perbedaan, lalu klik "Simpan & Validasi".
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Tabel Siswa ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="px-5 py-4">Nama Siswa</th>
                  <th className="px-5 py-4 text-center">Status Kehadiran Hari Ini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-5 py-12 text-center text-slate-400">
                      <RefreshCw className="mx-auto mb-2 size-5 animate-spin" />
                      Memuat data absensi...
                    </td>
                  </tr>
                ) : daftarSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-5 py-12 text-center text-sm text-slate-400">
                      Belum ada siswa di kelas ini.
                    </td>
                  </tr>
                ) : (
                  daftarSiswa.map((siswa, idx) => {
                    const isSynced = syncIds.includes(siswa.id);
                    return (
                      <motion.tr
                        key={siswa.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{siswa.nama_siswa}</span>
                            {isSynced && (
                              <span className="badge badge-soft badge-info badge-xs gap-1 whitespace-nowrap">
                                <RefreshCw className="size-2.5" />
                                Sinkron Jam Ke-1
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {STATUS_LIST.map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChange(siswa.id, status)}
                                className={`rounded-lg px-3.5 py-1.5 text-[10px] font-bold tracking-wide transition-all duration-150 cursor-pointer ${
                                  presensi[siswa.id] === status
                                    ? `${STATUS_WARNA[status]} shadow-xs`
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Tombol Simpan ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            type="button"
            onClick={handleSimpanKehadiran}
            disabled={saving || loading || daftarSiswa.length === 0}
            className="btn btn-primary btn-block gap-2"
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Simpan & Validasi Rekap Hari Ini
              </>
            )}
          </button>
        </motion.div>

        {/* ── Footer ── */}
        <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
          SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
        </p>
      </div>
    </motion.div>
  );
}
