import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut,
  BookOpen,
  CalendarX,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Clock,
  Repeat,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import OnlineStatus from './OnlineStatus';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useAuthStore } from '../store/useAuthStore';

interface KurikulumPortalProps {
  onSwitchRole?: () => void;
}

interface JurnalItem {
  id: number;
  user_id: number;
  kelas: string;
  mata_pelajaran: string;
  jam_ke: string;
  materi_pembelajaran: string;
  catatan_kelas: string | null;
  created_at: string;
  guru?: string;
}

interface AbsenItem {
  id: number;
  user_id: number;
  tanggal_absen: string;
  status_izin: string;
  alasan_detail: string;
  titipan_tugas_kelas: string | null;
  status_verifikasi: string;
  created_at: string;
  guru?: string;
}

type Tab = 'jurnal' | 'absen';

const batasHariIni = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
};

const STATUS_LABEL: Record<string, string> = {
  sakit: 'Sakit',
  izin_keperluan: 'Izin Keperluan',
  tugas_dinas: 'Tugas Dinas',
};

const VERIF_LABEL: Record<string, string> = {
  pending: 'Menunggu',
  diverifikasi_piket: 'Terverifikasi',
};

export default function KurikulumPortal({ onSwitchRole }: KurikulumPortalProps) {
  const handleLogout = useAuthStore((s) => s.logout);
  const [tab, setTab] = useState<Tab>('jurnal');
  const [dataJurnal, setDataJurnal] = useState<JurnalItem[]>([]);
  const [dataAbsen, setDataAbsen] = useState<AbsenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterHariIni, setFilterHariIni] = useState(false);
  const { pendingCount, syncing, syncNow } = useOfflineSync();

  const fetchJurnal = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('teaching_journals')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterHariIni) {
        const { start, end } = batasHariIni();
        query = query.gte('created_at', start).lte('created_at', end);
      }

      const { data, error } = await query;
      if (error) throw error;

      const userIds = [...new Set((data ?? []).map((d: any) => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nama_lengkap')
        .in('user_id', userIds);

      const guruMap: Record<number, string> = {};
      (profiles ?? []).forEach((p: any) => { guruMap[p.user_id] = p.nama_lengkap; });

      setDataJurnal(
        (data ?? []).map((d: any) => ({ ...d, guru: guruMap[d.user_id] || '—' })),
      );
    } catch (err: any) {
      console.error('Gagal ambil jurnal:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAbsen = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('teacher_absences')
        .select('*')
        .order('tanggal_absen', { ascending: false });

      if (filterHariIni) {
        const todayStr = new Date().toISOString().slice(0, 10);
        query = query.eq('tanggal_absen', todayStr);
      }

      const { data, error } = await query;
      if (error) throw error;

      const userIds = [...new Set((data ?? []).map((d: any) => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nama_lengkap')
        .in('user_id', userIds);

      const guruMap: Record<number, string> = {};
      (profiles ?? []).forEach((p: any) => { guruMap[p.user_id] = p.nama_lengkap; });

      setDataAbsen(
        (data ?? []).map((d: any) => ({ ...d, guru: guruMap[d.user_id] || '—' })),
      );
    } catch (err: any) {
      console.error('Gagal ambil absen:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'jurnal') fetchJurnal();
  }, [tab, filterHariIni]);

  useEffect(() => {
    if (tab === 'absen') fetchAbsen();
  }, [tab, filterHariIni]);

  const filteredJurnal = useMemo(
    () =>
      dataJurnal.filter((d) =>
        !search || [d.guru, d.kelas, d.mata_pelajaran, d.materi_pembelajaran]
          .some((f) => f?.toLowerCase().includes(search.toLowerCase())),
      ),
    [dataJurnal, search],
  );

  const filteredAbsen = useMemo(
    () =>
      dataAbsen.filter((d) =>
        !search || [d.guru, d.status_izin, d.alasan_detail, d.titipan_tugas_kelas]
          .some((f) => f?.toLowerCase().includes(search.toLowerCase())),
      ),
    [dataAbsen, search],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
    >
      <div className="w-full max-w-5xl space-y-5">
        {/* ── Navbar ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md"
        >
          <div className="flex-1 flex-col items-start gap-1">
            <div className="badge badge-soft badge-primary badge-sm uppercase tracking-widest">
              Panel Management Tendik
            </div>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              Kurikulum
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Pemantauan KBM, jurnal mengajar, dan log ketidakhadiran guru
            </p>
          </div>
          <div className="flex-none gap-2">
            <OnlineStatus pendingCount={pendingCount} onSyncNow={syncNow} syncing={syncing} />
            {onSwitchRole && (
              <button onClick={onSwitchRole} className="btn btn-soft btn-primary btn-sm">
                <Repeat className="size-3.5" />
                Beralih Peran
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-soft btn-error btn-sm">
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <div className="tabs tabs-box border border-slate-200 bg-slate-50/50 p-1">
          <button
            onClick={() => { setTab('jurnal'); setSearch(''); }}
            className={`tab tab-sm flex-1 gap-1.5 text-[11px] font-bold transition-all duration-200 ${
              tab === 'jurnal'
                ? 'tab-active rounded-lg bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="size-3.5" />
            Pemantauan Jurnal Mengajar (KBM)
          </button>
          <button
            onClick={() => { setTab('absen'); setSearch(''); }}
            className={`tab tab-sm flex-1 gap-1.5 text-[11px] font-bold transition-all duration-200 ${
              tab === 'absen'
                ? 'tab-active rounded-lg bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CalendarX className="size-3.5" />
            Log Ketidakhadiran &amp; Tugas Guru
          </button>
        </div>

        {/* ── Search + Filter ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="join w-full sm:max-w-xs">
            <div className="join-item flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs">
              <Search className="size-3.5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari guru, kelas, mapel..."
                className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>
          <button
            onClick={() => setFilterHariIni((p) => !p)}
            className={`btn btn-sm gap-1.5 ${
              filterHariIni ? 'btn-primary' : 'btn-outline btn-soft'
            }`}
          >
            <Filter className="size-3.5" />
            Hari Ini
          </button>
        </div>

        {/* ── Tab Content: Jurnal ── */}
        {tab === 'jurnal' && (
          <motion.div
            key="jurnal"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg"
          >
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Guru</th>
                    <th className="px-4 py-3">Kelas</th>
                    <th className="px-4 py-3">Mapel</th>
                    <th className="px-4 py-3">Jam</th>
                    <th className="px-4 py-3 max-w-[180px]">Materi</th>
                    <th className="px-4 py-3 max-w-[140px]">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        <RefreshCw className="mx-auto mb-2 size-5 animate-spin" />
                        Memuat data jurnal...
                      </td>
                    </tr>
                  ) : filteredJurnal.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        {filterHariIni
                          ? 'Belum ada jurnal untuk hari ini.'
                          : 'Belum ada data jurnal.'}
                      </td>
                    </tr>
                  ) : (
                    filteredJurnal.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-slate-400" />
                            {new Date(d.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short',
                            })}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{d.guru}</td>
                        <td className="px-4 py-3">
                          <span className="badge badge-soft badge-ghost badge-sm">{d.kelas}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{d.mata_pelajaran}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{d.jam_ke}</td>
                        <td className="max-w-[180px] truncate px-4 py-3 text-slate-600">
                          {d.materi_pembelajaran}
                        </td>
                        <td className="max-w-[140px] truncate px-4 py-3 text-slate-500">
                          {d.catatan_kelas || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Tab Content: Absen ── */}
        {tab === 'absen' && (
          <motion.div
            key="absen"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg"
          >
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Guru</th>
                    <th className="px-4 py-3">Status Izin</th>
                    <th className="px-4 py-3 max-w-[200px]">Alasan</th>
                    <th className="px-4 py-3 max-w-[180px]">Titipan Tugas</th>
                    <th className="px-4 py-3">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        <RefreshCw className="mx-auto mb-2 size-5 animate-spin" />
                        Memuat data absensi...
                      </td>
                    </tr>
                  ) : filteredAbsen.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        {filterHariIni
                          ? 'Tidak ada guru yang absen hari ini.'
                          : 'Belum ada data ketidakhadiran.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAbsen.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                          <span className="flex items-center gap-1">
                            <CalendarX className="size-3 text-rose-400" />
                            {new Date(d.tanggal_absen).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{d.guru}</td>
                        <td className="px-4 py-3">
                          <span className={`badge badge-sm ${
                            d.status_izin === 'sakit'
                              ? 'badge-soft badge-warning'
                              : d.status_izin === 'izin_keperluan'
                                ? 'badge-soft badge-info'
                                : 'badge-soft badge-accent'
                          }`}>
                            {STATUS_LABEL[d.status_izin] || d.status_izin}
                          </span>
                        </td>
                        <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">
                          {d.alasan_detail}
                        </td>
                        <td className="max-w-[180px] truncate px-4 py-3 text-slate-500">
                          {d.titipan_tugas_kelas || (
                            <span className="italic text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge badge-sm ${
                            d.status_verifikasi === 'diverifikasi_piket'
                              ? 'badge-soft badge-success'
                              : 'badge-soft badge-ghost'
                          }`}>
                            {VERIF_LABEL[d.status_verifikasi] || d.status_verifikasi}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Footer ── */}
        <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
          SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
        </p>
      </div>
    </motion.div>
  );
}
