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
  durasiJam: string;
  setDurasiJam: (val: string) => void;
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
  errorJadwal?: string;
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
  durasiJam,
  setDurasiJam,
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
  errorJadwal,
}: FormJurnalProps) {
  const profile = useAuthStore((s) => s.profile);
  const [parentPresensi] = useAutoAnimate();

  const renderLabelKembali = () => {
    if (currentRole === 'guru_mapel') return '⬅ Panel Guru Mapel';
    if (currentRole === 'wali_kelas') return '⬅ Panel Wali Kelas';
    if (currentRole === 'pembina_ekskul') return '⬅ Panel Ekstrakurikuler';
    return '⬅ Kembali';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefaef', color: '#1d1601' }}>
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" style={{ backgroundColor: '#fefaef' }}>

        <div className="mb-6 flex items-center justify-between border-b pb-4" style={{ borderColor: '#f4aa18' }}>
          <button
            type="button"
            onClick={() => setSubMenu(null)}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
          >
            {renderLabelKembali()}
          </button>
          <span className="text-sm font-semibold" style={{ color: '#1d1601' }}>{profile?.nama_lengkap}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold" style={{ color: '#1d1601' }}>Form Jurnal & Presensi Terpadu</h1>
          <p className="mt-1" style={{ color: '#1d1601', opacity: 0.7 }}>Isi materi pembelajaran dan perbarui status absensi siswa secara berkala.</p>
        </div>

        {errorJadwal && (
          <div className="mb-4 rounded-xl border p-4 text-sm font-semibold" style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}>
            ⚠ {errorJadwal}
          </div>
        )}

        <form onSubmit={handleSubmitJurnal} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1d1601' }}>Pilih Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                disabled={loadingSimpan || currentRole === 'wali_kelas'}
                className="w-full rounded-lg border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:bg-slate-100"
                style={{ borderColor: '#f4aa18', backgroundColor: '#fefaef', color: '#1d1601' }}
              >
                {daftarKelas.map((namaKelas) => (
                  <option key={namaKelas} value={namaKelas}>{namaKelas}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1d1601' }}>Mata Pelajaran / Agenda</label>
              <input
                type="text"
                value={mataPelajaran}
                onChange={(e) => setMataPelajaran(e.target.value)}
                disabled={loadingSimpan || currentRole !== 'pembina_ekskul'}
                className="w-full rounded-lg border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 disabled:bg-slate-100"
                style={{ borderColor: '#f4aa18', backgroundColor: '#fefaef', color: '#1d1601' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1d1601' }}>Jam Mulai Mengajar</label>
                <select
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  disabled={loadingSimpan}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#f4aa18', backgroundColor: '#fefaef', color: '#1d1601' }}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Jam Ke-{i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1d1601' }}>Durasi (Jam Pelajaran)</label>
                <select
                  value={durasiJam}
                  onChange={(e) => setDurasiJam(e.target.value)}
                  disabled={loadingSimpan}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#f4aa18', backgroundColor: '#fefaef', color: '#1d1601' }}
                >
                  {[...Array(6)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} Jam</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" style={{ color: '#1d1601' }}>Materi Pembelajaran / Uraian Kegiatan</label>
            <textarea
              value={materi}
              onChange={(e) => setMateri(e.target.value)}
              placeholder="Tulis ringkasan materi atau agenda kegiatan hari ini..."
              rows={3}
              disabled={loadingSimpan}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#f4aa18', backgroundColor: '#fefaef', color: '#1d1601' }}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" style={{ color: '#1d1601' }}>Catatan Kejadian Penting (Opsional)</label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Pembelajaran kondusif, semua tugas dikumpulkan"
              disabled={loadingSimpan}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#f4aa18', backgroundColor: '#fefaef', color: '#1d1601' }}
            />
          </div>

          <div className="border-t pt-6" style={{ borderColor: '#f4aa18' }}>
            <h2 className="mb-4 text-base font-semibold" style={{ color: '#1d1601' }}>Presensi Siswa Kelas {kelas || '...'}</h2>

            {loadingSiswa && <p className="animate-pulse text-sm" style={{ color: '#1d1601', opacity: 0.6 }}>Mengambil data siswa...</p>}

            {!loadingSiswa && (
              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#f4aa18', backgroundColor: '#fefaef' }}>
                <table className="w-full min-w-[400px] text-left border-collapse">
                  <thead>
                    <tr className="text-sm font-medium" style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}>
                      <th className="p-4">Nama Siswa</th>
                      <th className="p-4 text-center">Status Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody ref={parentPresensi} className="divide-y text-sm" style={{ color: '#1d1601' }}>
                    {daftarSiswa.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="p-8 text-center" style={{ color: '#1d1601', opacity: 0.5 }}>Tidak ada data siswa untuk kelas ini.</td>
                      </tr>
                    ) : (
                      daftarSiswa.map((siswa) => (
                        <tr key={siswa.id} className="hover:opacity-90">
                          <td className="p-4 font-medium" style={{ color: '#1d1601' }}>{siswa.nama_siswa}</td>
                          <td className="flex justify-center gap-2 p-4">
                            {['Hadir', 'Sakit', 'Izin', 'Alpha'].map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={loadingSimpan}
                                onClick={() => handleStatusChange(siswa.id, status)}
                                className={`cursor-pointer rounded-lg px-4 py-1.5 text-sm font-semibold tracking-wide transition-all ${
                                  presensi[siswa.id] === status
                                    ? status === 'Hadir' ? 'text-white' :
                                      status === 'Sakit' ? 'text-white' :
                                      status === 'Izin' ? 'text-white' : 'text-white'
                                    : 'text-slate-600 hover:bg-slate-200'
                                }`}
                                style={presensi[siswa.id] === status ? {
                                  backgroundColor: status === 'Hadir' ? '#8ff871' :
                                    status === 'Sakit' ? '#f4aa18' :
                                    status === 'Izin' ? '#f4aa18' : '#f4aa18',
                                  color: '#1d1601'
                                } : { backgroundColor: '#fefaef', color: '#1d1601' }}
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
            className="w-full cursor-pointer rounded-xl py-3 text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4bf666')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f4aa18')}
          >
            {loadingSimpan ? 'Sedang Menyimpan Jurnal...' : 'Simpan Jurnal & Presensi'}
          </button>
        </form>
      </div>
    </div>
  );
}