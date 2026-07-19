import React from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAuthStore } from '../store/useAuthStore';

interface Siswa {
  id: string;
  nama_siswa: string;
  nisn: string;
}

interface FormJurnalProps {
  currentRole: 'guru_mapel' | 'wali_kelas' | 'pembina_ekskul';
  setSubMenu: (menu: any) => void;
  kelas: string;
  setKelas: (val: string) => void;
  mataPelajaran: string;
  setMataPelajaran: (val: string) => void;
  jamMulai: string;
  setJamMulai: (val: string) => void;
  jamSelesai: string;
  setJamSelesai: (val: string) => void;
  materi: string;
  setMateri: (val: string) => void;
  catatan: string;
  setCatatan: (val: string) => void;
  daftarKelas: string[];
  daftarSiswa: Siswa[];
  presensi: { [key: string]: string };
  handleStatusChange: (siswaId: string, status: string) => void;
  handleSubmitJurnal: (e: React.FormEvent) => void;
  loadingSiswa: boolean;
  loadingSimpan: boolean;
}

export default function FormJurnal({
  currentRole,
  setSubMenu,
  kelas,
  setKelas,
  mataPelajaran,
  setMataPelajaran,
  jamMulai,
  setJamMulai,
  jamSelesai,
  setJamSelesai,
  materi,
  setMateri,
  catatan,
  setCatatan,
  daftarKelas,
  daftarSiswa,
  presensi,
  handleStatusChange,
  handleSubmitJurnal,
  loadingSiswa,
  loadingSimpan,
}: FormJurnalProps) {
  const profile = useAuthStore((s) => s.profile);
  const [parentPresensi] = useAutoAnimate();

  const renderLabelKembali = () => {
    if (currentRole === 'guru_mapel') return '⬅️ Panel Guru Mapel';
    if (currentRole === 'wali_kelas') return '⬅️ Panel Wali Kelas';
    if (currentRole === 'pembina_ekskul') return '⬅️ Panel Ekstrakurikuler';
    return '⬅️ Kembali';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            // 🔥 PERBAIKAN PENTING: Mendukung alur navigasi balik secara adaptif untuk tiap role
            onClick={() => setSubMenu(null)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {renderLabelKembali()}
          </button>
          <span className="text-xs font-semibold text-slate-700">{profile?.nama_lengkap}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-blue-900">Form Jurnal & Presensi Terpadu</h1>
          <p className="text-xs text-slate-500 mt-1">Isi materi pembelajaran dan perbarui status absensi siswa secara berkala.</p>
        </div>

        <form onSubmit={handleSubmitJurnal} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Pilih Kelas</label>
              <select 
                value={kelas} 
                onChange={(e) => setKelas(e.target.value)}
                disabled={loadingSimpan || currentRole === 'wali_kelas'}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs disabled:bg-slate-100 font-semibold"
              >
                {daftarKelas.map((namaKelas) => (
                  <option key={namaKelas} value={namaKelas}>{namaKelas}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mata Pelajaran / Agenda</label>
              <input 
                type="text" 
                value={mataPelajaran} 
                onChange={(e) => setMataPelajaran(e.target.value)}
                disabled={loadingSimpan || currentRole !== 'pembina_ekskul'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs disabled:bg-slate-100 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Jam Mulai</label>
                <select 
                  value={jamMulai} 
                  onChange={(e) => setJamMulai(e.target.value)}
                  disabled={loadingSimpan}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Jam Ke-{i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Jam Selesai</label>
                <select 
                  value={jamSelesai} 
                  onChange={(e) => setJamSelesai(e.target.value)}
                  disabled={loadingSimpan}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Jam Ke-{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Materi Pembelajaran / Uraian Kegiatan</label>
            <textarea 
              value={materi} 
              onChange={(e) => setMateri(e.target.value)}
              placeholder="Tulis ringkasan materi atau agenda kegiatan hari ini..."
              rows={3}
              disabled={loadingSimpan}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Catatan Kejadian Penting (Opsional)</label>
            <input 
              type="text" 
              value={catatan} 
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Pembelajaran kondusif, semua tugas dikumpulkan"
              disabled={loadingSimpan}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Presensi Siswa Kelas {kelas || '...'}</h2>

            {loadingSiswa && <p className="text-xs text-slate-500 animate-pulse">Mengambil data siswa...</p>}
            
            {!loadingSiswa && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium text-xs">
                      <th className="p-4">Nama Siswa</th>
                      <th className="p-4 text-center">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody ref={parentPresensi} className="divide-y divide-slate-100 text-xs">
                    {daftarSiswa.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-slate-400">Tidak ada data siswa untuk kelas ini.</td>
                      </tr>
                    ) : (
                      daftarSiswa.map((siswa) => (
                        <tr key={siswa.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-medium text-slate-800">{siswa.nama_siswa}</td>
                          <td className="p-4 flex justify-center gap-2">
                            {['Hadir', 'Sakit', 'Izin', 'Alpha'].map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={loadingSimpan}
                                onClick={() => handleStatusChange(siswa.id, status)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-semibold tracking-wide transition-all cursor-pointer ${
                                  presensi[siswa.id] === status
                                    ? status === 'Hadir' ? 'bg-green-600 text-white' :
                                      status === 'Sakit' ? 'bg-amber-500 text-white' :
                                      status === 'Izin' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loadingSimpan || daftarSiswa.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm cursor-pointer text-xs disabled:bg-slate-300"
          >
            {loadingSimpan ? 'Sedang Menyimpan Jurnal...' : 'Simpan Jurnal & Presensi'}
          </button>
        </form>
      </div>
    </div>
  );
}