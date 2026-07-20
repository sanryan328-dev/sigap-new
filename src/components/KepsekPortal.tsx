import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  GraduationCap, Users, BookOpen, CalendarX, ClipboardList, ArrowLeft,
  Loader2, ShieldCheck, UserX, School,
} from 'lucide-react';
import { useAuthStore, selectIsAdmin, selectIsKepsek } from '../store/useAuthStore';

/* ─── Types ─── */

interface GuruMap {
  [userId: number]: string;
}

interface JurnalRow {
  user_id: number;
  nama_guru: string;
  kelas: string;
  mata_pelajaran: string;
  jam_ke: string;
  materi_pembelajaran: string;
}

interface AbsenKelas {
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  total: number;
}

interface GuruIzinRow {
  nama_guru: string;
  status_izin: string;
  alasan_detail: string;
  titipan_tugas_kelas: string;
}

type TabKey = 'jurnal' | 'absen' | 'izin';

/* ─── Helpers ─── */

const LABEL_IZIN: Record<string, string> = {
  sakit: 'Sakit',
  izin_keperluan: 'Izin Keperluan',
  tugas_dinas: 'Tugas Dinas',
};

const LABEL_STATUS: Record<string, string> = {
  Hadir: 'Hadir',
  Sakit: 'Sakit',
  Izin: 'Izin',
  Alfa: 'Alfa',
};

const WARNA_ABSEN: Record<string, string> = {
  Hadir: '#10B981',
  Sakit: '#F59E0B',
  Izin: '#3B82F6',
  Alfa: '#E11D48',
};

function BadgeIzin({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    sakit: 'badge-soft badge-warning',
    izin_keperluan: 'badge-soft badge-info',
    tugas_dinas: 'badge-soft badge-primary',
  };
  return (
    <span className={`badge badge-sm ${colorMap[status] ?? 'badge-soft'}`}>
      {LABEL_IZIN[status] ?? status}
    </span>
  );
}

