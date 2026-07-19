import { useState } from 'react';
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

/* ═══════════════════════════════════════════════
   DUMMY DATA — Statis untuk development
   ═══════════════════════════════════════════════ */

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

const DUMMY_TREN: TrenItem[] = [
  { tgl: '10 Mar', hadir: 22, sakit: 2, izin: 1, alfa: 0 },
  { tgl: '12 Mar', hadir: 20, sakit: 1, izin: 3, alfa: 1 },
  { tgl: '14 Mar', hadir: 23, sakit: 0, izin: 1, alfa: 1 },
  { tgl: '17 Mar', hadir: 19, sakit: 3, izin: 2, alfa: 1 },
  { tgl: '19 Mar', hadir: 21, sakit: 1, izin: 0, alfa: 3 },
  { tgl: '21 Mar', hadir: 24, sakit: 0, izin: 0, alfa: 1 },
  { tgl: '24 Mar', hadir: 22, sakit: 2, izin: 1, alfa: 0 },
];

const DUMMY_SEBARAN_KELAS: KelasItem[] = [
  { kelas: 'VII A', jumlah: 4 },
  { kelas: 'VII B', jumlah: 3 },
  { kelas: 'VIII A', jumlah: 5 },
  { kelas: 'VIII B', jumlah: 2 },
  { kelas: 'IX A', jumlah: 6 },
  { kelas: 'IX B', jumlah: 3 },
];

const DUMMY_NILAI: NilaiItem[] = [
  { nama: 'Sangat Baik', value: 8 },
  { nama: 'Baik', value: 14 },
  { nama: 'Cukup', value: 5 },
  { nama: 'Kurang', value: 2 },
];

/* ═══════════════════════════════════════════════
   WARNA
   ═══════════════════════════════════════════════ */

const WARNA_TREN: Record<string, string> = {
  hadir: '#10B981',
  sakit: '#F59E0B',
  izin: '#3B82F6',
  alfa: '#E11D48',
};

const WARNA_PIE = ['#367cce', '#bdd962', '#e3a98b', '#f97316'];

/* ═══════════════════════════════════════════════
   CUSTOM TOOLTIP
   ═══════════════════════════════════════════════ */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-bold text-slate-700">{label}</p>
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

/* ═══════════════════════════════════════════════
   TIPE TAB
   ═══════════════════════════════════════════════ */

type Tab = 'tren' | 'sebaran_kelas' | 'sebaran_nilai';

const TAB_LABEL: Record<Tab, string> = {
  tren: 'Tren Kehadiran Anggota',
  sebaran_kelas: 'Sebaran Anggota per Kelas',
  sebaran_nilai: 'Sebaran Nilai Siswa',
};

/* ═══════════════════════════════════════════════
   KOMPONEN UTAMA
   ═══════════════════════════════════════════════ */

export default function EkskulAnalytics() {
  const [activeTab, setActiveTab] = useState<Tab>('tren');

  return (
    <div className="card rounded-2xl border border-slate-200/60 bg-white shadow-md">
      <div className="card-body gap-5 p-5 sm:p-6">
        {/* ── Header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="card-title text-sm text-slate-900">
              Analitik Ekstrakurikuler
            </h3>
            <p className="text-xs text-slate-500">
              Visualisasi data kehadiran, sebaran anggota, dan capaian nilai
            </p>
          </div>
        </div>

        {/* ── Tab Group ── */}
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

        {/* ── Area Chart ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'tren' && (
            <motion.div
              key="tren"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DUMMY_TREN} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                    <defs>
                      {Object.entries(WARNA_TREN).map(([key, color]) => (
                        <linearGradient key={key} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={color} stopOpacity={0.03} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                      dataKey="tgl"
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
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Legend
                      wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                      iconType="circle"
                      iconSize={8}
                    />
                    {Object.entries(WARNA_TREN).map(([key, color], idx) => (
                      <Area
                        key={key}
                        dataKey={key}
                        stackId="1"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#grad_${key})`}
                        animationBegin={idx * 100}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bar Chart ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'sebaran_kelas' && (
            <motion.div
              key="sebaran_kelas"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DUMMY_SEBARAN_KELAS} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barCategoryGap="24%">
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
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                    <Bar
                      dataKey="jumlah"
                      fill="#367cce"
                      radius={[6, 6, 0, 0]}
                      animationBegin={100}
                      animationDuration={700}
                      animationEasing="ease-out"
                      label={{
                        position: 'top',
                        fontSize: 11,
                        fontWeight: 700,
                        fill: '#367cce',
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pie Chart ── */}
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
                      <Pie
                        data={DUMMY_NILAI}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="nama"
                        animationBegin={100}
                        animationDuration={700}
                        animationEasing="ease-out"
                      >
                        {DUMMY_NILAI.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={WARNA_PIE[idx % WARNA_PIE.length]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* ── Legend Manual ── */}
                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:mt-0 sm:flex-col sm:justify-center sm:pl-6">
                  {DUMMY_NILAI.map((item, idx) => (
                    <div key={item.nama} className="flex items-center gap-2 text-xs">
                      <span
                        className="inline-block size-3 rounded-full"
                        style={{ backgroundColor: WARNA_PIE[idx % WARNA_PIE.length] }}
                      />
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
