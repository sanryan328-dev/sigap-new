import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface Siswa {
  id: string;
  nama_siswa: string;
  nisn: string;
}

interface InputNilaiProps {
  setSubMenu: (menu: 'jurnal' | 'nilai' | null) => void;
  kelas: string;
  setKelas: (val: string) => void;
  mataPelajaran: string;
  daftarKelas: string[];
  daftarSiswa: Siswa[];
  handleSimpanNilai: (jenisPenilaian: string, nilaiSiswa: { [key: string]: number }) => void;
  loadingSiswa: boolean;
  loadingSimpan: boolean;
}

export default function InputNilai({
  setSubMenu,
  kelas,
  setKelas,
  mataPelajaran,
  daftarKelas,
  daftarSiswa,
  handleSimpanNilai,
  loadingSiswa,
  loadingSimpan,
}: InputNilaiProps) {
  const profile = useAuthStore((s) => s.profile);
  const [jenisPenilaian, setJenisPenilaian] = useState('');
  const [nilaiSiswa, setNilaiSiswa] = useState<{ [key: string]: number | undefined }>({});

  const handleNilaiChange = (siswaId: string, value: string) => {
    if (value === '') {
      const next = { ...nilaiSiswa };
      delete next[siswaId];
      setNilaiSiswa(next);
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setNilaiSiswa({ ...nilaiSiswa, [siswaId]: numValue });
    }
  };

  const onSubmitNilai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jenisPenilaian.trim()) {
      alert('Silakan isi nama jenis penilaian terlebih dahulu!');
      return;
    }
    const filledEntries = Object.entries(nilaiSiswa).filter(
      ([_, val]) => val !== undefined && val !== null,
    );
    if (filledEntries.length === 0) {
      alert('Minimal isi satu nilai siswa untuk disimpan.');
      return;
    }
    handleSimpanNilai(jenisPenilaian, nilaiSiswa as Record<string, number>);
    setNilaiSiswa({});
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        {/* Header Navigasi */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSubMenu(null)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            ⬅️ Panel Guru Mapel
          </button>
          <span className="text-sm font-semibold text-slate-700">{profile?.nama_lengkap}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold text-blue-900">Lembar Input Penilaian Siswa</h1>
          <p className="text-sm text-slate-500 mt-1">
            Masukkan nilai perorangan siswa untuk mata pelajaran <strong className="text-slate-700">{mataPelajaran}</strong>.
          </p>
        </div>

        <form onSubmit={onSubmitNilai} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas Penilaian</label>
              <select 
                value={kelas} 
                onChange={(e) => setKelas(e.target.value)}
                disabled={loadingSimpan}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-white"
              >
                {daftarKelas.map((namaKelas) => (
                  <option key={namaKelas} value={namaKelas}>{namaKelas}</option>
                ))}
              </select>
            </div>

            {/* 🌟 PERBAIKAN: Berubah dari <select> menjadi <input type="text"> ketik bebas */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama / Jenis Penilaian</label>
              <input
                type="text"
                value={jenisPenilaian}
                onChange={(e) => setJenisPenilaian(e.target.value)}
                disabled={loadingSimpan}
                placeholder="Contoh: UH 1, Tugas Kelompok, Remedi Bab 2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-white"
                required
              />
            </div>
          </div>

          {/* Tabel Input Nilai Siswa */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Input Angka Nilai - Kelas {kelas}</h2>
            {loadingSiswa && <p className="text-sm text-slate-500 animate-pulse">Mengambil data siswa...</p>}

            {!loadingSiswa && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium text-sm">
                      <th className="p-4 w-2/3">Nama Siswa</th>
                      <th className="p-4 w-1/3 text-center">Nilai (Skala 0 - 100)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {daftarSiswa.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-slate-400">Tidak ada data siswa.</td>
                      </tr>
                    ) : (
                      daftarSiswa.map((siswa) => (
                        <tr key={siswa.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-medium text-slate-800">{siswa.nama_siswa}</td>
                          <td className="p-4 flex justify-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              placeholder="0"
                              disabled={loadingSimpan}
                              value={nilaiSiswa[siswa.id] !== undefined ? nilaiSiswa[siswa.id] : ''}
                              onChange={(e) => handleNilaiChange(siswa.id, e.target.value)}
                              className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm cursor-pointer text-sm disabled:bg-slate-300"
          >
            {loadingSimpan ? 'Sedang Menyimpan Nilai...' : `Simpan Rekap Penilaian`}
          </button>
        </form>
      </div>
    </div>
  );
}