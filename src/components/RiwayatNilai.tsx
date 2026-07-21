import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { Pencil, Trash2, X, Search } from 'lucide-react';

interface StudentScore {
  id: number;
  user_id: number;
  student_id: number;
  kelas: string;
  mapel: string;
  jenis_penilaian: string;
  nilai: number;
  created_at: string | null;
  updated_at: string | null;
  student_name?: string;
  student_nisn?: string;
}

interface RiwayatNilaiProps {
  setSubMenu: (menu: 'jurnal' | 'nilai' | 'riwayat-nilai' | null) => void;
  kelas: string;
  mataPelajaran: string;
}

export default function RiwayatNilai({
  setSubMenu,
  kelas,
  mataPelajaran,
}: RiwayatNilaiProps) {
  const profile = useAuthStore((s) => s.profile);
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterKelas, setFilterKelas] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [searchText, setSearchText] = useState('');

  const [editItem, setEditItem] = useState<StudentScore | null>(null);
  const [editNilai, setEditNilai] = useState('');
  const [editJenis, setEditJenis] = useState('');
  const [saving, setSaving] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchScores = useCallback(async () => {
    if (!profile?.user_id) return;
    setLoading(true);
    try {
      const rawUserId = profile.user_id;
      const userIdNum = typeof rawUserId === 'string' ? parseInt(rawUserId) : rawUserId;
      if (!userIdNum) return;

      const { data: scoreData, error } = await supabase
        .from('student_scores')
        .select('*')
        .eq('user_id', userIdNum)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!scoreData) { setScores([]); return; }

      const studentIds = [...new Set(scoreData.map((s: any) => s.student_id))];
      const { data: studentData } = await supabase
        .from('students')
        .select('id, nama_siswa, nisn')
        .in('id', studentIds);

      const studentMap = new Map<number, { nama_siswa: string; nisn: string }>();
      if (studentData) {
        studentData.forEach((s: any) => {
          studentMap.set(s.id, { nama_siswa: s.nama_siswa, nisn: s.nisn });
        });
      }

      const merged: StudentScore[] = scoreData.map((s: any) => {
        const info = studentMap.get(s.student_id);
        return {
          id: s.id,
          user_id: s.user_id,
          student_id: s.student_id,
          kelas: s.kelas,
          mapel: s.mapel,
          jenis_penilaian: s.jenis_penilaian,
          nilai: s.nilai,
          created_at: s.created_at,
          updated_at: s.updated_at,
          student_name: info?.nama_siswa || `(id: ${s.student_id})`,
          student_nisn: info?.nisn || '',
        };
      });
      setScores(merged);
    } catch (err: any) {
      toast.error('Gagal memuat riwayat nilai: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [profile?.user_id]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const uniqueKelas = [...new Set(scores.map((s) => s.kelas))].sort();
  const uniqueJenis = [...new Set(scores.map((s) => s.jenis_penilaian))].sort();

  const filtered = scores.filter((s) => {
    if (filterKelas && s.kelas !== filterKelas) return false;
    if (filterJenis && s.jenis_penilaian !== filterJenis) return false;
    if (searchText) {
      const q = searchText.toLowerCase();
      const namaMatch = s.student_name?.toLowerCase().includes(q);
      const nisnMatch = s.student_nisn?.toLowerCase().includes(q);
      if (!namaMatch && !nisnMatch) return false;
    }
    return true;
  });

  const openEdit = (item: StudentScore) => {
    setEditItem(item);
    setEditNilai(String(item.nilai));
    setEditJenis(item.jenis_penilaian);
    modalRef.current?.showModal();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    const nilaiNum = parseFloat(editNilai);
    if (isNaN(nilaiNum) || nilaiNum < 0 || nilaiNum > 100) {
      toast.error('Nilai harus antara 0–100');
      return;
    }
    if (!editJenis.trim()) {
      toast.error('Jenis penilaian tidak boleh kosong');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('student_scores')
        .update({
          nilai: nilaiNum,
          jenis_penilaian: editJenis.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', editItem.id);
      if (error) throw error;
      toast.success('Nilai berhasil diperbarui!');
      modalRef.current?.close();
      setEditItem(null);
      fetchScores();
    } catch (err: any) {
      toast.error('Gagal memperbarui: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteTarget(id);
    confirmRef.current?.showModal();
  };

  const execDelete = async () => {
    if (deleteTarget === null) return;
    try {
      const { error } = await supabase
        .from('student_scores')
        .delete()
        .eq('id', deleteTarget);
      if (error) throw error;
      toast.success('Nilai berhasil dihapus.');
      confirmRef.current?.close();
      setDeleteTarget(null);
      fetchScores();
    } catch (err: any) {
      toast.error('Gagal menghapus: ' + err.message);
    }
  };

  const safeDate = (d: string | null | undefined) => {
    if (!d) return '-';
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return '-';
      return dt.toLocaleDateString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 flex flex-col items-center"
      style={{ backgroundColor: '#fefaef' }}
    >
      <div
        className="w-full max-w-6xl rounded-2xl p-6 sm:p-8 border"
        style={{
          backgroundColor: '#fefaef',
          borderColor: '#f4aa18',
          color: '#1d1601',
        }}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b" style={{ borderColor: '#f4aa18' }}>
          <div>
            <button
              onClick={() => setSubMenu(null)}
              className="text-sm font-semibold px-3 py-1.5 rounded-lg cursor-pointer mb-2 inline-block"
              style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
            >
              ⬅️ Kembali
            </button>
            <h2 className="text-base font-bold" style={{ color: '#1d1601' }}>Riwayat & Manajemen Penilaian</h2>
            <p className="text-sm mt-0.5" style={{ color: '#1d1601' }}>
              {profile?.nama_lengkap} — {mataPelajaran}
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold" style={{ color: '#1d1601' }}>Kelas:</label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="p-2 border rounded-lg text-base"
              style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
            >
              <option value="">Semua Kelas</option>
              {uniqueKelas.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold" style={{ color: '#1d1601' }}>Jenis:</label>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="p-2 border rounded-lg text-base"
              style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
            >
              <option value="">Semua Jenis</option>
              {uniqueJenis.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: '#f4aa18' }} />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-2.5 pl-9 border rounded-lg text-base"
              style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-base font-semibold animate-pulse" style={{ color: '#1d1601' }}>
            Memuat data...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-base" style={{ color: '#1d1601' }}>
            {scores.length === 0
              ? 'Belum ada data penilaian. Silakan input nilai terlebih dahulu.'
              : 'Tidak ada data yang cocok dengan filter.'}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#f4aa18' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}>
                  <th className="p-3 text-left font-bold">Tanggal Input</th>
                  <th className="p-3 text-left font-bold">Nama Siswa</th>
                  <th className="p-3 text-left font-bold">NISN</th>
                  <th className="p-3 text-left font-bold">Kelas</th>
                  <th className="p-3 text-left font-bold">Mata Pelajaran</th>
                  <th className="p-3 text-left font-bold">Jenis Penilaian</th>
                  <th className="p-3 text-center font-bold">Nilai</th>
                  <th className="p-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#fefaef' : '#ffffff',
                      color: '#1d1601',
                    }}
                    className="border-b"
                  >
                    <td className="p-3 text-xs whitespace-nowrap">{safeDate(item.created_at)}</td>
                    <td className="p-3 font-medium">{item.student_name}</td>
                    <td className="p-3">{item.student_nisn || '-'}</td>
                    <td className="p-3">{item.kelas}</td>
                    <td className="p-3">{item.mapel}</td>
                    <td className="p-3">{item.jenis_penilaian}</td>
                    <td className="p-3 text-center font-bold">{item.nilai}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="p-1.5 rounded-lg cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                          title="Hapus"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Modal Edit ── */}
        <dialog ref={modalRef} className="modal">
          <div className="modal-box p-0 overflow-hidden" style={{ backgroundColor: '#fefaef' }}>
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                onClick={() => setEditItem(null)}
              >
                <X className="size-4" />
              </button>
            </form>
            <div className="p-6" style={{ borderBottom: `2px solid #f4aa18` }}>
              <h3 className="text-base font-bold" style={{ color: '#1d1601' }}>Edit Nilai</h3>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Nama Siswa</label>
                <p className="text-base font-medium" style={{ color: '#1d1601' }}>
                  {editItem?.student_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Mata Pelajaran</label>
                <p className="text-base" style={{ color: '#1d1601' }}>{editItem?.mapel}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>
                  Jenis Penilaian
                </label>
                <input
                  type="text"
                  value={editJenis}
                  onChange={(e) => setEditJenis(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-base"
                  style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>
                  Nilai (0–100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={editNilai}
                  onChange={(e) => setEditNilai(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-base"
                  style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { modalRef.current?.close(); setEditItem(null); }}
                  className="px-4 py-2 rounded-lg text-base font-semibold cursor-pointer"
                  style={{ backgroundColor: '#fefaef', border: `1px solid #f4aa18`, color: '#1d1601' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-base font-bold cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setEditItem(null)}>tutup</button>
          </form>
        </dialog>

        {/* ── Modal Konfirmasi Hapus ── */}
        <dialog ref={confirmRef} className="modal">
          <div className="modal-box" style={{ backgroundColor: '#fefaef', color: '#1d1601' }}>
            <h3 className="text-base font-bold" style={{ color: '#1d1601' }}>Konfirmasi Hapus</h3>
            <p className="py-4 text-base">
              Apakah Anda yakin ingin menghapus data nilai ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-action">
              <button
                className="px-4 py-2 rounded-lg text-base font-semibold cursor-pointer"
                style={{ backgroundColor: '#fefaef', border: `1px solid #f4aa18`, color: '#1d1601' }}
                onClick={() => { confirmRef.current?.close(); setDeleteTarget(null); }}
              >
                Batal
              </button>
              <button
                onClick={execDelete}
                className="px-4 py-2 rounded-lg text-base font-bold cursor-pointer"
                style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
              >
                Hapus
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setDeleteTarget(null)}>tutup</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}
