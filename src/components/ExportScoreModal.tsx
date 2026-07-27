import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

interface ExportScoreModalProps {
  open: boolean;
  onClose: () => void;
  daftarKelas: string[];
}

export default function ExportScoreModal({ open, onClose, daftarKelas }: ExportScoreModalProps) {
  const profile = useAuthStore((s) => s.profile);
  const [kelas, setKelas] = useState('');
  const [availablePenilaian, setAvailablePenilaian] = useState<string[]>([]);
  const [selectedPenilaian, setSelectedPenilaian] = useState('ALL');
  const [loadingJenis, setLoadingJenis] = useState(false);
  const [loadingUnduh, setLoadingUnduh] = useState(false);
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setKelas('');
      setAvailablePenilaian([]);
      setSelectedPenilaian('ALL');
      setTeacherClasses([]);
    }
  }, [open]);

  useEffect(() => {
    if (!profile?.user_id) return;
    const rawUserId = typeof profile.user_id === 'string' ? parseInt(profile.user_id) : profile.user_id;
    const fetchTeacherClasses = async () => {
      const { data } = await supabase
        .from('student_scores')
        .select('kelas')
        .eq('user_id', rawUserId);
      if (data) {
        const unique = [...new Set(data.map(r => r.kelas).filter(Boolean))] as string[];
        unique.sort();
        setTeacherClasses(unique);
      }
    };
    fetchTeacherClasses();
  }, [profile?.user_id]);

  useEffect(() => {
    if (!kelas || !profile?.user_id) {
      setAvailablePenilaian([]);
      setSelectedPenilaian('ALL');
      return;
    }
    const fetchJenis = async () => {
      setLoadingJenis(true);
      setSelectedPenilaian('ALL');
      try {
        const { data } = await supabase
          .from('student_scores')
          .select('jenis_penilaian')
          .eq('kelas', kelas)
          .eq('user_id', profile.user_id);
        if (data) {
          const unique = [...new Set(data.map(r => r.jenis_penilaian).filter(Boolean))] as string[];
          unique.sort();
          setAvailablePenilaian(unique);
        }
      } catch (err) {
        console.warn('Gagal memuat jenis penilaian:', err);
      } finally {
        setLoadingJenis(false);
      }
    };
    fetchJenis();
  }, [kelas, profile?.user_id]);

  const handleUnduh = async () => {
    if (!kelas || !profile?.user_id) return;
    setLoadingUnduh(true);
    try {
      const rawUserId = profile.user_id;
      const userIdNum = typeof rawUserId === 'string' ? parseInt(rawUserId) : rawUserId;

      let query = supabase
        .from('student_scores')
        .select('student_id, jenis_penilaian, nilai')
        .eq('user_id', userIdNum)
        .eq('kelas', kelas);

      if (selectedPenilaian !== 'ALL') {
        query = query.eq('jenis_penilaian', selectedPenilaian);
      }

      const { data: scores, error } = await query;

      if (error) throw error;
      if (!scores || scores.length === 0) {
        toast.error('Tidak ada data nilai untuk kriteria yang dipilih.');
        return;
      }

      const studentIds = [...new Set(scores.map((s: any) => s.student_id))];
      const { data: students } = await supabase
        .from('students')
        .select('id, nama_siswa, nisn')
        .in('id', studentIds);

      const studentMap = new Map<number, { nama_siswa: string; nisn: string }>();
      if (students) {
        students.forEach((s: any) => {
          studentMap.set(s.id, { nama_siswa: s.nama_siswa, nisn: s.nisn });
        });
      }

      const pivotedMap = new Map<number, Record<string, number>>();
      const studentInfoMap = new Map<number, { nama_siswa: string; nisn: string }>();

      scores.forEach((s: any) => {
        if (!pivotedMap.has(s.student_id)) {
          pivotedMap.set(s.student_id, {});
        }
        pivotedMap.get(s.student_id)![s.jenis_penilaian] = s.nilai;

        if (!studentInfoMap.has(s.student_id)) {
          const info = studentMap.get(s.student_id);
          studentInfoMap.set(s.student_id, {
            nama_siswa: info?.nama_siswa || `(id: ${s.student_id})`,
            nisn: info?.nisn || '',
          });
        }
      });

      const sortedStudentIds = Array.from(pivotedMap.keys()).sort((a, b) => {
        const na = studentInfoMap.get(a)?.nama_siswa || '';
        const nb = studentInfoMap.get(b)?.nama_siswa || '';
        return na.localeCompare(nb);
      });

      const allJenis = [...new Set(scores.map((s: any) => s.jenis_penilaian))].sort();

      const header = ['Nama Siswa', 'NISN', ...allJenis];
      const rows = sortedStudentIds.map(id => {
        const info = studentInfoMap.get(id)!;
        const scores = pivotedMap.get(id)!;
        return [
          info.nama_siswa,
          info.nisn,
          ...allJenis.map(jenis => scores[jenis] ?? ''),
        ];
      });

      const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rekap Nilai');

      const colWidths = [
        { wch: 30 },
        { wch: 15 },
        ...allJenis.map(() => ({ wch: 12 })),
      ];
      ws['!cols'] = colWidths;

      const label = selectedPenilaian === 'ALL' ? 'Semua_Penilaian' : selectedPenilaian.replace(/\s+/g, '_');
      XLSX.writeFile(wb, `Rekap_Nilai_${kelas}_${label}.xlsx`);
      toast.success('File Excel berhasil diunduh!');
      onClose();
    } catch (err: any) {
      toast.error('Gagal mengunduh: ' + err.message);
    } finally {
      setLoadingUnduh(false);
    }
  };

  const siap = kelas && !loadingJenis;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white shadow-2xl"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xs">
                  <FileSpreadsheet className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Unduh Rekap Nilai</h3>
              </div>
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
                <X className="size-4" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="space-y-5 px-6 py-5">
              {/* Dropdown Kelas */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-semibold">Pilih Kelas</span>
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="select select-bordered w-full text-sm"
                >
                  <option value="">— Pilih Kelas —</option>
                  {teacherClasses.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              {/* Dropdown Jenis Penilaian */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-semibold">Jenis Penilaian</span>
                </label>
                <select
                  value={selectedPenilaian}
                  onChange={(e) => setSelectedPenilaian(e.target.value)}
                  disabled={!kelas || loadingJenis}
                  className="select select-bordered w-full text-sm disabled:bg-slate-100"
                >
                  <option value="ALL">Semua Penilaian</option>
                  {availablePenilaian.map((jenis) => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
                {loadingJenis && (
                  <p className="text-[11px] text-slate-500 mt-1 animate-pulse">Memuat daftar penilaian...</p>
                )}
                {!loadingJenis && kelas && availablePenilaian.length === 0 && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1">
                    Belum ada riwayat penilaian di kelas ini.
                  </p>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={onClose} className="btn btn-ghost btn-sm">
                Batalkan
              </button>
              <button
                onClick={handleUnduh}
                disabled={!siap || loadingUnduh || (!loadingJenis && kelas && availablePenilaian.length === 0)}
                className="btn btn-primary btn-sm gap-1.5"
              >
                {loadingUnduh ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Download className="size-4" />
                )}
                Unduh Sekarang
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
