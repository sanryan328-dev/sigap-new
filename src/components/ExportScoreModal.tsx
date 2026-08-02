import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileSpreadsheet, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

interface ExportScoreModalProps {
  open: boolean;
  onClose: () => void;
  daftarKelas: string[];
  mataPelajaran?: string;
}

export default function ExportScoreModal({ open, onClose, daftarKelas, mataPelajaran }: ExportScoreModalProps) {
  const profile = useAuthStore((s) => s.profile);
  const [kelas, setKelas] = useState('');
  const [jenisPenilaian, setJenisPenilaian] = useState<'semua' | 'spesifik'>('semua');
  const [spesifikPenilaian, setSpesifikPenilaian] = useState('');
  const [formatFile, setFormatFile] = useState<'excel' | 'pdf'>('excel');
  const [availablePenilaian, setAvailablePenilaian] = useState<string[]>([]);
  const [loadingJenis, setLoadingJenis] = useState(false);
  const [loadingUnduh, setLoadingUnduh] = useState(false);
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setKelas('');
      setAvailablePenilaian([]);
      setSpesifikPenilaian('');
      setTeacherClasses([]);
      setJenisPenilaian('semua');
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
      return;
    }
    const fetchJenis = async () => {
      setLoadingJenis(true);
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

  const fetchScores = async () => {
    if (!kelas || !profile?.user_id) return null;
    const rawUserId = profile.user_id;
    const userIdNum = typeof rawUserId === 'string' ? parseInt(rawUserId) : rawUserId;

    let query = supabase
      .from('student_scores')
      .select('student_id, jenis_penilaian, nilai')
      .eq('user_id', userIdNum)
      .eq('kelas', kelas);

    if (jenisPenilaian === 'spesifik' && spesifikPenilaian.trim()) {
      query = query.eq('jenis_penilaian', spesifikPenilaian.trim());
    }

    const { data: scores, error } = await query;
    if (error) throw error;
    return scores || [];
  };

  const fetchStudents = async (scores: any[]) => {
    const studentIds = [...new Set(scores.map((s: any) => s.student_id))];
    const { data: students } = await supabase
      .from('students')
      .select('id, nama_siswa, nisn')
      .in('id', studentIds);
    return students || [];
  };

  const buildPivotData = (scores: any[], students: any[]) => {
    const studentMap = new Map<number, { nama_siswa: string; nisn: string }>();
    students.forEach((s: any) => {
      studentMap.set(s.id, { nama_siswa: s.nama_siswa, nisn: s.nisn });
    });

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

    return { pivotedMap, studentInfoMap };
  };

  const handleUnduhExcel = async (scores: any[]) => {
    const students = await fetchStudents(scores);
    const { pivotedMap, studentInfoMap } = buildPivotData(scores, students);

    const sortedStudentIds = Array.from(pivotedMap.keys()).sort((a, b) => {
      const na = studentInfoMap.get(a)?.nama_siswa || '';
      const nb = studentInfoMap.get(b)?.nama_siswa || '';
      return na.localeCompare(nb);
    });

    const allJenis = [...new Set(scores.map((s: any) => s.jenis_penilaian))].sort();
    const header = ['Nama Siswa', 'NISN', ...allJenis];
    const rows = sortedStudentIds.map(id => {
      const info = studentInfoMap.get(id)!;
      const vals = pivotedMap.get(id)!;
      return [info.nama_siswa, info.nisn, ...allJenis.map(j => vals[j] ?? '')];
    });

    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Nilai');
    ws['!cols'] = [
      { wch: 30 },
      { wch: 15 },
      ...allJenis.map(() => ({ wch: 12 })),
    ];

    const label =
      jenisPenilaian === 'spesifik' && spesifikPenilaian.trim()
        ? spesifikPenilaian.replace(/\s+/g, '_')
        : 'Semua_Penilaian';
    XLSX.writeFile(wb, `Rekap_Nilai_${kelas}_${label}.xlsx`);
  };

  const handleUnduhPdf = async (scores: any[]) => {
    const students = await fetchStudents(scores);
    const { pivotedMap, studentInfoMap } = buildPivotData(scores, students);

    const sortedStudentIds = Array.from(pivotedMap.keys()).sort((a, b) => {
      const na = studentInfoMap.get(a)?.nama_siswa || '';
      const nb = studentInfoMap.get(b)?.nama_siswa || '';
      return na.localeCompare(nb);
    });

    const allJenis = [...new Set(scores.map((s: any) => s.jenis_penilaian))].sort();

    let printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Izinkan pop-up untuk mencetak PDF.');
      return;
    }

    const title =
      jenisPenilaian === 'spesifik' && spesifikPenilaian.trim()
        ? `Rekap Nilai — ${kelas} — ${spesifikPenilaian.trim()}`
        : `Rekap Nilai — ${kelas} — Semua Penilaian`;

    const tableRows = sortedStudentIds
      .map((id) => {
        const info = studentInfoMap.get(id)!;
        const vals = pivotedMap.get(id)!;
        const cells = allJenis.map((j) => `<td>${vals[j] ?? ''}</td>`).join('');
        return `<tr><td>${info.nama_siswa}</td><td>${info.nisn}</td>${cells}</tr>`;
      })
      .join('');

    const jenisHeaders = allJenis.map((j) => `<th>${j}</th>`).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1e293b; }
          h1 { font-size: 18px; margin-bottom: 4px; }
          .sub { font-size: 13px; color: #64748b; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
          th { background: #f1f5f9; font-weight: 600; }
          tr:nth-child(even) { background: #f8fafc; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="sub">Dicetak dari SIGAP SPENSAWA</p>
        <table>
          <thead><tr><th>Nama Siswa</th><th>NISN</th>${jenisHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleUnduh = async () => {
    if (!kelas || !profile?.user_id) return;
    if (jenisPenilaian === 'spesifik' && !spesifikPenilaian.trim()) {
      toast.error('Pilih jenis penilaian yang ingin diunduh.');
      return;
    }
    setLoadingUnduh(true);
    try {
      const scores = await fetchScores();
      if (!scores || scores.length === 0) {
        toast.error('Tidak ada data nilai untuk kriteria yang dipilih.');
        return;
      }

      if (formatFile === 'excel') {
        await handleUnduhExcel(scores);
      } else {
        await handleUnduhPdf(scores);
      }

      toast.success('Laporan berhasil diunduh!');
      onClose();
    } catch (err: any) {
      toast.error('Gagal mengunduh: ' + err.message);
    } finally {
      setLoadingUnduh(false);
    }
  };

  const siap = kelas && !loadingJenis;

  const canUnduh =
    siap &&
    !loadingUnduh &&
    (!loadingJenis && kelas && availablePenilaian.length > 0) &&
    (jenisPenilaian === 'semua' || (jenisPenilaian === 'spesifik' && spesifikPenilaian.trim()));

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
                <h3 className="text-sm font-bold text-slate-900">Pusat Unduh Laporan Mandiri</h3>
              </div>
              <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
                <X className="size-4" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="space-y-5 px-6 py-5">
              {/* Field 1: Mata Pelajaran */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-semibold">Mata Pelajaran</span>
                </label>
                <input
                  type="text"
                  value={mataPelajaran || '—'}
                  readOnly
                  className="input input-bordered w-full bg-slate-50 text-sm font-semibold text-slate-700"
                />
              </div>

              {/* Field 2: Dropdown Kelas */}
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

              {/* Field 3: Jenis Penilaian */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-semibold">Pilih Jenis Penilaian</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jenisPenilaian"
                      className="radio radio-primary radio-sm"
                      checked={jenisPenilaian === 'semua'}
                      onChange={() => setJenisPenilaian('semua')}
                    />
                    <span className="text-sm">Semua Penilaian (Rekap Kumulatif / Nilai Akhir)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jenisPenilaian"
                      className="radio radio-primary radio-sm"
                      checked={jenisPenilaian === 'spesifik'}
                      onChange={() => setJenisPenilaian('spesifik')}
                    />
                    <span className="text-sm">Penilaian Spesifik</span>
                  </label>
                </div>
              </div>

              {/* Sub-dropdown Jenis Penilaian (only in spesifik mode) */}
              {jenisPenilaian === 'spesifik' && (
                <div className="form-control w-full">
                  <label className="label py-1">
                    <span className="label-text text-sm font-semibold">Nama Penilaian</span>
                  </label>
                  <select
                    value={spesifikPenilaian}
                    onChange={(e) => setSpesifikPenilaian(e.target.value)}
                    disabled={!kelas || loadingJenis}
                    className="select select-bordered w-full text-sm disabled:bg-slate-100"
                  >
                    <option value="">— Pilih Penilaian —</option>
                    {availablePenilaian.map((j) => (
                      <option key={j} value={j}>{j}</option>
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
              )}

              {/* Format File */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-semibold">Format File</span>
                </label>
                <select
                  value={formatFile}
                  onChange={(e) => setFormatFile(e.target.value as 'excel' | 'pdf')}
                  className="select select-bordered w-full text-sm"
                >
                  <option value="excel">Microsoft Excel (.xlsx)</option>
                  <option value="pdf">PDF / Cetak</option>
                </select>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={onClose} className="btn btn-ghost btn-sm">
                Batalkan
              </button>
              <button
                onClick={handleUnduh}
                disabled={!canUnduh}
                className="btn btn-primary btn-sm gap-1.5"
              >
                {loadingUnduh ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : formatFile === 'excel' ? (
                  <Download className="size-4" />
                ) : (
                  <Printer className="size-4" />
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
