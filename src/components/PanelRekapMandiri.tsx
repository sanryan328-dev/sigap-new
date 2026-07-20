import { useState } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

export default function PanelRekapMandiri({ profile, currentRole }: { profile: any, currentRole: string }) {
  const [, setLoading] = useState(false);

  const downloadData = async (jenis: string) => {
    setLoading(true);
    try {
      let query = supabase.from(jenis === 'nilai' ? 'student_scores' : 'teaching_journals').select('*');
      
      // Filter berdasarkan role
      if (currentRole === 'guru_mapel' || currentRole === 'pembina_ekskul') {
        query = query.eq('user_id', profile.user_id);
      } else if (currentRole === 'wali_kelas') {
        query = query.eq('kelas', profile.kelas_wali);
      }

      const { data, error } = await query;
      if (error) throw error;

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rekap");
      XLSX.writeFile(wb, `Rekap_${jenis}_${profile.nama_lengkap}.xlsx`);
    } catch (err: any) {
      alert("Gagal download: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <h3 className="font-bold text-slate-800 mb-4">📂 Unduh Rekap Mandiri</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={() => downloadData('jurnal')} className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100">Jurnal Mengajar</button>
        <button onClick={() => downloadData('nilai')} className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100">Rekap Nilai</button>
        {currentRole === 'wali_kelas' && (
          <button onClick={() => downloadData('kehadiran')} className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold hover:bg-amber-100">Absensi Kelas</button>
        )}
      </div>
    </div>
  );
}