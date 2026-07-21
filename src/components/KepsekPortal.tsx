import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import {
  Users, BookOpen, CalendarX, ClipboardList, ArrowLeft,
  Loader2, ShieldCheck, School, Search, Filter, UserCheck, UserX,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore, selectIsAdmin, selectIsKepsek } from '../store/useAuthStore';

/* ─── Types ─── */

interface SiswaTidakHadir {
  nama_siswa: string;
  kelas: string;
  status: string;
  keterangan: string;
}

interface RingkasanKehadiran {
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  total: number;
}

interface JurnalFeedRow {
  waktu: string;
  nama_guru: string;
  mata_pelajaran: string;
  kelas: string;
  jam_ke: string;
  materi_pembelajaran: string;
}

interface GuruOption {
  user_id: number;
  nama_lengkap: string;
}

interface GuruIzinRow {
  nama_guru: string;
  status_izin: string;
  label_izin: string;
  alasan_detail: string;
  file_surat_keterangan: string | null;
}

type TabKey = 'kehadiran' | 'jurnal' | 'izin';

/* ─── Helpers ─── */

const LABEL_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function todayYMD() {
  return new Date().toISOString().slice(0, 10);
}

function todayRange() {
  const ymd = todayYMD();
  return { start: `${ymd}T00:00:00.000Z`, end: `${ymd}T23:59:59.999Z`, ymd };
}

function getMonthRange(bulanLabel: string) {
  const monthNum = String(LABEL_BULAN.indexOf(bulanLabel) + 1).padStart(2, '0');
  const year = new Date().getFullYear();
  const lastDay = new Date(year, parseInt(monthNum), 0).getDate();
  return {
    start: `${year}-${monthNum}-01T00:00:00.000Z`,
    end: `${year}-${monthNum}-${lastDay}T23:59:59.999Z`,
    label: `${bulanLabel} ${year}`,
  };
}

function getDateRange(tgl: string) {
  return {
    start: `${tgl}T00:00:00.000Z`,
    end: `${tgl}T23:59:59.999Z`,
  };
}

function safeTime(d: string | null | undefined) {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    return dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch { return '-'; }
}

function safeDate(d: string | null | undefined) {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return '-'; }
}

function parseJamKe(jamKe: string): number {
  if (!jamKe) return 0;
  const parts = String(jamKe).split('-');
  if (parts.length === 2) {
    const a = parseInt(parts[0]);
    const b = parseInt(parts[1]);
    if (!isNaN(a) && !isNaN(b)) return b - a + 1;
  }
  const single = parseInt(jamKe);
  return isNaN(single) ? 0 : 1;
}

const LABEL_IZIN: Record<string, string> = {
  sakit: 'Sakit',
  izin_keperluan: 'Izin Keperluan',
  tugas_dinas: 'Tugas Dinas',
};

/* ─── Unauthorized ─── */

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: '#fefaef' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-xl border border-amber-200/60 bg-white p-8 text-center shadow-sm"
      >
        <ShieldCheck className="mx-auto mb-3 size-16" style={{ color: '#f4aa18' }} />
        <h2 className="text-lg font-bold" style={{ color: '#1d1601' }}>Akses Ditolak</h2>
        <p className="mt-1 text-base" style={{ color: '#1d1601' }}>
          Halaman ini hanya untuk Kepala Sekolah atau Admin.
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Card Komponen ─── */

function CardRingkasan({
  icon, label, value, desc, color,
}: {
  icon: React.ReactNode; label: string; value: string | number; desc?: string; color: string;
}) {
  return (
    <div className="rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: '#1d1601' }}>{label}</p>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="mt-1 text-2xl font-bold" style={{ color: '#1d1601' }}>{value}</p>
      {desc && <p className="mt-0.5 text-xs opacity-70" style={{ color: '#1d1601' }}>{desc}</p>}
    </div>
  );
}

/* ─── Main ─── */

interface Props { onSwitchRole?: () => void; }

