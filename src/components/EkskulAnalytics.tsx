import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { supabase } from '../supabaseClient';
import { BarChart3 } from 'lucide-react';

interface EkskulAnalyticsProps {
  ekskulId: string | null;
  ekskulName: string;
}

interface TrenItem {
  tgl: string;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
}

interface KelasItem {
  kelas: string;
  jumlah: number;
}

interface NilaiItem {
  nama: string;
  value: number;
}

const WARNA_TREN: Record<string, string> = {
  hadir: '#10B981',
  sakit: '#F59E0B',
  izin: '#3B82F6',
  alfa: '#E11D48',
};

const WARNA_PIE = ['#367cce', '#bdd962', '#e3a98b', '#f97316'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 text-sm font-bold text-slate-700">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-[11px]">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

type Tab = 'tren' | 'sebaran_kelas' | 'sebaran_nilai';

const TAB_LABEL: Record<Tab, string> = {
  tren: 'Tren Kehadiran Anggota',
  sebaran_kelas: 'Sebaran Anggota per Kelas',
  sebaran_nilai: 'Sebaran Nilai Siswa',
};

export default function EkskulAnalytics({ ekskulId, ekskulName }: EkskulAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tren');
  const [trenData, setTrenData] = useState<TrenItem[]>([]);
  const [kelasData, setKelasData] = useState<KelasItem[]>([]);
  const [nilaiData, setNilaiData] = useState<NilaiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAnggota, setTotalAnggota] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [ekskulId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let memberQuery = supabase.from('student_ekskul').select('*');
      if (ekskulId) {
        memberQuery = memberQuery.eq('ekskul_id', ekskulId);
      } else {
        memberQuery = memberQuery.eq('nama_ekskul', ekskulName);
      }
      const { data: members } = await memberQuery;
      if (!members || members.length === 0) {
        setTrenData([]);
        setKelasData([]);
        setNilaiData([]);
        setTotalAnggota(0);
        setLoading(false);
        return;
      }

      setTotalAnggota(members.length);

      const studentIds = [...new Set(members.map(m => m.student_id))];
      const { data: students } = await supabase.from('students').select('id, kelas').in('id', studentIds);
      const studentMap = new Map((students || []).map(s => [s.id, s]));

      const kelasCount: Record<string, number> = {};
      members.forEach(m => {
        const siswa = studentMap.get(m.student_id);
        if (siswa?.kelas) {
          kelasCount[siswa.kelas] = (kelasCount[siswa.kelas] || 0) + 1;
        }
      });
      const kelasItems = Object.entries(kelasCount)
        .map(([kelas, jumlah]) => ({ kelas, jumlah }))
        .sort((a, b) => b.jumlah - a.jumlah);
      setKelasData(kelasItems);

      const nilaiCount: Record<string, number> = { 'Sangat Baik': 0, 'Baik': 0, 'Cukup': 0, 'Kurang': 0 };
      members.forEach(m => {
        const nk = m.nilai_kualitatif || 'B';
        if (nk === 'A') nilaiCount['Sangat Baik']++;
        else if (nk === 'B') nilaiCount['Baik']++;
        else if (nk === 'C') nilaiCount['Cukup']++;
        else nilaiCount['Kurang']++;
      });
      setNilaiData(Object.entries(nilaiCount).map(([nama, value]) => ({ nama, value })));

      const journalQuery = supabase.from('teaching_journals').select('id, created_at').eq('kelas', 'Ekskul');
      const filteredJournalQuery = ekskulId
        ? journalQuery.eq('ekskul_id', ekskulId)
        : journalQuery.ilike('mata_pelajaran', `%${ekskulName}%`);
      const { data: journals } = await filteredJournalQuery.order('created_at', { ascending: true });

      if (!journals || journals.length === 0) {
        setTrenData([]);
        setLoading(false);
        return;
      }

      const journalIds = journals.map(j => j.id);
      const { data: attendances } = await supabase
        .from('student_attendances')
        .select('teaching_journal_id, status')
        .in('teaching_journal_id', journalIds);

      const attByJournal: Record<number, { hadir: number; sakit: number; izin: number; alfa: number }> = {};
      (attendances || []).forEach(a => {
        if (!attByJournal[a.teaching_journal_id]) {
          attByJournal[a.teaching_journal_id] = { hadir: 0, sakit: 0, izin: 0, alfa: 0 };
        }
        const bucket = attByJournal[a.teaching_journal_id];
        if (a.status === 'Hadir') bucket.hadir++;
        else if (a.status === 'Sakit') bucket.sakit++;
        else if (a.status === 'Izin') bucket.izin++;
        else bucket.alfa++;
      });

      const tren: TrenItem[] = journals.map(j => {
        const tgl = new Date(j.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const att = attByJournal[j.id] || { hadir: 0, sakit: 0, izin: 0, alfa: 0 };
        return { tgl, ...att };
      });
      setTrenData(tren);
    } catch {
      setTrenData([]);
      setKelasData([]);
      setNilaiData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card rounded-2xl border border-slate-200/60 bg-white shadow-md">
        <div className="card-body items-center justify-center py-16">
          <span className="loading loading-spinner loading-md text-violet-500" />
          <p className="mt-2 text-sm text-slate-400">Memuat analitik...</p>
        </div>
      </div>
    );
  }

  if (totalAnggota === 0) {
    return (
      <div className="card rounded-2xl border border-slate-200/60 bg-white shadow-md">
        <div className="card-body items-center gap-3 py-16 text-center">
          <BarChart3 className="size-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">Belum ada data untuk analitik.</p>
          <p className="text-sm text-slate-400">Tambahkan anggota dan mulai catat jurnal untuk melihat analitik.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card rounded-2xl border border-slate-200/60 bg-white shadow-md">
      <div className="card-body gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="card-title text-sm text-slate-900">
              Analitik {ekskulName}
            </h3>
            <p className="text-sm text-slate-500">
              {totalAnggota} anggota terdaftar &bull; {trenData.length} jurnal tercatat
            </p>
          </div>
        </div>

        <div className="tabs tabs-box border border-slate-200 bg-slate-50/50 p-1">
          {(Object.keys(TAB_LABEL) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab tab-sm flex-1 whitespace-nowrap text-[11px] font-bold transition-all duration-200 ${
                activeTab === tab
                  ? 'tab-active rounded-lg bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {TAB_LABEL[tab]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tren' && (
            <motion.div
              key="tren"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {trenData.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">Belum ada data jurnal.</p>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trenData} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                      <defs>
                        {Object.entries(WARNA_TREN).map(([key, color]) => (
                          <linearGradient key={key} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0.03} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="tgl" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />
                      {Object.entries(WARNA_TREN).map(([key, color], idx) => (
                        <Area key={key} dataKey={key} stackId="1" stroke={color} strokeWidth={2} fill={`url(#grad_${key})`} animationBegin={idx * 100} animationDuration={800} animationEasing="ease-out" />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'sebaran_kelas' && (
            <motion.div
              key="sebaran_kelas"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {kelasData.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">Belum ada data anggota.</p>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kelasData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barCategoryGap="24%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="kelas" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                      <Bar dataKey="jumlah" fill="#367cce" radius={[6, 6, 0, 0]} animationBegin={100} animationDuration={700} animationEasing="ease-out" label={{ position: 'top', fontSize: 11, fontWeight: 700, fill: '#367cce' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'sebaran_nilai' && (
            <motion.div
              key="sebaran_nilai"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-center">
                <div className="h-72 w-full max-w-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={nilaiData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" nameKey="nama" animationBegin={100} animationDuration={700} animationEasing="ease-out">
                        {nilaiData.map((_, idx) => (
                          <Cell key={idx} fill={WARNA_PIE[idx % WARNA_PIE.length]} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:mt-0 sm:flex-col sm:justify-center sm:pl-6">
                  {nilaiData.map((item, idx) => (
                    <div key={item.nama} className="flex items-center gap-2 text-sm">
                      <span className="inline-block size-3 rounded-full" style={{ backgroundColor: WARNA_PIE[idx % WARNA_PIE.length] }} />
                      <span className="text-slate-600">{item.nama}</span>
                      <span className="font-bold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
