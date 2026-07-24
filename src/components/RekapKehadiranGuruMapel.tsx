import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/useAuthStore';

interface RekapItem {
  student_id: number;
  nama_siswa: string;
  nisn: string;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  total: number;
}

const rentangOptions = [
  { value: 'hari_ini', label: 'Hari Ini' },
  { value: 'minggu_ini', label: 'Minggu Ini' },
  { value: 'bulan_ini', label: 'Bulan Ini' },
  { value: 'semester', label: 'Semester Ini' },
];

function toLocalStr(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getDateRange(rentang: string): { gte: string; lte: string } {
  const now = new Date();
  const lte = toLocalStr(now);

  if (rentang === 'hari_ini') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { gte: toLocalStr(start), lte };
  }
  if (rentang === 'minggu_ini') {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    return { gte: toLocalStr(start), lte };
  }
  if (rentang === 'bulan_ini') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { gte: toLocalStr(start), lte };
  }
  const semesterStart = now.getMonth() < 6
    ? new Date(now.getFullYear(), 0, 1)
    : new Date(now.getFullYear(), 6, 1);
  return { gte: toLocalStr(semesterStart), lte };
}

interface Props {
  onBack?: () => void;
}

export default function RekapKehadiranGuruMapel({ onBack }: Props) {
  const profile = useAuthStore((s) => s.profile);

  const [selectedMapel, setSelectedMapel] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [rentangWaktu, setRentangWaktu] = useState('bulan_ini');
  const [dataRekap, setDataRekap] = useState<RekapItem[]>([]);
  const [loading, setLoading] = useState(false);

  const mapelEntries = (profile?.mata_pelajaran as { mapel: string; kelas: string[] }[] | null)?.filter(e => e.mapel.trim()) ?? [];
  const mapelOptions = mapelEntries.map(e => e.mapel);
  const kelasOptions = mapelEntries.find(e => e.mapel === selectedMapel)?.kelas ?? [];

  useEffect(() => {
    if (selectedMapel && selectedKelas && rentangWaktu) {
      fetchRekap();
    }
  }, [selectedMapel, selectedKelas, rentangWaktu]);

  const fetchRekap = async () => {
    setLoading(true);
    try {
      const range = getDateRange(rentangWaktu);
      const currentUserId = profile?.user_id;
      console.log('[RekapKehadiran] Filter:', { user_id: currentUserId, kelas: selectedKelas, mapel: selectedMapel, range });

      const { data: rows, error } = await supabase
        .from('student_attendances')
        .select(`
          student_id,
          status,
          students!inner(nama_siswa, nisn),
          teaching_journals!inner(
            user_id,
            kelas,
            mata_pelajaran,
            created_at
          )
        `)
        .eq('teaching_journals.user_id', currentUserId)
        .eq('teaching_journals.kelas', selectedKelas)
        .eq('teaching_journals.mata_pelajaran', selectedMapel)
        .gte('teaching_journals.created_at', range.gte)
        .lte('teaching_journals.created_at', range.lte);

      console.log('[RekapKehadiran] Query result:', rows, error);
      if (error) throw error;
      if (!rows?.length) {
        console.warn('[RekapKehadiran] Tidak ada data untuk filter ini.');
        setDataRekap([]);
        return;
      }

      const agg = new Map<number, { hadir: number; sakit: number; izin: number; alfa: number; nama_siswa: string; nisn: string }>();

      rows.forEach((r: any) => {
        if (!agg.has(r.student_id)) {
          agg.set(r.student_id, {
            hadir: 0, sakit: 0, izin: 0, alfa: 0,
            nama_siswa: r.students?.nama_siswa || `Siswa #${r.student_id}`,
            nisn: r.students?.nisn || '-',
          });
        }
        const entry = agg.get(r.student_id)!;
        if (r.status === 'Hadir') entry.hadir++;
        else if (r.status === 'Sakit') entry.sakit++;
        else if (r.status === 'Izin') entry.izin++;
        else if (r.status === 'Alfa' || r.status === 'Alpa') entry.alfa++;
      });

      const result: RekapItem[] = [];
      agg.forEach((v, student_id) => {
        result.push({
          student_id,
          nama_siswa: v.nama_siswa,
          nisn: v.nisn,
          hadir: v.hadir,
          sakit: v.sakit,
          izin: v.izin,
          alfa: v.alfa,
          total: v.hadir + v.sakit + v.izin + v.alfa,
        });
      });

      result.sort((a, b) => a.nama_siswa.localeCompare(b.nama_siswa));
      console.log('[RekapKehadiran] Hasil akhir:', result);
      setDataRekap(result);
    } catch (err: any) {
      console.error('[RekapKehadiran] Error:', err);
      toast.error('Gagal memuat data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnduhExcel = () => {
    if (!dataRekap.length) {
      toast.error('Tidak ada data untuk diunduh.');
      return;
    }
    const rows = dataRekap.map((r, i) => ({
      No: i + 1,
      Nama: r.nama_siswa,
      NISN: r.nisn,
      Hadir: r.hadir,
      Sakit: r.sakit,
      Izin: r.izin,
      Alfa: r.alfa,
      'Total Pertemuan': r.total,
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Rekap Kehadiran');
    const colWidths = [4, 30, 16, 8, 8, 8, 8, 14];
    sheet['!cols'] = colWidths.map(w => ({ wch: w }));
    XLSX.writeFile(wb, `Rekap_Kehadiran_${selectedMapel}_${selectedKelas}.xlsx`);
    toast.success('File Excel berhasil diunduh!');
  };

  const totalHadir = dataRekap.reduce((s, r) => s + r.hadir, 0);
  const totalSakit = dataRekap.reduce((s, r) => s + r.sakit, 0);
  const totalIzin = dataRekap.reduce((s, r) => s + r.izin, 0);
  const totalAlfa = dataRekap.reduce((s, r) => s + r.alfa, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
    >
      <div className="w-full max-w-5xl space-y-5">
        <div className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md">
          <div className="flex-1 flex-col items-start gap-1">
            <div className="badge badge-soft badge-primary badge-sm uppercase tracking-widest">Rekap Kehadiran</div>
            <h3 className="mt-0.5 text-sm font-bold text-slate-900">Rekapitulasi Kehadiran Siswa</h3>
          </div>
          <div className="flex-none">
            {onBack && (
              <button onClick={onBack} className="btn btn-ghost btn-sm">
                Kembali
              </button>
            )}
          </div>
        </div>

        <div className="card border border-slate-200 bg-white shadow-sm">
          <div className="card-body gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Mata Pelajaran</label>
                <select
                  value={selectedMapel}
                  onChange={e => { setSelectedMapel(e.target.value); setSelectedKelas(''); }}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="">-- Pilih Mapel --</option>
                  {mapelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Kelas</label>
                <select
                  value={selectedKelas}
                  onChange={e => setSelectedKelas(e.target.value)}
                  disabled={!selectedMapel}
                  className="select select-bordered select-sm w-full"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {kelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Rentang Waktu</label>
                <select
                  value={rentangWaktu}
                  onChange={e => setRentangWaktu(e.target.value)}
                  className="select select-bordered select-sm w-full"
                >
                  {rentangOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleUnduhExcel}
                  disabled={!dataRekap.length}
                  className="btn btn-soft btn-primary btn-sm w-full"
                >
                  <Download className="size-3.5" />
                  Unduh Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-400">
            <Loader2 className="mr-2 size-5 animate-spin" />
            Memuat data...
          </div>
        ) : !selectedMapel || !selectedKelas ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
            <BarChart3 className="mb-2 size-10 text-slate-300" />
            Pilih Mata Pelajaran dan Kelas untuk menampilkan rekap.
          </div>
        ) : dataRekap.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-slate-400">
            <BarChart3 className="mb-2 size-10 text-slate-300" />
            Belum ada data kehadiran untuk periode ini.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Hadir', value: totalHadir, color: 'text-green-700 bg-green-50 border-green-200' },
                { label: 'Sakit', value: totalSakit, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
                { label: 'Izin', value: totalIzin, color: 'text-blue-700 bg-blue-50 border-blue-200' },
                { label: 'Alfa', value: totalAlfa, color: 'text-red-700 bg-red-50 border-red-200' },
              ].map(s => (
                <div key={s.label} className={`rounded-lg border p-3 text-center ${s.color}`}>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-box border border-slate-200 bg-white shadow-sm">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="w-10 text-center">No</th>
                    <th>Nama Siswa</th>
                    <th>NISN</th>
                    <th className="text-center">Hadir</th>
                    <th className="text-center">Sakit</th>
                    <th className="text-center">Izin</th>
                    <th className="text-center">Alfa</th>
                    <th className="text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dataRekap.map((r, i) => (
                    <tr key={r.student_id} className="hover">
                      <td className="text-center text-slate-400">{i + 1}</td>
                      <td className="font-semibold text-slate-800">{r.nama_siswa}</td>
                      <td className="font-mono text-slate-500">{r.nisn}</td>
                      <td className="text-center font-semibold text-green-700">{r.hadir}</td>
                      <td className="text-center font-semibold text-yellow-700">{r.sakit}</td>
                      <td className="text-center font-semibold text-blue-700">{r.izin}</td>
                      <td className="text-center font-semibold text-red-700">{r.alfa}</td>
                      <td className="text-center font-semibold text-slate-700">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