export default function KepsekPortal({ onSwitchRole }: Props) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore(selectIsAdmin);
  const isKepsek = useAuthStore(selectIsKepsek);

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('kehadiran');

  /* ── Data master ── */
  const [daftarKelas, setDaftarKelas] = useState<string[]>([]);
  const [guruList, setGuruList] = useState<GuruOption[]>([]);

  /* ── Filter Kehadiran ── */
  const [filterKelas, setFilterKelas] = useState('');
  const [filterTglKehadiran, setFilterTglKehadiran] = useState(todayYMD());
  const [filterBulanKehadiran, setFilterBulanKehadiran] = useState('');

  /* ── Data Kehadiran ── */
  const [ringkasan, setRingkasan] = useState<RingkasanKehadiran>({ hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 });
  const [siswaTidakHadir, setSiswaTidakHadir] = useState<SiswaTidakHadir[]>([]);
  const [loadingKehadiran, setLoadingKehadiran] = useState(false);

  /* ── Filter Jurnal ── */
  const [filterGuru, setFilterGuru] = useState('');
  const [filterTglJurnal, setFilterTglJurnal] = useState(todayYMD());
  const [filterBulanJurnal, setFilterBulanJurnal] = useState('');

  /* ── Data Jurnal ── */
  const [jurnalFeed, setJurnalFeed] = useState<JurnalFeedRow[]>([]);
  const [totalJurnal, setTotalJurnal] = useState(0);
  const [totalJam, setTotalJam] = useState(0);
  const [loadingJurnal, setLoadingJurnal] = useState(false);

  /* ── Filter Izin ── */
  const [filterTglIzin, setFilterTglIzin] = useState(todayYMD());
  const [filterBulanIzin, setFilterBulanIzin] = useState('');

  /* ── Data Izin ── */
  const [guruIzinList, setGuruIzinList] = useState<GuruIzinRow[]>([]);
  const [totalGuruHadir, setTotalGuruHadir] = useState(0);
  const [loadingIzin, setLoadingIzin] = useState(false);

  if (!user || (!isAdmin && !isKepsek)) return <Unauthorized />;

  /* ─── Fetch data master ─── */
  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: kelasData }, { data: profData }] = await Promise.all([
          supabase.from('students').select('kelas'),
          supabase.from('profiles').select('user_id, nama_lengkap'),
        ]);
        if (kelasData) {
          const unik = [...new Set(kelasData.map((s: any) => s.kelas).filter(Boolean))].sort();
          setDaftarKelas(unik);
        }
        if (profData) {
          setGuruList(profData.filter((p: any) => p.user_id && p.nama_lengkap));
        }
      } catch (err) {
        console.error('Gagal memuat data master:', err);
      }
    };
    load();
  }, []);

  /* ─── Hitung date range ─── */
  const getDateBounds = useCallback((tgl: string, bulan: string) => {
    if (tgl) return getDateRange(tgl);
    if (bulan) {
      const r = getMonthRange(bulan);
      return { start: r.start, end: r.end };
    }
    const r = todayRange();
    return { start: r.start, end: r.end };
  }, []);

  /* ─── Fetch Kehadiran ─── */
  const fetchKehadiran = useCallback(async () => {
    setLoadingKehadiran(true);
    try {
      const { start, end } = getDateBounds(filterTglKehadiran, filterBulanKehadiran);

      let qJournal = supabase
        .from('teaching_journals')
        .select('id, kelas, catatan_kelas')
        .gte('created_at', start)
        .lte('created_at', end);

      if (filterKelas) qJournal = qJournal.eq('kelas', filterKelas);

      const { data: journals, error: errJ } = await qJournal;
      if (errJ) throw errJ;

      if (!journals?.length) {
        setRingkasan({ hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 });
        setSiswaTidakHadir([]);
        setLoadingKehadiran(false);
        return;
      }

      const journalIds = journals.map((j: any) => j.id);
      const journalMap = new Map<number, any>(journals.map((j: any) => [j.id, j]));

      const { data: attendances, error: errA } = await supabase
        .from('student_attendances')
        .select('student_id, status, teaching_journal_id')
        .in('teaching_journal_id', journalIds);

      if (errA) throw errA;

      if (!attendances?.length) {
        setRingkasan({ hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 });
        setSiswaTidakHadir([]);
        setLoadingKehadiran(false);
        return;
      }

      const studentIds = [...new Set(attendances.map((a: any) => a.student_id))];

      const { data: students, error: errS } = await supabase
        .from('students')
        .select('id, nama_siswa, kelas')
        .in('id', studentIds);

      if (errS) throw errS;

      const studentMap = new Map<number, any>((students ?? []).map((s: any) => [s.id, s]));

      let hadir = 0, sakit = 0, izin = 0, alfa = 0;
      const tidakHadir: SiswaTidakHadir[] = [];

      attendances.forEach((a: any) => {
        const status = a.status || '';
        const student = studentMap.get(a.student_id);
        const journal = journalMap.get(a.teaching_journal_id);

        if (status === 'Hadir') hadir++;
        else if (status === 'Sakit') { sakit++; tidakHadir.push({ nama_siswa: student?.nama_siswa || '—', kelas: student?.kelas || journal?.kelas || '—', status: 'S', keterangan: journal?.catatan_kelas || '—' }); }
        else if (status === 'Izin') { izin++; tidakHadir.push({ nama_siswa: student?.nama_siswa || '—', kelas: student?.kelas || journal?.kelas || '—', status: 'I', keterangan: journal?.catatan_kelas || '—' }); }
        else if (status === 'Alfa' || status === 'Alpha') { alfa++; tidakHadir.push({ nama_siswa: student?.nama_siswa || '—', kelas: student?.kelas || journal?.kelas || '—', status: 'A', keterangan: journal?.catatan_kelas || '—' }); }
      });

      setRingkasan({ hadir, sakit, izin, alfa, total: attendances.length });
      setSiswaTidakHadir(tidakHadir);
    } catch (err) {
      console.error('Gagal memuat kehadiran:', err);
    } finally {
      setLoadingKehadiran(false);
    }
  }, [filterTglKehadiran, filterBulanKehadiran, filterKelas, getDateBounds]);

  /* ─── Fetch Jurnal ─── */
  const fetchJurnal = useCallback(async () => {
    setLoadingJurnal(true);
    try {
      const { start, end } = getDateBounds(filterTglJurnal, filterBulanJurnal);

      let q = supabase
        .from('teaching_journals')
        .select('id, user_id, kelas, mata_pelajaran, jam_ke, materi_pembelajaran, created_at')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false });

      if (filterGuru) {
        const gId = parseInt(filterGuru);
        if (gId) q = q.eq('user_id', gId);
      }

      const { data: journals, error: errJ } = await q;
      if (errJ) throw errJ;

      if (!journals?.length) {
        setJurnalFeed([]);
        setTotalJurnal(0);
        setTotalJam(0);
        setLoadingJurnal(false);
        return;
      }

      const userIds = [...new Set(journals.map((j: any) => j.user_id))];

      const { data: profiles, error: errP } = await supabase
        .from('profiles')
        .select('user_id, nama_lengkap')
        .in('user_id', userIds);

      if (errP) throw errP;

      const guruMap = new Map<number, string>();
      (profiles ?? []).forEach((p: any) => {
        if (p.user_id) guruMap.set(Number(p.user_id), p.nama_lengkap);
      });

      let totalJamCount = 0;

      const feed: JurnalFeedRow[] = journals.map((j: any) => {
        const jamCount = parseJamKe(j.jam_ke);
        totalJamCount += jamCount;
        return {
          waktu: safeTime(j.created_at),
          nama_guru: guruMap.get(Number(j.user_id)) || '—',
          mata_pelajaran: j.mata_pelajaran || '—',
          kelas: j.kelas || '—',
          jam_ke: j.jam_ke || '—',
          materi_pembelajaran: j.materi_pembelajaran || '—',
        };
      });

      setJurnalFeed(feed);
      setTotalJurnal(journals.length);
      setTotalJam(totalJamCount);
    } catch (err) {
      console.error('Gagal memuat jurnal:', err);
    } finally {
      setLoadingJurnal(false);
    }
  }, [filterTglJurnal, filterBulanJurnal, filterGuru, getDateBounds]);

  /* ─── Fetch Izin Guru ─── */
  const fetchIzin = useCallback(async () => {
    setLoadingIzin(true);
    try {
      const { start, end } = getDateBounds(filterTglIzin, filterBulanIzin);
      const ymdMulai = start.slice(0, 10);
      const ymdSelesai = end.slice(0, 10);

      /* Ambil data izin guru */
      const { data: absences, error: errA } = await supabase
        .from('teacher_absences')
        .select('user_id, tanggal_absen, status_izin, alasan_detail, file_surat_keterangan')
        .gte('tanggal_absen', ymdMulai)
        .lte('tanggal_absen', ymdSelesai);

      if (errA) throw errA;

      /* Ambil data profil guru */
      const userIds = [...new Set((absences ?? []).map((a: any) => a.user_id))];
      const guruMap = new Map<number, string>();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, nama_lengkap')
          .in('user_id', userIds);
        (profiles ?? []).forEach((p: any) => {
          if (p.user_id) guruMap.set(Number(p.user_id), p.nama_lengkap);
        });
      }

      /* Hitung total guru hadir (unik) dari jurnal */
      const { data: journals } = await supabase
        .from('teaching_journals')
        .select('user_id')
        .gte('created_at', start)
        .lte('created_at', end);

      const uniqueGuruHadir = new Set((journals ?? []).map((j: any) => j.user_id));
      setTotalGuruHadir(uniqueGuruHadir.size);

      /* Mapping izin */
      const list: GuruIzinRow[] = (absences ?? []).map((a: any) => ({
        nama_guru: guruMap.get(Number(a.user_id)) || '—',
        status_izin: a.status_izin,
        label_izin: LABEL_IZIN[a.status_izin] || a.status_izin,
        alasan_detail: a.alasan_detail || '—',
        file_surat_keterangan: a.file_surat_keterangan || null,
      }));

      setGuruIzinList(list);
    } catch (err) {
      console.error('Gagal memuat izin guru:', err);
    } finally {
      setLoadingIzin(false);
    }
  }, [filterTglIzin, filterBulanIzin, getDateBounds]);

  /* ─── Initial load ─── */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchKehadiran(), fetchJurnal(), fetchIzin()]);
      setLoading(false);
    };
    init();
  }, []);

  /* ─── Refetch saat filter berubah ─── */
  useEffect(() => {
    if (!loading) fetchKehadiran();
  }, [filterTglKehadiran, filterBulanKehadiran, filterKelas]);

  useEffect(() => {
    if (!loading) fetchJurnal();
  }, [filterTglJurnal, filterBulanJurnal, filterGuru]);

  useEffect(() => {
    if (!loading) fetchIzin();
  }, [filterTglIzin, filterBulanIzin]);

  /* ─── Summary card at top ─── */
  const COL = { primary: '#f4aa18', accent: '#4bf666', text: '#1d1601', bg: '#fefaef' };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4, ease: 'easeOut' },
  });

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: COL.bg }}>
      {/* ─── Navbar ─── */}
      <motion.div
        {...fadeUp(0)}
        className="sticky top-0 z-30 border-b"
        style={{ borderColor: COL.primary, backgroundColor: COL.bg }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <School className="size-6" style={{ color: COL.primary }} />
            <div>
              <h1 className="text-base font-bold" style={{ color: COL.text }}>
                SIGAP — Pemantauan Sekolah
              </h1>
              <p className="text-sm" style={{ color: COL.text }}>
                Dashboard Kepala Sekolah
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="badge badge-soft badge-primary badge-sm hidden sm:inline-flex"
              style={{ color: COL.text }}
            >
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
            {onSwitchRole && (
              <button
                onClick={onSwitchRole}
                className="btn btn-ghost btn-sm gap-1.5"
                style={{ color: COL.text }}
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Kembali</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl space-y-5 px-4 pt-5">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin" style={{ color: COL.primary }} />
          </div>
        )}

        {!loading && (
          <>
            {/* ═══ Ringkasan Utama ═══ */}
            <motion.div
              {...fadeUp(0.05)}
              className="grid grid-cols-2 gap-3 lg:grid-cols-5"
            >
              <CardRingkasan
                icon={<Users className="size-5" />}
                label="Total Siswa Terpantau"
                value={ringkasan.total}
                desc="Hari ini"
                color={COL.primary}
              />
              <CardRingkasan
                icon={<UserCheck className="size-5" />}
                label="Hadir"
                value={ringkasan.hadir}
                desc={`${ringkasan.total > 0 ? Math.round((ringkasan.hadir / ringkasan.total) * 100) : 0}% kehadiran`}
                color={COL.accent}
              />
              <CardRingkasan
                icon={<BookOpen className="size-5" />}
                label="Jurnal Terisi"
                value={totalJurnal}
                desc={`${totalJam} JP total`}
                color={COL.primary}
              />
              <CardRingkasan
                icon={<AlertTriangle className="size-5" />}
                label="Siswa Tidak Hadir"
                value={ringkasan.sakit + ringkasan.izin + ringkasan.alfa}
                desc={`S:${ringkasan.sakit} I:${ringkasan.izin} A:${ringkasan.alfa}`}
                color="#E11D48"
              />
              <CardRingkasan
                icon={<CalendarX className="size-5" />}
                label="Guru Hadir / Izin"
                value={`${totalGuruHadir} / ${guruIzinList.length}`}
                desc="Guru mengajar / izin"
                color={COL.primary}
              />
            </motion.div>

            {/* ═══ Tab Navigation ═══ */}
            <motion.div
              {...fadeUp(0.1)}
              className="flex flex-wrap gap-1 rounded-xl border p-1 shadow-sm"
              style={{ backgroundColor: COL.bg, borderColor: COL.primary }}
            >
              {([
                { key: 'kehadiran' as TabKey, label: 'Monitoring Kehadiran Siswa', icon: <Users className="size-4" /> },
                { key: 'jurnal' as TabKey, label: 'Monitoring Jurnal Mengajar Guru', icon: <BookOpen className="size-4" /> },
                { key: 'izin' as TabKey, label: 'Monitoring Izin / Ketidakhadiran Guru', icon: <CalendarX className="size-4" /> },
              ]).map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all cursor-pointer ${
                    tab === key ? 'text-white' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: tab === key ? COL.primary : 'transparent',
                    color: tab === key ? '#1d1601' : COL.text,
                  }}
                >
                  {icon}{label}
                </button>
              ))}
            </motion.div>

            {/* ════════════════════════════════════════════════ */}
            {/* T A B   K E H A D I R A N   S I S W A         */}
            {/* ════════════════════════════════════════════════ */}
            {tab === 'kehadiran' && (
              <motion.div key="kehadiran" {...fadeUp(0.15)} className="space-y-4">
                {/* Filter */}
                <div
                  className="rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Filter Kelas
                      </label>
                      <select
                        value={filterKelas}
                        onChange={(e) => setFilterKelas(e.target.value)}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      >
                        <option value="">Semua Kelas</option>
                        {daftarKelas.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Pilih Tanggal
                      </label>
                      <input
                        type="date"
                        value={filterTglKehadiran}
                        onChange={(e) => {
                          setFilterTglKehadiran(e.target.value);
                          setFilterBulanKehadiran('');
                        }}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Atau Pilih Bulan
                      </label>
                      <select
                        value={filterBulanKehadiran}
                        onChange={(e) => {
                          setFilterBulanKehadiran(e.target.value);
                          if (e.target.value) setFilterTglKehadiran('');
                        }}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      >
                        <option value="">Hari Ini</option>
                        {LABEL_BULAN.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {loadingKehadiran ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin" style={{ color: COL.primary }} />
                  </div>
                ) : (
                  <>
                    {/* Ringkasan Kehadiran */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <CardRingkasan
                        icon={<UserCheck className="size-4" />}
                        label="Hadir"
                        value={ringkasan.hadir}
                        color="#10B981"
                      />
                      <CardRingkasan
                        icon={<CalendarX className="size-4" />}
                        label="Sakit"
                        value={ringkasan.sakit}
                        color="#F59E0B"
                      />
                      <CardRingkasan
                        icon={<ClipboardList className="size-4" />}
                        label="Izin"
                        value={ringkasan.izin}
                        color="#3B82F6"
                      />
                      <CardRingkasan
                        icon={<UserX className="size-4" />}
                        label="Alfa"
                        value={ringkasan.alfa}
                        color="#E11D48"
                      />
                    </div>

                    {/* Tabel Detail Siswa Tidak Hadir */}
                    <div className="rounded-xl border border-amber-200/60 bg-white shadow-sm">
                      <div className="flex items-center gap-2 border-b border-amber-200/60 px-5 py-4">
                        <UserX className="size-4" style={{ color: COL.primary }} />
                        <h3 className="text-base font-bold" style={{ color: COL.text }}>
                          Detail Siswa Tidak Hadir
                        </h3>
                        <span
                          className="ml-auto rounded px-2 py-0.5 text-sm font-semibold"
                          style={{ backgroundColor: COL.primary, color: '#1d1601' }}
                        >
                          {siswaTidakHadir.length} siswa
                        </span>
                      </div>
                      {siswaTidakHadir.length === 0 ? (
                        <div
                          className="flex flex-col items-center py-12 opacity-60"
                          style={{ color: COL.text }}
                        >
                          <UserCheck className="mb-2 size-10" />
                          <p className="text-base">Semua siswa hadir pada periode ini.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr
                                className="text-left font-bold"
                                style={{ color: COL.text, borderBottom: '1px solid #f4aa18' }}
                              >
                                <th className="p-3">Nama Siswa</th>
                                <th className="p-3">Kelas</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Keterangan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {siswaTidakHadir.map((row, i) => (
                                <tr
                                  key={i}
                                  className="border-b"
                                  style={{ borderColor: '#f4aa18' }}
                                >
                                  <td className="p-3 font-medium" style={{ color: COL.text }}>
                                    {row.nama_siswa}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className="rounded px-2 py-0.5 text-xs font-bold"
                                      style={{ backgroundColor: COL.primary, color: '#1d1601' }}
                                    >
                                      {row.kelas}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                        row.status === 'S'
                                          ? 'bg-amber-100 text-amber-700'
                                          : row.status === 'I'
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'bg-rose-100 text-rose-700'
                                      }`}
                                    >
                                      {row.status === 'S' ? 'Sakit' : row.status === 'I' ? 'Izin' : 'Alfa'}
                                    </span>
                                  </td>
                                  <td
                                    className="max-w-xs truncate p-3 text-sm"
                                    style={{ color: COL.text }}
                                    title={row.keterangan}
                                  >
                                    {row.keterangan}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════ */}
            {/* T A B   I Z I N   G U R U                     */}
            {/* ════════════════════════════════════════════════ */}
            {tab === 'izin' && (
              <motion.div key="izin" {...fadeUp(0.15)} className="space-y-4">
                {/* Filter */}
                <div className="rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Pilih Tanggal
                      </label>
                      <input
                        type="date"
                        value={filterTglIzin}
                        onChange={(e) => {
                          setFilterTglIzin(e.target.value);
                          setFilterBulanIzin('');
                        }}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Atau Pilih Bulan
                      </label>
                      <select
                        value={filterBulanIzin}
                        onChange={(e) => {
                          setFilterBulanIzin(e.target.value);
                          if (e.target.value) setFilterTglIzin('');
                        }}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      >
                        <option value="">Hari Ini</option>
                        {LABEL_BULAN.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {loadingIzin ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin" style={{ color: COL.primary }} />
                  </div>
                ) : (
                  <>
                    {/* Ringkasan Izin Guru */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <CardRingkasan
                        icon={<UserCheck className="size-5" />}
                        label="Guru Hadir Mengajar"
                        value={totalGuruHadir}
                        desc="Guru yang mengisi jurnal"
                        color={COL.accent}
                      />
                      <CardRingkasan
                        icon={<CalendarX className="size-5" />}
                        label="Guru Izin / Sakit / Dinas"
                        value={guruIzinList.length}
                        desc="Tercatat di sistem"
                        color="#F59E0B"
                      />
                      <CardRingkasan
                        icon={<Users className="size-5" />}
                        label="Total Guru (Hadir + Izin)"
                        value={totalGuruHadir + guruIzinList.length}
                        desc="Seluruh guru terpantau"
                        color={COL.primary}
                      />
                    </div>

                    {/* Tabel Detail Izin Guru */}
                    <div className="rounded-xl border border-amber-200/60 bg-white shadow-sm">
                      <div className="flex items-center gap-2 border-b border-amber-200/60 px-5 py-4">
                        <ClipboardList className="size-4" style={{ color: COL.primary }} />
                        <h3 className="text-base font-bold" style={{ color: COL.text }}>
                          Detail Izin / Ketidakhadiran Guru
                        </h3>
                        <span
                          className="ml-auto rounded px-2 py-0.5 text-sm font-semibold"
                          style={{ backgroundColor: COL.primary, color: '#1d1601' }}
                        >
                          {guruIzinList.length} guru
                        </span>
                      </div>
                      {guruIzinList.length === 0 ? (
                        <div
                          className="flex flex-col items-center py-12 opacity-60"
                          style={{ color: COL.text }}
                        >
                          <CalendarX className="mb-2 size-10" />
                          <p className="text-base">
                            Tidak ada guru yang mengajukan izin pada periode ini.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr
                                className="text-left font-bold"
                                style={{ color: COL.text, borderBottom: '1px solid #f4aa18' }}
                              >
                                <th className="p-3">Nama Guru</th>
                                <th className="p-3">Jenis Keterangan</th>
                                <th className="p-3">Alasan / Catatan Izin</th>
                                <th className="p-3">Lampiran Surat</th>
                              </tr>
                            </thead>
                            <tbody>
                              {guruIzinList.map((row, i) => (
                                <tr
                                  key={i}
                                  className="border-b"
                                  style={{ borderColor: '#f4aa18' }}
                                >
                                  <td className="p-3 font-medium" style={{ color: COL.text }}>
                                    {row.nama_guru}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                        row.status_izin === 'sakit'
                                          ? 'bg-amber-100 text-amber-700'
                                          : row.status_izin === 'izin_keperluan'
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'bg-purple-100 text-purple-700'
                                      }`}
                                    >
                                      {row.label_izin}
                                    </span>
                                  </td>
                                  <td
                                    className="max-w-xs truncate p-3"
                                    style={{ color: COL.text }}
                                    title={row.alasan_detail}
                                  >
                                    {row.alasan_detail}
                                  </td>
                                  <td className="p-3">
                                    {row.file_surat_keterangan ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                                        Ada
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
                                        Tidak Ada
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════ */}
            {/* T A B   J U R N A L   G U R U                 */}
            {/* ════════════════════════════════════════════════ */}
            {tab === 'jurnal' && (
              <motion.div key="jurnal" {...fadeUp(0.15)} className="space-y-4">
                {/* Filter */}
                <div className="rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Nama Guru
                      </label>
                      <select
                        value={filterGuru}
                        onChange={(e) => setFilterGuru(e.target.value)}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      >
                        <option value="">Semua Guru</option>
                        {guruList.map((g) => (
                          <option key={g.user_id} value={g.user_id}>
                            {g.nama_lengkap}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Pilih Tanggal
                      </label>
                      <input
                        type="date"
                        value={filterTglJurnal}
                        onChange={(e) => {
                          setFilterTglJurnal(e.target.value);
                          setFilterBulanJurnal('');
                        }}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold" style={{ color: COL.text }}>
                        Atau Pilih Bulan
                      </label>
                      <select
                        value={filterBulanJurnal}
                        onChange={(e) => {
                          setFilterBulanJurnal(e.target.value);
                          if (e.target.value) setFilterTglJurnal('');
                        }}
                        className="rounded-lg border p-2 text-base"
                        style={{
                          backgroundColor: COL.bg, borderColor: COL.primary, color: COL.text,
                        }}
                      >
                        <option value="">Hari Ini</option>
                        {LABEL_BULAN.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {loadingJurnal ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin" style={{ color: COL.primary }} />
                  </div>
                ) : (
                  <>
                    {/* Ringkasan Jurnal */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <CardRingkasan
                        icon={<BookOpen className="size-5" />}
                        label="Total Jurnal Terisi"
                        value={totalJurnal}
                        desc="Jurnal pembelajaran"
                        color={COL.primary}
                      />
                      <CardRingkasan
                        icon={<ClipboardList className="size-5" />}
                        label="Total Jam Pelajaran"
                        value={`${totalJam} JP`}
                        desc="Jam pembelajaran"
                        color={COL.accent}
                      />
                      <CardRingkasan
                        icon={<Users className="size-5" />}
                        label="Rata-rata JP / Jurnal"
                        value={totalJurnal > 0 ? (totalJam / totalJurnal).toFixed(1) : '0'}
                        desc="Jam per jurnal"
                        color={COL.primary}
                      />
                    </div>

                    {/* Tabel Feed Jurnal */}
                    <div className="rounded-xl border border-amber-200/60 bg-white shadow-sm">
                      <div className="flex items-center gap-2 border-b border-amber-200/60 px-5 py-4">
                        <ClipboardList className="size-4" style={{ color: COL.primary }} />
                        <h3 className="text-base font-bold" style={{ color: COL.text }}>
                          Feed Live Jurnal Guru
                        </h3>
                        <span
                          className="ml-auto rounded px-2 py-0.5 text-sm font-semibold"
                          style={{ backgroundColor: COL.primary, color: '#1d1601' }}
                        >
                          {jurnalFeed.length} entri
                        </span>
                      </div>
                      {jurnalFeed.length === 0 ? (
                        <div
                          className="flex flex-col items-center py-12 opacity-60"
                          style={{ color: COL.text }}
                        >
                          <BookOpen className="mb-2 size-10" />
                          <p className="text-base">
                            Belum ada jurnal pembelajaran pada periode ini.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr
                                className="text-left font-bold"
                                style={{ color: COL.text, borderBottom: '1px solid #f4aa18' }}
                              >
                                <th className="p-3">Waktu</th>
                                <th className="p-3">Nama Guru</th>
                                <th className="p-3">Mata Pelajaran</th>
                                <th className="p-3">Kelas</th>
                                <th className="p-3">Jam Ke</th>
                                <th className="p-3">Ringkasan Materi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {jurnalFeed.map((row, i) => (
                                <tr
                                  key={i}
                                  className="border-b transition-colors hover:bg-amber-50/30"
                                  style={{ borderColor: '#f4aa18' }}
                                >
                                  <td
                                    className="whitespace-nowrap p-3 text-xs"
                                    style={{ color: COL.text }}
                                  >
                                    {row.waktu}
                                  </td>
                                  <td className="p-3 font-medium" style={{ color: COL.text }}>
                                    {row.nama_guru}
                                  </td>
                                  <td className="p-3" style={{ color: COL.text }}>
                                    {row.mata_pelajaran}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className="rounded px-2 py-0.5 text-xs font-bold"
                                      style={{ backgroundColor: COL.primary, color: '#1d1601' }}
                                    >
                                      {row.kelas}
                                    </span>
                                  </td>
                                  <td className="p-3" style={{ color: COL.text }}>
                                    {row.jam_ke}
                                  </td>
                                  <td
                                    className="max-w-xs truncate p-3"
                                    style={{ color: COL.text }}
                                    title={row.materi_pembelajaran}
                                  >
                                    {row.materi_pembelajaran}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
