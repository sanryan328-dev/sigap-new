import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';
import { useAuthStore, selectUserId } from '../store/useAuthStore';

interface GuruBKDashboardProps {
  handleLogout?: () => void;
  daftarKelas: string[];
}

export default function GuruBKDashboard({ handleLogout: handleLogoutProp, daftarKelas }: GuruBKDashboardProps) {
  const profile = useAuthStore((s) => s.profile);
  const userId = useAuthStore(selectUserId);
  const storeLogout = useAuthStore((s) => s.logout);
  const handleLogout = handleLogoutProp ?? storeLogout;
  const [subMenuBK, setSubMenuBK] = useState<'kelola_kasus' | 'rekap_kasus' | null>(null);
  const [loading, setLoading] = useState(false);

  // Data Master dari Database
  const [listSiswa, setListSiswa] = useState<any[]>([]);
  const [listMasterPelanggaran, setListMasterPelanggaran] = useState<any[]>([]);
  const [listKasus, setListKasus] = useState<any[]>([]);
  
  // State Filter Rombel Siswa pada Form Input
  const [filterKelasInput, setFilterKelasInput] = useState<string>('');

  // State Filter Rombel Siswa pada Halaman Rekap
  const [filterKelasRekap, setFilterKelasRekap] = useState<string>('');

  // State Form Input Kasus
  const [formKasus, setFormKasus] = useState({
    id: '',
    student_id: '',
    kelas: '',
    kategori_kasus: '', // Filter Utama Kasus
    jenis_kasus: '',    // Id/Nama Kasus terpilih
    bobot_pelanggaran: 0, // Otomatis dari master_pelanggarans
    detail_kasus: '',
    tindakan_penanganan: '',
    status: 'Sedang Dibina'
  });
  const [isEditKasus, setIsEditKasus] = useState(false);

  useEffect(() => {
    fetchSiswa();
    fetchMasterPelanggaran();
    fetchKasusBK();
  }, [subMenuBK]);

  // ==========================================
  // 📥 FETCH DATA GURU BK & MASTER DATA
  // ==========================================
  const fetchSiswa = async () => {
    const { data } = await supabase
      .from('students')
      .select('id, nama_siswa, kelas')
      .order('nama_siswa', { ascending: true });
    if (data) setListSiswa(data);
  };

  const fetchMasterPelanggaran = async () => {
    const { data } = await supabase
      .from('master_pelanggarans')
      .select('id, kategori, jenis_kasus, bobot')
      .order('jenis_kasus', { ascending: true });
    if (data) setListMasterPelanggaran(data);
  };

 const fetchKasusBK = async () => {
    setLoading(true);
    try {
      // 1. Tarik semua data dari tabel bk_records
      const { data: recordsData, error: recordsError } = await supabase
        .from('bk_records')
        .select('id, user_id, student_id, kelas, kategori_kasus, detail_kasus, tindakan_penanganan, status, created_at');

      if (recordsError) throw recordsError;

      // 2. Tarik semua data dari tabel students untuk pencocokan nama & nisn
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, nama_siswa, nisn');

      if (studentsError) throw studentsError;

      // 3. Gabungkan kedua data secara manual berdasarkan id siswa
      if (recordsData && studentsData) {
        const cleanData = recordsData.map((kasus: any) => {
          // Gunakan toString() agar perbandingan int vs string tidak gagal
          const matchStudent = studentsData.find((s: any) => s.id.toString() === kasus.student_id?.toString());
          
          return {
            ...kasus,
            pengenal: kasus.id,
            students: matchStudent ? {
              nama_siswa: matchStudent.nama_siswa,
              nisn: matchStudent.nisn
            } : {
              nama_siswa: 'Siswa Tidak Ditemukan',
              nisn: '-'
            }
          };
        });
        setListKasus(cleanData);
      }
    } catch (err: any) {
      console.error("Gagal menarik data kasus BK:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ⚡ HANDLER ATRIBUT DINAMIS FORM INPUT
  // ==========================================
  const handlePilihSiswa = (studentId: string) => {
    const siswaTerpilih = listSiswa.find(s => s.id.toString() === studentId);
    setFormKasus(prev => ({ 
      ...prev, 
      student_id: studentId, 
      kelas: siswaTerpilih ? siswaTerpilih.kelas : '' 
    }));
  };

  const handlePilihJenisKasus = (jenisKasusText: string) => {
    const pelanggaranTerpilih = listMasterPelanggaran.find(p => p.jenis_kasus === jenisKasusText);
    setFormKasus(prev => ({
      ...prev,
      jenis_kasus: jenisKasusText,
      bobot_pelanggaran: pelanggaranTerpilih ? pelanggaranTerpilih.bobot : 0
    }));
  };

  const handleSimpanKasus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      user_id: parseInt(userId),
      student_id: parseInt(formKasus.student_id),
      kelas: formKasus.kelas,
      kategori_kasus: formKasus.kategori_kasus,
      detail_kasus: `[Jenis: ${formKasus.jenis_kasus}] [Bobot Poin: ${formKasus.bobot_pelanggaran}] ${formKasus.detail_kasus}`, 
      tindakan_penanganan: formKasus.tindakan_penanganan,
      status: formKasus.status,
      updated_at: new Date().toISOString()
    };

    try {
      if (isEditKasus) {
        const { error } = await supabase
          .from('bk_records')
          .update(payload)
          .eq('id', formKasus.id);
        if (error) throw error;
        toast.success('Catatan pembinaan berhasil diperbarui!');
      } else {
        const { error } = await supabase
          .from('bk_records')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
        toast.success('Kasus baru berhasil dicatat!');
      }

      setFormKasus({ id: '', student_id: '', kelas: '', kategori_kasus: '', jenis_kasus: '', bobot_pelanggaran: 0, detail_kasus: '', tindakan_penanganan: '', status: 'Sedang Dibina' });
      setIsEditKasus(false);
      setFilterKelasInput('');
      fetchKasusBK();
    } catch (err: any) {
      toast.error(`Gagal menyimpan catatan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleHapusKasus = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan pembinaan ini secara permanen?')) {
      setLoading(true);
      await supabase.from('bk_records').delete().eq('id', id);
      toast.success('Catatan pembinaan berhasil dihapus.');
      fetchKasusBK();
    }
  };

  const totalKasus = listKasus.length;

  // Hitung siswa UNIK yang masih aktif dibina (bukan jumlah baris kasus)
  const siswaAktifIds = new Set(
    listKasus
      .filter(k => k.status === 'Sedang Dibina')
      .map(k => k.student_id?.toString())
  );
  const kasusAktif = siswaAktifIds.size;

  // Filter Siswa Berdasarkan Kelas Pilihan di Form Input
  const siswaTerfilterInput = filterKelasInput 
    ? listSiswa.filter(s => s.kelas === filterKelasInput)
    : [];

  // Filter Jenis Kasus Berdasarkan Pilihan Kategori (Untuk Keperluan Kenyamanan Mobile)
  const masterPelanggaranTerfilter = formKasus.kategori_kasus
    ? listMasterPelanggaran.filter(p => p.kategori.toLowerCase() === formKasus.kategori_kasus.toLowerCase())
    : [];

  // Filter Data Halaman Rekap Kasus
  const kasusTerfilterRekap = filterKelasRekap 
    ? listKasus.filter(k => k.kelas === filterKelasRekap)
    : listKasus;

  // ==========================================
  // 📋 TAMPILAN SUB-MENU 1: KELOLA KASUS (INPUT FORM)
  // ==========================================
  if (subMenuBK === 'kelola_kasus') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center w-full">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                BK SPENSAWA
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1.5">{isEditKasus ? '✏️ Edit Pembinaan' : '➕ Input Kasus Baru'}</h2>
            </div>
            <button 
              onClick={() => {
                setSubMenuBK(null);
                setIsEditKasus(false);
                setFormKasus({ id: '', student_id: '', kelas: '', kategori_kasus: '', jenis_kasus: '', bobot_pelanggaran: 0, detail_kasus: '', tindakan_penanganan: '', status: 'Sedang Dibina' });
                setFilterKelasInput('');
              }}
              className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
            >
              ⬅️ Kembali
            </button>
          </div>

          <form onSubmit={handleSimpanKasus} className="space-y-4">
            
            {/* FILTER KELAS DAN PILIH SISWA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">1. Pilih Kelas / Rombel Siswa</label>
                <select 
                  value={filterKelasInput}
                  onChange={(e) => {
                    setFilterKelasInput(e.target.value);
                    setFormKasus(prev => ({ ...prev, student_id: '', kelas: '' }));
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white focus:border-purple-500" required
                >
                  <option value="">-- Pilih Kelas --</option>
                  {daftarKelas.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">2. Pilih Nama Siswa Terfilter</label>
                <select 
                  value={formKasus.student_id} 
                  onChange={(e) => handlePilihSiswa(e.target.value)} 
                  disabled={!filterKelasInput}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white disabled:bg-slate-100 font-medium" required
                >
                  <option value="">{filterKelasInput ? `-- Pilih Nama (${siswaTerfilterInput.length} Siswa) --` : '-- Pilih Kelas Dahulu --'}</option>
                  {siswaTerfilterInput.map((s) => (
                    <option key={s.id} value={s.id}>{s.nama_siswa}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILTER TINGKAT KASUS (MEMUDAHKAN PENGGUNA HP) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">1. Filter Kategori Pelanggaran</label>
                <select 
                  value={formKasus.kategori_kasus} 
                  onChange={(e) => {
                    setFormKasus(prev => ({ ...prev, kategori_kasus: e.target.value, jenis_kasus: '', bobot_pelanggaran: 0 }));
                  }} 
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white font-medium border-purple-200" required
                >
                  <option value="">-- Pilih Kategori --</option>
                  <option value="ringan">Ringan</option>
                  <option value="sedang">Sedang</option>
                  <option value="berat">Berat</option>
                  <option value="sangat berat">Sangat Berat / Kriminal</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">2. Pilihan Kasus Spesifik (Terfilter)</label>
                <select 
                  value={formKasus.jenis_kasus} 
                  onChange={(e) => handlePilihJenisKasus(e.target.value)} 
                  disabled={!formKasus.kategori_kasus}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white disabled:bg-slate-100 font-medium truncate" required
                >
                  <option value="">{formKasus.kategori_kasus ? `-- Pilih Kasus (${masterPelanggaranTerfilter.length}) --` : '-- Pilih Kategori Dahulu --'}</option>
                  {masterPelanggaranTerfilter.map((p) => (
                    <option key={p.id} value={p.jenis_kasus}>
                      {p.jenis_kasus}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FIELD BOBOT OTOMATIS */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Bobot Pelanggaran (Otomatis Poin dari Database)</label>
              <input 
                type="text" 
                value={formKasus.bobot_pelanggaran ? `${formKasus.bobot_pelanggaran} Poin` : '0 Poin'}
                disabled
                className="w-full p-2.5 border border-slate-200 bg-slate-50 text-red-600 font-mono font-bold rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Kronologi / Catatan Keterangan Tambahan</label>
              <textarea 
                value={formKasus.detail_kasus} 
                onChange={(e) => setFormKasus({ ...formKasus, detail_kasus: e.target.value })} 
                className="w-full p-2 border border-slate-300 rounded-lg text-xs h-16 bg-white resize-none" required 
                placeholder="Tulis kronologi kejadian..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Tindakan Penanganan / Rencana Tindak Lanjut</label>
              <textarea 
                value={formKasus.tindakan_penanganan} 
                onChange={(e) => setFormKasus({ ...formKasus, tindakan_penanganan: e.target.value })} 
                className="w-full p-2 border border-slate-300 rounded-lg text-xs h-16 bg-white resize-none" required 
                placeholder="Rencana tindak lanjut bimbingan..."
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <label className="block text-[10px] font-semibold text-slate-600">Status:</label>
                <select 
                  value={formKasus.status} 
                  onChange={(e) => setFormKasus({ ...formKasus, status: e.target.value })} 
                  className="p-1 border border-slate-300 rounded text-xs bg-white font-semibold"
                >
                  <option value="Sedang Dibina">⚠️ Sedang Dibina</option>
                  <option value="Tuntas">✅ Tuntas</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                  {isEditKasus ? 'Simpan Perubahan' : 'Catat Log Kasus'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // 📊 TAMPILAN SUB-MENU 2: REKAP KASUS + TINDAK LANJUT INTERVENSI
  // ==========================================
  if (subMenuBK === 'rekap_kasus') {

    // --- Helper: ekstrak poin dari format "[Bobot Poin: N]" ---
    const ekstrakPoin = (detail: string): number => {
      const match = detail?.match(/\[Bobot Poin:\s*(\d+)\]/);
      return match ? parseInt(match[1]) : 0;
    };

    // --- Group kasus per student_id ---
    const grouped: Record<string, { siswa: any; kasus: any[] }> = {};
    kasusTerfilterRekap.forEach((kasus) => {
      const key = kasus.student_id?.toString() || kasus.id;
      if (!grouped[key]) grouped[key] = { siswa: kasus, kasus: [] };
      grouped[key].kasus.push(kasus);
    });
    const groupedList = Object.values(grouped);

    // --- Komponen Panel Tindak Lanjut (per siswa, inline) ---
    const PanelTindakLanjut = ({ kasusIds, namaSiswa }: { studentId: string; kasusIds: string[]; namaSiswa: string }) => {
      const [sesiList, setSesiList] = React.useState<any[]>([]);
      const [loadingSesi, setLoadingSesi] = React.useState(true);
      const [showForm, setShowForm] = React.useState(false);
      const [loadingSimp, setLoadingSimp] = React.useState(false);
      const [formSesi, setFormSesi] = React.useState({
        bk_record_id: kasusIds[0] || '',
        catatan_sesi: '',
        tindak_lanjut: '',
        status: 'Dalam Proses',
      });

      // Fetch sesi tindak lanjut untuk semua kasus milik siswa ini
      React.useEffect(() => {
        const fetchSesi = async () => {
          setLoadingSesi(true);
          try {
            const { data } = await supabase
              .from('bk_sesi_lanjutan')
              .select('*')
              .in('bk_record_id', kasusIds.map(Number))
              .order('created_at', { ascending: false });
            setSesiList(data || []);
          } catch (err) { console.error(err); }
          finally { setLoadingSesi(false); }
        };
        fetchSesi();
      }, [kasusIds.join(',')]);

      const handleSimpanSesi = async () => {
        if (!formSesi.catatan_sesi.trim() || !formSesi.tindak_lanjut.trim()) {
          toast.error('Catatan sesi dan rencana tindak lanjut wajib diisi.');
          return;
        }
        setLoadingSimp(true);
        try {
          const { data: baru, error } = await supabase
            .from('bk_sesi_lanjutan')
            .insert([{
              bk_record_id: parseInt(formSesi.bk_record_id),
              catatan_sesi: formSesi.catatan_sesi,
              tindak_lanjut: formSesi.tindak_lanjut,
              status: formSesi.status,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }])
            .select()
            .single();
          if (error) throw error;
          setSesiList(prev => [baru, ...prev]);
          setFormSesi({ bk_record_id: kasusIds[0] || '', catatan_sesi: '', tindak_lanjut: '', status: 'Dalam Proses' });
          setShowForm(false);
        } catch (err: any) {
          toast.error('Gagal menyimpan sesi: ' + err.message);
        } finally { setLoadingSimp(false); }
      };

      const handleHapusSesi = async (id: string) => {
        if (!window.confirm('Hapus catatan sesi intervensi ini?')) return;
        await supabase.from('bk_sesi_lanjutan').delete().eq('id', id);
        setSesiList(prev => prev.filter(s => s.id.toString() !== id.toString()));
      };

      const statusColor = (s: string) => {
        if (s === 'Membaik') return 'bg-emerald-100 text-emerald-700';
        if (s === 'Tuntas') return 'bg-blue-100 text-blue-700';
        if (s === 'Tidak Ada Perubahan') return 'bg-red-100 text-red-600';
        return 'bg-amber-100 text-amber-700'; // Dalam Proses
      };

      return (
        <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/40 overflow-hidden">
          {/* Header panel tindak lanjut */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-50 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎯</span>
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">
                Tindak Lanjut Intervensi BK
              </span>
              {!loadingSesi && (
                <span className="text-[10px] bg-indigo-100 text-indigo-600 font-semibold px-1.5 py-0.5 rounded-full">
                  {sesiList.length} sesi
                </span>
              )}
            </div>
            <button
              onClick={() => setShowForm(v => !v)}
              className="flex items-center gap-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {showForm ? '✕ Batal' : '＋ Tambah Sesi'}
            </button>
          </div>

          {/* Form input sesi baru */}
          {showForm && (
            <div className="p-4 bg-white border-b border-indigo-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pilih kasus yang ditindaklanjuti */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Terkait Kasus ke-</label>
                  <select
                    value={formSesi.bk_record_id}
                    onChange={e => setFormSesi(p => ({ ...p, bk_record_id: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {kasusIds.map((id, idx) => (
                      <option key={id} value={id}>Kasus #{idx + 1} (ID: {id})</option>
                    ))}
                  </select>
                </div>
                {/* Status perkembangan */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Status Perkembangan Siswa</label>
                  <select
                    value={formSesi.status}
                    onChange={e => setFormSesi(p => ({ ...p, status: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white font-semibold"
                  >
                    <option value="Dalam Proses">🔄 Dalam Proses</option>
                    <option value="Membaik">📈 Membaik</option>
                    <option value="Tidak Ada Perubahan">⚠️ Tidak Ada Perubahan</option>
                    <option value="Tuntas">✅ Tuntas / Selesai</option>
                  </select>
                </div>
              </div>

              {/* Catatan sesi */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Catatan Sesi Intervensi <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formSesi.catatan_sesi}
                  onChange={e => setFormSesi(p => ({ ...p, catatan_sesi: e.target.value }))}
                  placeholder={`Tuliskan hasil observasi, percakapan, atau perkembangan perilaku ${namaSiswa} pada sesi ini...`}
                  rows={3}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Rencana tindak lanjut */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Rencana / Target Tindak Lanjut Berikutnya <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formSesi.tindak_lanjut}
                  onChange={e => setFormSesi(p => ({ ...p, tindak_lanjut: e.target.value }))}
                  placeholder="Contoh: Panggil orang tua minggu depan. Jadwalkan konseling individu. Koordinasi dengan wali kelas..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSimpanSesi}
                  disabled={loadingSimp}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer transition-colors disabled:bg-slate-300"
                >
                  {loadingSimp ? 'Menyimpan...' : '💾 Simpan Catatan Sesi'}
                </button>
              </div>
            </div>
          )}

          {/* Timeline sesi intervensi */}
          <div className="p-4">
            {loadingSesi ? (
              <p className="text-[11px] text-indigo-400 animate-pulse text-center py-2">Memuat riwayat sesi...</p>
            ) : sesiList.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-3 italic">
                Belum ada sesi intervensi yang dicatat. Klik <strong>＋ Tambah Sesi</strong> untuk mulai mendokumentasikan.
              </p>
            ) : (
              <div className="relative space-y-3 pl-5">
                {/* Garis timeline vertikal */}
                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-indigo-200" />

                {sesiList.map((sesi, idx) => (
                  <div key={sesi.id} className="relative">
                    {/* Titik timeline */}
                    <div className={`absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                      sesi.status === 'Tuntas' ? 'bg-blue-500' :
                      sesi.status === 'Membaik' ? 'bg-emerald-500' :
                      sesi.status === 'Tidak Ada Perubahan' ? 'bg-red-400' : 'bg-amber-400'
                    }`} />

                    <div className="bg-white rounded-lg border border-indigo-100 p-3 shadow-sm">
                      {/* Header sesi */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-slate-400">
                            Sesi {sesiList.length - idx} &bull; {new Date(sesi.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(sesi.status)}`}>
                            {sesi.status}
                          </span>
                          <span className="text-[10px] text-slate-300">Kasus ID: {sesi.bk_record_id}</span>
                        </div>
                        <button
                          onClick={() => handleHapusSesi(sesi.id.toString())}
                          className="text-[10px] text-red-400 hover:text-red-600 cursor-pointer flex-shrink-0 font-semibold"
                        >
                          Hapus
                        </button>
                      </div>

                      {/* Catatan sesi */}
                      <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                        📋 {sesi.catatan_sesi}
                      </p>

                      {/* Rencana tindak lanjut */}
                      <div className="bg-indigo-50 rounded-lg px-3 py-2 border-l-2 border-indigo-300">
                        <p className="text-[10px] font-bold text-indigo-600 mb-0.5">🎯 Target Tindak Lanjut</p>
                        <p className="text-[11px] text-indigo-800 leading-relaxed">{sesi.tindak_lanjut}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center w-full">
        <div className="w-full max-w-5xl space-y-4">

          {/* Header kartu */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Rekapitulasi Data
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-800 mt-1">Buku Kendali Bimbingan Konseling</h2>
              </div>
              <button
                onClick={() => { setSubMenuBK(null); setFilterKelasRekap(''); }}
                className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
              >
                ⬅️ Kembali
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 w-fit">
              <label className="text-xs font-bold text-slate-700">Filter Kelas:</label>
              <select
                value={filterKelasRekap}
                onChange={(e) => setFilterKelasRekap(e.target.value)}
                className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium"
              >
                <option value="">-- Semua Kelas --</option>
                {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>

          {/* ── Grafik Visualisasi Data ── */}
          {groupedList.length > 0 && (() => {
            const KATEGORI_WARNA = [
              { key: 'ringan', label: 'Ringan', color: '#10B981' },
              { key: 'sedang', label: 'Sedang', color: '#F59E0B' },
              { key: 'berat', label: 'Berat', color: '#EF4444' },
              { key: 'sangat berat', label: 'Sangat Berat', color: '#E11D48' },
            ];

            const dataKategori = KATEGORI_WARNA.map(k => ({
              name: k.label,
              value: kasusTerfilterRekap.filter(
                ksr => ksr.kategori_kasus?.toLowerCase() === k.key
              ).length,
              color: k.color,
            })).filter(d => d.value > 0);

            const top5Siswa = Object.values(grouped)
              .map((g: any) => ({
                nama: g.siswa.students?.nama_siswa || 'Siswa',
                poin: g.kasus.reduce((sum: number, k: any) => sum + ekstrakPoin(k.detail_kasus), 0),
              }))
              .sort((a, b) => b.poin - a.poin)
              .slice(0, 5);

            return (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* PieChart — Kasus per Kategori */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body gap-3">
                    <h3 className="card-title text-sm">Kasus per Kategori</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={dataKategori}
                          cx="50%" cy="50%"
                          innerRadius={52}
                          outerRadius={88}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {dataKategori.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                        />
                        <Legend
                          iconType="circle"
                          formatter={(value) => (
                            <span className="text-xs text-base-content/70">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* BarChart — Top 5 Siswa Poin Tertinggi */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body gap-3">
                    <h3 className="card-title text-sm">Top 5 Akumulasi Poin</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={top5Siswa} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="nama"
                          tick={{ fontSize: 10, fill: '#64748b' }}
                          interval={0}
                          angle={-12}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                        />
                        <Bar dataKey="poin" radius={[4, 4, 0, 0]}>
                          {top5Siswa.map((_, i) => (
                            <Cell
                              key={i}
                              fill={['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'][i]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Daftar kartu per siswa */}
          {groupedList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-sm">
              Tidak ditemukan rekaman kasus pembinaan BK.
            </div>
          ) : (
            groupedList.map(({ siswa, kasus: kasusArr }) => {
              const totalPoin = kasusArr.reduce((sum, k) => sum + ekstrakPoin(k.detail_kasus), 0);
              const adaAktif = kasusArr.some(k => k.status !== 'Tuntas');
              const kasusIds = kasusArr.map((k: any) => k.id?.toString());

              return (
                <div key={siswa.student_id?.toString()} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${adaAktif ? 'border-amber-200' : 'border-emerald-200'}`}>

                  {/* ── Header Siswa ── */}
                  <div className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 ${adaAktif ? 'bg-amber-50/50' : 'bg-emerald-50/50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${adaAktif ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {siswa.students?.nama_siswa?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm leading-tight">{siswa.students?.nama_siswa}</div>
                        <div className="text-[10px] text-slate-400">{siswa.kelas} &bull; NISN: {siswa.students?.nisn}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Total poin */}
                      <div className="text-center">
                        <div className={`text-xl font-black leading-none ${totalPoin >= 100 ? 'text-red-600' : totalPoin >= 50 ? 'text-amber-500' : 'text-slate-700'}`}>
                          {totalPoin}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wide">poin</div>
                      </div>
                      {/* Badge status */}
                      {adaAktif
                        ? <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 animate-pulse whitespace-nowrap">⚠️ Sedang Dibina</span>
                        : <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">✅ Tuntas</span>
                      }
                    </div>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* ── Rincian Kasus ── */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Rincian Pelanggaran ({kasusArr.length} kasus)</p>
                      <div className="space-y-2">
                        {kasusArr.map((k: any, idx: number) => {
                          const poinKasus = ekstrakPoin(k.detail_kasus);
                          const detailBersih = k.detail_kasus
                            ?.replace(/\[Jenis:[^\]]*\]/g, '')
                            .replace(/\[Bobot Poin:[^\]]*\]/g, '')
                            .trim();

                          return (
                            <div key={k.id} className="flex gap-2.5 items-start bg-slate-50 rounded-lg p-2.5">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-300 text-slate-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    k.kategori_kasus?.toLowerCase() === 'sangat berat' || k.kategori_kasus?.toLowerCase() === 'berat'
                                      ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                  }`}>{k.kategori_kasus?.toUpperCase()}</span>
                                  <span className="text-[10px] font-mono font-bold text-red-500">+{poinKasus} poin</span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(k.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}
                                  </span>
                                </div>
                                {detailBersih && <p className="text-[11px] text-slate-600 leading-snug">{detailBersih}</p>}
                                <p className="text-[10px] text-slate-400 italic mt-0.5">Tindakan: {k.tindakan_penanganan}</p>
                                <div className="flex gap-1 mt-1.5">
                                  <button onClick={() => {
                                    setFormKasus({ id: k.id, student_id: k.student_id?.toString(), kelas: k.kelas, kategori_kasus: k.kategori_kasus, jenis_kasus: '', bobot_pelanggaran: poinKasus, detail_kasus: detailBersih, tindakan_penanganan: k.tindakan_penanganan, status: k.status });
                                    setIsEditKasus(true);
                                    setFilterKelasInput(k.kelas);
                                    setSubMenuBK('kelola_kasus');
                                  }} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-semibold cursor-pointer">Edit</button>
                                  <button onClick={() => handleHapusKasus(k.id)} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-semibold cursor-pointer">Hapus</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Panel Tindak Lanjut Intervensi ── */}
                    <PanelTindakLanjut
                      studentId={siswa.student_id?.toString()}
                      kasusIds={kasusIds}
                      namaSiswa={siswa.students?.nama_siswa || 'Siswa'}
                    />
                  </div>
                </div>
              );
            })
          )}

          {/* Footer ringkasan */}
          {groupedList.length > 0 && (
            <div className="flex gap-4 text-xs text-slate-500 px-1 pb-2">
              <span>Total siswa: <strong className="text-slate-700">{groupedList.length}</strong></span>
              <span>Total kasus: <strong className="text-slate-700">{kasusTerfilterRekap.length}</strong></span>
              <span>Masih dibina: <strong className="text-amber-600">{groupedList.filter(g => g.kasus.some((k: any) => k.status !== 'Tuntas')).length}</strong></span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 📊 MENU UTAMA DASHBOARD GURU BK
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        
        <div className="flex justify-between items-start border-b border-slate-100 pb-5 mb-6">
          <div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Panel Bimbingan Konseling (BK)
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-1.5">{profile?.nama_lengkap}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kasus Aktif: <strong className="text-amber-600">{kasusAktif} Siswa</strong> | Total: {totalKasus} Kasus Log
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
          >
            🚪 Keluar
          </button>
        </div>

        {/* Grid Pilihan Menu Utama Layout Serasi Guru Mapel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setSubMenuBK('kelola_kasus')}
            className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="text-xl mb-2 p-2 bg-purple-50 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">📝</div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-purple-600">Catat Kasus Baru</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Input insiden indisipliner kerentanan belajar dengan integrasi bobot poin dinamis terfilter per kategori.
            </p>
          </button>

          <button
            onClick={() => setSubMenuBK('rekap_kasus')}
            className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="text-xl mb-2 p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">📊</div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600">Buku Rekap & Filter</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Lihat riwayat pembinaan historis seluruh siswa, urutkan per rombel kelas untuk rapat pleno kenaikan.
            </p>
          </button>
        </div>

        <div className="mt-6 bg-slate-50 border border-slate-200/60 p-3.5 rounded-xl text-[11px] text-slate-500 leading-relaxed">
          🔒 <strong>Proteksi Hak Akses Privasi:</strong> Seluruh berkas rekam jejak bimbingan konseling dienkripsi secara server-side dan tidak dapat diakses di luar otorisasi Guru BK dan Admin Sekolah.
        </div>

      </div>
    </div>
  );
}