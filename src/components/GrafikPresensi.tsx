import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  hari: string;
  Hadir: number;
  Sakit: number;
  Izin: number;
  Alpha: number;
}

const dummyData: DataPoint[] = [
  { hari: 'Sen', Hadir: 32, Sakit: 2, Izin: 1, Alpha: 0 },
  { hari: 'Sel', Hadir: 30, Sakit: 1, Izin: 2, Alpha: 2 },
  { hari: 'Rab', Hadir: 33, Sakit: 0, Izin: 1, Alpha: 1 },
  { hari: 'Kam', Hadir: 31, Sakit: 3, Izin: 0, Alpha: 1 },
  { hari: 'Jum', Hadir: 29, Sakit: 1, Izin: 3, Alpha: 2 },
  { hari: 'Sab', Hadir: 34, Sakit: 0, Izin: 0, Alpha: 1 },
];

const COLORS = {
  Hadir: '#10B981',
  Sakit: '#F59E0B',
  Izin: '#3B82F6',
  Alpha: '#E11D48',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, e: any) => s + e.value, 0);
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
      <div className="mt-1.5 border-t border-slate-100 pt-1 text-[11px] font-semibold text-slate-800">
        Total: {total} siswa
      </div>
    </div>
  );
}

export default function GrafikPresensi() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dummyData} barGap={2} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="hari"
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
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {Object.entries(COLORS).map(([key, color]) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={color}
              radius={[2, 2, 0, 0]}
              animationBegin={150}
              animationDuration={800}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
