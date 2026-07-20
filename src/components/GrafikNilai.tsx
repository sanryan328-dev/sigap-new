import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  nama: string;
  rataRata: number;
}

const dummyData: DataPoint[] = [
  { nama: 'Tugas 1', rataRata: 72 },
  { nama: 'Tugas 2', rataRata: 78 },
  { nama: 'UH 1', rataRata: 68 },
  { nama: 'Tugas 3', rataRata: 81 },
  { nama: 'UTS', rataRata: 74 },
  { nama: 'UH 2', rataRata: 79 },
  { nama: 'UAS', rataRata: 85 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-1 text-sm font-bold text-slate-700">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-[11px]">
          <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">Rata-rata:</span>
          <span className="font-bold text-slate-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function GrafikNilai() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dummyData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="nilaiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="nama"
            tick={{ fontSize: 11, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#64748B' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="rataRata"
            stroke="#6366F1"
            strokeWidth={2.5}
            fill="url(#nilaiGrad)"
            dot={{ fill: '#6366F1', stroke: '#fff', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#6366F1', stroke: '#fff', strokeWidth: 2.5, r: 6 }}
            animationBegin={100}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