function BadgeHadir({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Hadir: 'badge-soft badge-success',
    Sakit: 'badge-soft badge-warning',
    Izin: 'badge-soft badge-info',
    Alfa: 'badge-soft badge-error',
  };
  return (
    <span className={`badge badge-sm ${colorMap[status] ?? 'badge-soft'}`}>
      {LABEL_STATUS[status] ?? status}
    </span>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-bold text-slate-700">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-[11px]">
          <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Unauthorized Guard ─── */

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-md bg-white shadow-xl"
      >
        <div className="card-body items-center text-center">
          <ShieldCheck className="mb-2 size-16 text-error" />
          <h2 className="card-title text-lg text-error">Akses Ditolak</h2>
          <p className="text-sm text-slate-500">
            Halaman ini hanya untuk Kepala Sekolah atau Admin.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Component ─── */

interface Props {
  onSwitchRole?: () => void;
}

export default function KepsekPortal({ onSwitchRole }: Props) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore(selectIsAdmin);
  const isKepsek = useAuthStore(selectIsKepsek);

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('jurnal');
  const [dataJurnal, setDataJurnal] = useState<JurnalRow[]>([]);
  const [dataAbsenKelas, setDataAbsenKelas] = useState<Record<string, AbsenKelas>>({});
  const [dataGuruIzin, setDataGuruIzin] = useState<GuruIzinRow[]>([]);
  const [stats, setStats] = useState({ guruAktif: 0, kehadiranSiswa: 0, guruBerizin: 0, jurnalTerkirim: 0 });
  const [totalSiswa, setTotalSiswa] = useState(0);

  if (!user || (!isAdmin && !isKepsek)) return <Unauthorized />;

  /* ─── Data Fetching ─── */

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      try {
        const [
          { data: journals, error: errJ },
          { data: attendances, error: errA },
          { data: absences, error: errAbs },
          { data: profiles, error: errP },
          { data: students, error: errS },
        ] = await Promise.all([
          supabase
            .from('teaching_journals')
            .select('user_id, kelas, mata_pelajaran, jam_ke, materi_pembelajaran, created_at')
            .gte('created_at', today)
            .order('created_at', { ascending: false }),
          supabase
            .from('student_attendances')
            .select('student_id, status, created_at')
            .gte('created_at', today),
          supabase
            .from('teacher_absences')
            .select('user_id, status_izin, alasan_detail, titipan_tugas_kelas')
            .eq('tanggal_absen', today)
            .eq('status_verifikasi', 'diverifikasi_piket'),
          supabase
            .from('profiles')
            .select('user_id, nama_lengkap'),
          supabase
            .from('students')
            .select('id, kelas'),
        ]);

        if (cancelled) return;
        if (errJ || errA || errAbs || errP || errS) {
          console.error('KepsekPortal fetch error:', { errJ, errA, errAbs, errP, errS });
          setLoading(false);
          return;
        }

        /* ─── Build Maps ─── */

        const guruMap: GuruMap = {};
        (profiles ?? []).forEach((p: any) => {
          if (p.user_id && p.nama_lengkap) guruMap[Number(p.user_id)] = p.nama_lengkap;
        });

        const kelasMap: Record<number, string> = {};
        (students ?? []).forEach((s: any) => {
          if (s.id && s.kelas) kelasMap[Number(s.id)] = s.kelas;
        });

        /* ─── Stats ─── */

        const jArr = journals ?? [];
        const aArr = attendances ?? [];
        const absArr = absences ?? [];
        const total = students?.length ?? 0;

        const uniqueGuru = new Set(jArr.map((j: any) => j.user_id));
        const hadirCount = aArr.filter((a: any) => a.status === 'Hadir').length;
        const kehadiran = total > 0 ? Math.round((hadirCount / total) * 100) : 0;

        setStats({
          guruAktif: uniqueGuru.size,
          kehadiranSiswa: kehadiran,
          guruBerizin: absArr.length,
          jurnalTerkirim: jArr.length,
        });
        setTotalSiswa(total);

        /* ─── Jurnal Rows ─── */

        const rows: JurnalRow[] = jArr.map((j: any) => ({
          user_id: j.user_id,
          nama_guru: guruMap[Number(j.user_id)] ?? '—',
          kelas: j.kelas ?? '—',
          mata_pelajaran: j.mata_pelajaran ?? '—',
          jam_ke: j.jam_ke ?? '—',
          materi_pembelajaran: j.materi_pembelajaran ?? '—',
        }));
        setDataJurnal(rows);

        /* ─── Absen per Kelas ─── */

        const absenMap: Record<string, AbsenKelas> = {};
        aArr.forEach((a: any) => {
          const sid = Number(a.student_id);
          const kelas = kelasMap[sid] ?? 'Tanpa Kelas';
          if (!absenMap[kelas]) {
            absenMap[kelas] = { hadir: 0, sakit: 0, izin: 0, alfa: 0, total: 0 };
          }
          if (a.status === 'Hadir') absenMap[kelas].hadir++;
          else if (a.status === 'Sakit') absenMap[kelas].sakit++;
          else if (a.status === 'Izin') absenMap[kelas].izin++;
          else if (a.status === 'Alfa' || a.status === 'Alpha') absenMap[kelas].alfa++;
          absenMap[kelas].total++;
        });
        setDataAbsenKelas(absenMap);

        /* ─── Guru Izin Rows ─── */

        const izinRows: GuruIzinRow[] = absArr.map((a: any) => ({
          nama_guru: guruMap[Number(a.user_id)] ?? '—',
          status_izin: a.status_izin ?? '—',
          alasan_detail: a.alasan_detail ?? '—',
          titipan_tugas_kelas: a.titipan_tugas_kelas ?? '—',
        }));
        setDataGuruIzin(izinRows);
      } catch (err) {
        console.error('KepsekPortal error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  /* ─── Chart Data ─── */

  const chartData = useMemo(() => {
    return Object.entries(dataAbsenKelas)
      .filter(([kelas]) => /^[IVXLCDM]+\s/.test(kelas))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([kelas, v]) => ({
        kelas,
        Hadir: v.hadir,
        Sakit: v.sakit,
        Izin: v.izin,
        Alfa: v.alfa,
      }));
  }, [dataAbsenKelas]);

  /* ─── Rendering ─── */

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4, ease: 'easeOut' },
  });

  const TAB_LABEL: Record<TabKey, string> = {
    jurnal: 'Jurnal Harian',
    absen: 'Absen Siswa',
    izin: 'Izin Guru',
  };

  return (
    <div className="min-h-screen bg-base-200 pb-8">
      {/* ─── Navbar ─── */}
      <motion.div {...fadeUp(0)} className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <School className="size-6 text-primary" />
            <div>
              <h1 className="text-sm font-bold text-slate-800 sm:text-base">
                SIGAP — Pemantauan Sekolah
              </h1>
              <p className="text-[11px] text-slate-500">Dashboard Kepala Sekolah</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-soft badge-primary badge-sm hidden sm:inline-flex">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {onSwitchRole && (
              <button onClick={onSwitchRole} className="btn btn-ghost btn-sm gap-1.5 text-slate-600">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Kembali</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl space-y-5 px-4 pt-5">
        {/* ─── Loading ─── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && (
          <>
            {/* ═══ Panel Ringkasan Utama ═══ */}
            <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="stat rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="stat-figure text-primary">
                  <GraduationCap className="size-6" />
                </div>
                <div className="stat-title text-[11px]">Guru Mengajar Hari Ini</div>
                <div className="stat-value text-2xl text-primary">{stats.guruAktif}</div>
                <div className="stat-desc text-[11px]">Guru aktif</div>
              </div>

              <div className="stat rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="stat-figure text-success">
                  <Users className="size-6" />
                </div>
                <div className="stat-title text-[11px]">Kehadiran Siswa</div>
                <div className="stat-value text-2xl text-success">{stats.kehadiranSiswa}%</div>
                <div className="stat-desc text-[11px]">{totalSiswa} total siswa</div>
              </div>

              <div className="stat rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="stat-figure text-warning">
                  <CalendarX className="size-6" />
                </div>
                <div className="stat-title text-[11px]">Guru Berizin / Sakit</div>
                <div className="stat-value text-2xl text-warning">{stats.guruBerizin}</div>
                <div className="stat-desc text-[11px]">Terverifikasi piket</div>
              </div>

              <div className="stat rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="stat-figure text-info">
                  <BookOpen className="size-6" />
                </div>
                <div className="stat-title text-[11px]">Jurnal KBM Terisi</div>
                <div className="stat-value text-2xl text-info">{stats.jurnalTerkirim}</div>
                <div className="stat-desc text-[11px]">Jurnal hari ini</div>
              </div>
            </motion.div>

            {/* ═══ Tab Navigation ═══ */}
            <motion.div {...fadeUp(0.1)} className="tabs tabs-box justify-start gap-0 rounded-xl bg-white p-1 shadow-sm">
              {(Object.keys(TAB_LABEL) as TabKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`tab tab-sm flex-1 rounded-lg text-xs font-medium transition-all sm:flex-none sm:px-5 ${
                    tab === key
                      ? 'tab-active bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {TAB_LABEL[key]}
                </button>
              ))}
            </motion.div>

            {/* ═══ Tab Content ═══ */}

            {/* ── Tab: Jurnal Harian ── */}
            {tab === 'jurnal' && (
              <motion.div key="jurnal" {...fadeUp(0.15)} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                  <ClipboardList className="size-4 text-primary" />
                  <h2 className="text-sm font-bold text-slate-800">Rekap Harian Jurnal Guru</h2>
                  <span className="badge badge-soft badge-primary badge-sm ml-auto">{dataJurnal.length} entri</span>
                </div>
                {dataJurnal.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-slate-400">
                    <BookOpen className="mb-2 size-10" />
                    <p className="text-sm">Belum ada jurnal pembelajaran hari ini.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-sm w-full">
                      <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Nama Guru</th>
                          <th className="px-4 py-3">Kelas</th>
                          <th className="px-4 py-3">Mata Pelajaran</th>
                          <th className="px-4 py-3">Jam Ke</th>
                          <th className="px-4 py-3">Ringkasan Materi</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {dataJurnal.map((row, i) => (
                          <tr key={`${row.user_id}-${i}`} className="hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-medium text-slate-800">{row.nama_guru}</td>
                            <td className="px-4 py-2.5">
                              <span className="badge badge-soft badge-primary badge-sm">{row.kelas}</span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">{row.mata_pelajaran}</td>
                            <td className="px-4 py-2.5 text-slate-500">Jam ke-{row.jam_ke}</td>
                            <td className="max-w-xs truncate px-4 py-2.5 text-slate-500" title={row.materi_pembelajaran}>
                              {row.materi_pembelajaran}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Tab: Absen Siswa ── */}
            {tab === 'absen' && (
              <motion.div key="absen" {...fadeUp(0.15)} className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    <h2 className="text-sm font-bold text-slate-800">Grafik Absensi Siswa per Kelas</h2>
                  </div>
                  {chartData.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-slate-400">
                      <UserX className="mb-2 size-10" />
                      <p className="text-sm">Belum ada data absensi hari ini.</p>
                    </div>
                  ) : (
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                          <XAxis
                            dataKey="kelas"
                            tick={{ fontSize: 11, fill: '#64748B' }}
                            axisLine={{ stroke: '#E2E8F0' }}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: '#64748B' }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                          />
                          <ReTooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                          <Legend
                            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                            iconType="circle"
                            iconSize={8}
                          />
                          {Object.entries(WARNA_ABSEN).map(([key, color]) => (
                            <Bar
                              key={key}
                              dataKey={key}
                              stackId="absen"
                              fill={color}
                              strokeWidth={1}
                              stroke="#fff"
                              radius={[0, 0, 0, 0]}
                              animationBegin={100}
                              animationDuration={700}
                              animationEasing="ease-out"
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                    <ClipboardList className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-slate-800">Rekapitulasi per Kelas</h3>
                  </div>
                  {chartData.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">Tidak ada data</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-sm w-full">
                        <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Kelas</th>
                            <th className="px-4 py-3 text-green-600">Hadir</th>
                            <th className="px-4 py-3 text-amber-600">Sakit</th>
                            <th className="px-4 py-3 text-blue-600">Izin</th>
                            <th className="px-4 py-3 text-rose-600">Alfa</th>
                            <th className="px-4 py-3">Total</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          {chartData.map((r) => (
                            <tr key={r.kelas} className="hover:bg-slate-50">
                              <td className="px-4 py-2.5 font-medium text-slate-800">{r.kelas}</td>
                              <td className="px-4 py-2.5 font-semibold text-green-600">{r.Hadir}</td>
                              <td className="px-4 py-2.5 text-amber-600">{r.Sakit}</td>
                              <td className="px-4 py-2.5 text-blue-600">{r.Izin}</td>
                              <td className="px-4 py-2.5 text-rose-600">{r.Alfa}</td>
                              <td className="px-4 py-2.5 text-slate-600">
                                {r.Hadir + r.Sakit + r.Izin + r.Alfa}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Tab: Izin Guru ── */}
            {tab === 'izin' && (
              <motion.div key="izin" {...fadeUp(0.15)} className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                    <CalendarX className="size-4 text-warning" />
                    <h2 className="text-sm font-bold text-slate-800">Izin & Tugas Titipan Guru</h2>
                    <span className="badge badge-soft badge-warning badge-sm ml-auto">
                      {dataGuruIzin.length} guru
                    </span>
                  </div>
                  {dataGuruIzin.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-slate-400">
                      <ShieldCheck className="mb-2 size-10" />
                      <p className="text-sm">Tidak ada guru yang berizin hari ini.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-sm w-full">
                        <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Nama Guru</th>
                            <th className="px-4 py-3">Status Izin</th>
                            <th className="px-4 py-3">Alasan Detail</th>
                            <th className="px-4 py-3">Titipan Tugas Kelas</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          {dataGuruIzin.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="px-4 py-2.5 font-medium text-slate-800">{row.nama_guru}</td>
                              <td className="px-4 py-2.5">
                                <BadgeIzin status={row.status_izin} />
                              </td>
                              <td className="max-w-xs truncate px-4 py-2.5 text-slate-600" title={row.alasan_detail}>
                                {row.alasan_detail}
                              </td>
                              <td className="px-4 py-2.5">
                                {row.titipan_tugas_kelas && row.titipan_tugas_kelas !== '—' ? (
                                  <span
                                    className="max-w-[200px] truncate block text-slate-600"
                                    title={row.titipan_tugas_kelas}
                                  >
                                    {row.titipan_tugas_kelas}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
