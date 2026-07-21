import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { Pencil, Trash2, X, Search } from 'lucide-react';

interface TeachingJournal {
  id: number;
  user_id: number;
  kelas: string;
  mata_pelajaran: string;
  jam_ke: string;
  materi_pembelajaran: string;
  catatan_kelas: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface RiwayatJurnalProps {
  setSubMenu: (menu: 'jurnal' | 'nilai' | 'riwayat-nilai' | 'riwayat-jurnal' | null) => void;
  kelas: string;
  mataPelajaran: string;
}

export default function RiwayatJurnal({ setSubMenu, kelas, mataPelajaran }: RiwayatJurnalProps) {
  const profile = useAuthStore((s) => s.profile);
  const [journals, setJournals] = useState<TeachingJournal[]>([]);
  const [loading, setLoading] = useState(false);

  const [filterKelas, setFilterKelas] = useState('');
  const [filterMapel, setFilterMapel] = useState('');
  const [searchText, setSearchText] = useState('');

  const [editItem, setEditItem] = useState<TeachingJournal | null>(null);
  const [editMateri, setEditMateri] = useState('');
  const [editCatatan, setEditCatatan] = useState('');
  const [editKelas, setEditKelas] = useState('');
  const [editJamKe, setEditJamKe] = useState('');
  const [saving, setSaving] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLDialogElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchJournals = useCallback(async () => {
    if (!profile?.user_id) return;
    setLoading(true);
    try {
      const rawUserId = profile.user_id;
      const userIdNum = typeof rawUserId === 'string' ? parseInt(rawUserId) : rawUserId;
      if (!userIdNum) return;

      const { data, error } = await supabase
        .from('teaching_journals')
        .select('*')
        .eq('user_id', userIdNum)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (err: any) {
      toast.error('Gagal memuat riwayat jurnal: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [profile?.user_id]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const uniqueKelas = [...new Set(journals.map((j) => j.kelas))].sort();
  const uniqueMapel = [...new Set(journals.map((j) => j.mata_pelajaran))].sort();

  const filtered = journals.filter((j) => {
    if (filterKelas && j.kelas !== filterKelas) return false;
    if (filterMapel && j.mata_pelajaran !== filterMapel) return false;
    if (searchText) {
      const q = searchText.toLowerCase();
      if (!j.materi_pembelajaran.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const openEdit = (item: TeachingJournal) => {
    setEditItem(item);
    setEditMateri(item.materi_pembelajaran);
    setEditCatatan(item.catatan_kelas || '');
    setEditKelas(item.kelas);
    setEditJamKe(item.jam_ke);
    modalRef.current?.showModal();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    if (!editMateri.trim()) {
      toast.error('Materi pembelajaran tidak boleh kosong');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('teaching_journals')
        .update({
          materi_pembelajaran: editMateri.trim(),
          catatan_kelas: editCatatan.trim() || null,
          kelas: editKelas,
          jam_ke: editJamKe,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editItem.id);
      if (error) throw error;
      toast.success('Jurnal berhasil diperbarui!');
      modalRef.current?.close();
      setEditItem(null);
      fetchJournals();
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
        .from('teaching_journals')
        .delete()
        .eq('id', deleteTarget);
      if (error) throw error;
      toast.success('Jurnal berhasil dihapus.');
      confirmRef.current?.close();
      setDeleteTarget(null);
      fetchJournals();
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
        hour: '2-digit', minute: '2-digit',
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
            <h2 className="text-base font-bold" style={{ color: '#1d1601' }}>Riwayat Jurnal Mengajar</h2>
            <p className="text-sm mt-0.5" style={{ color: '#1d1601' }}>
              {profile?.nama_lengkap}
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
            <label className="text-sm font-semibold" style={{ color: '#1d1601' }}>Mapel:</label>
            <select
              value={filterMapel}
              onChange={(e) => setFilterMapel(e.target.value)}
              className="p-2 border rounded-lg text-base"
              style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
            >
              <option value="">Semua Mapel</option>
              {uniqueMapel.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: '#f4aa18' }} />
            <input
              type="text"
              placeholder="Cari materi pembelajaran..."
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
            {journals.length === 0
              ? 'Belum ada jurnal. Silakan isi jurnal terlebih dahulu.'
              : 'Tidak ada data yang cocok dengan filter.'}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#f4aa18' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}>
                  <th className="p-3 text-left font-bold">Tanggal</th>
                  <th className="p-3 text-left font-bold">Kelas</th>
                  <th className="p-3 text-left font-bold">Mapel</th>
                  <th className="p-3 text-left font-bold">Jam Ke</th>
                  <th className="p-3 text-left font-bold">Materi</th>
                  <th className="p-3 text-left font-bold">Catatan</th>
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
                    <td className="p-3 font-medium">{item.kelas}</td>
                    <td className="p-3">{item.mata_pelajaran}</td>
                    <td className="p-3">{item.jam_ke}</td>
                    <td className="p-3 max-w-[200px] truncate" title={item.materi_pembelajaran}>
                      {item.materi_pembelajaran}
                    </td>
                    <td className="p-3 max-w-[150px] truncate text-xs" title={item.catatan_kelas || ''}>
                      {item.catatan_kelas || '—'}
                    </td>
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
              <h3 className="text-base font-bold" style={{ color: '#1d1601' }}>Edit Jurnal</h3>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Kelas</label>
                  <input
                    type="text"
                    value={editKelas}
                    onChange={(e) => setEditKelas(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-base"
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Jam Ke</label>
                  <input
                    type="text"
                    value={editJamKe}
                    onChange={(e) => setEditJamKe(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-base"
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>
                  Materi Pembelajaran
                </label>
                <textarea
                  value={editMateri}
                  onChange={(e) => setEditMateri(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border rounded-lg text-base resize-y"
                  style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>
                  Catatan Kelas
                </label>
                <textarea
                  value={editCatatan}
                  onChange={(e) => setEditCatatan(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 border rounded-lg text-base resize-y"
                  style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
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
              Apakah Anda yakin ingin menghapus jurnal ini? Tindakan ini tidak dapat dibatalkan.
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
