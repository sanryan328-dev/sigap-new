import { useAuthStore } from '../store/useAuthStore';

interface BkRecord {
  id: string;
  student_name: string;
  kategori_kasus: string;
  detail_kasus: string;
  tindakan_penanganan: string;
  status: string;
  created_at: string;
}

interface RekapBKWaliProps {
  setSubMenuWali: (menu: 'kehadiran' | 'bk' | null) => void;
  dataBk: BkRecord[];
  loadingBk: boolean;
}

export default function RekapBKWali({ setSubMenuWali, dataBk, loadingBk }: RekapBKWaliProps) {
  const profile = useAuthStore((s) => s.profile);
  
  const formatTanggal = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSubMenuWali(null)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            ⬅️ Panel Wali Kelas
          </button>
          <span className="text-sm font-semibold text-slate-700">Kelas Wali: {profile?.kelas_wali}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-amber-900">Rekapitulasi Catatan Bimbingan Konseling (BK)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Berikut adalah daftar riwayat kerawanan, kasus, atau pembinaan yang tercatat oleh Guru BK untuk siswa kelas Anda.
          </p>
        </div>

        {/* Tabel Data BK */}
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
          {loadingBk ? (
            <p className="text-sm text-slate-500 animate-pulse p-8 text-center">Menarik riwayat catatan BK siswa dari database...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium text-sm">
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Nama Siswa</th>
                    <th className="p-4">Kategori Kasus</th>
                    <th className="p-4">Detail Kejadian</th>
                    <th className="p-4">Tindakan BK</th>
                    <th className="p-4 text-center">Status Binaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {dataBk.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        Alhamdulillah, belum ada catatan kasus/pelanggaran BK untuk siswa kelas ini.
                      </td>
                    </tr>
                  ) : (
                    dataBk.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-4 whitespace-nowrap font-medium text-slate-500">{formatTanggal(item.created_at)}</td>
                        <td className="p-4 font-bold text-slate-900">{item.student_name}</td>
                        <td className="p-4"><span className="bg-red-50 text-red-700 font-semibold px-2 py-0.5 rounded text-[10px]">{item.kategori_kasus}</span></td>
                        <td className="p-4 max-w-xs truncate" title={item.detail_kasus}>{item.detail_kasus}</td>
                        <td className="p-4 max-w-xs truncate" title={item.tindakan_penanganan}>{item.tindakan_penanganan}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'Tuntas' || item.status === 'Selesai'
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700 animate-pulse'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}