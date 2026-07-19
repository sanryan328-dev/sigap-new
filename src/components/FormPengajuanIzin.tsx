import { useState, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { toast } from 'sonner';
import { X, Upload, Loader2, FileText, AlertCircle, Paperclip } from 'lucide-react';
import { addToOfflineQueue } from '../utils/dbLocal';

const STATUS_IZIN_OPTIONS = [
  { value: 'sakit', label: 'Sakit' },
  { value: 'tugas_dinas', label: 'Izin Dinas' },
  { value: 'izin_keperluan', label: 'Izin Keperluan Mendesak' },
] as const;

const ALLOWED_TUGAS_TYPES = [
  'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface FormPengajuanIzinProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  namaLengkap: string;
}

export default function FormPengajuanIzin({ open, onClose, userId, namaLengkap }: FormPengajuanIzinProps) {
  const [statusIzin, setStatusIzin] = useState<string>('sakit');
  const [alasanDetail, setAlasanDetail] = useState('');
  const [titipanTugas, setTitipanTugas] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tugasFile, setTugasFile] = useState<File | null>(null);
  const [tugasPreviewUrl, setTugasPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tugasFileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setStatusIzin('sakit');
    setAlasanDetail('');
    setTitipanTugas('');
    setFile(null);
    setPreviewUrl(null);
    setTugasFile(null);
    setTugasPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (tugasFileInputRef.current) tugasFileInputRef.current.value = '';
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (selected.size > maxSize) {
      toast.error('Ukuran file maksimal 5 MB');
      e.target.value = '';
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleTugasFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      setTugasFile(null);
      setTugasPreviewUrl(null);
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (selected.size > maxSize) {
      toast.error('Ukuran file modul tugas maksimal 10 MB');
      e.target.value = '';
      return;
    }
    if (!ALLOWED_TUGAS_TYPES.includes(selected.type) && !selected.name.match(/\.(docx?|pdf|png|jpe?g|gif|webp)$/i)) {
      toast.error('Format tidak didukung. Gunakan PDF, DOCX, atau gambar.');
      e.target.value = '';
      return;
    }
    setTugasFile(selected);
    if (selected.type.startsWith('image/')) {
      setTugasPreviewUrl(URL.createObjectURL(selected));
    } else {
      setTugasPreviewUrl(null);
    }
  };

  const uploadToBucket = async (bucket: string, file: File, pathPrefix: string): Promise<string | null> => {
    const ext = file.name.split('.').pop() || 'bin';
    const filePath = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) {
      if (error.message.includes('bucket')) {
        toast.error(`Bucket ${bucket} belum ada. Hubungi admin.`);
      } else {
        toast.error(`Gagal upload ${bucket}: ${error.message}`);
      }
      return null;
    }
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl?.publicUrl || null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!alasanDetail.trim()) {
      toast.error('Alasan detail wajib diisi');
      return;
    }
    setSubmitting(true);

    let suratUrl: string | null = null;
    let tugasUrl: string | null = null;

    if (file) {
      setUploading(true);
      suratUrl = await uploadToBucket('surat-izin', file, userId);
      if (!suratUrl) { setSubmitting(false); return; }
    }

    if (tugasFile) {
      setUploading(true);
      tugasUrl = await uploadToBucket('tugas-titipan', tugasFile, userId);
      if (!tugasUrl) { setSubmitting(false); return; }
    }

    setUploading(false);

    const payload = {
      user_id: parseInt(userId),
      tanggal_absen: new Date().toISOString().split('T')[0],
      status_izin: statusIzin,
      alasan_detail: alasanDetail.trim(),
      file_surat_keterangan: suratUrl,
      titipan_tugas_kelas: titipanTugas.trim() || null,
      tugas_attachment_url: tugasUrl,
      status_verifikasi: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (!navigator.onLine) {
        await addToOfflineQueue(userId, 'teacher_absences', payload);
        toast.success('Pengajuan izin disimpan secara offline. Akan terkirim saat online.');
      } else {
        const { error } = await supabase.from('teacher_absences').insert([payload]);
        if (error) throw error;
        toast.success('Pengajuan izin berhasil dikirim! Menunggu verifikasi guru piket.');
      }
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengajukan izin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Form Izin
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">Pengajuan Berhalangan Hadir</h2>
                <p className="text-xs text-slate-500 mt-0.5">{namaLengkap}</p>
              </div>
              <button
                onClick={handleClose}
                disabled={submitting}
                className="btn btn-ghost btn-sm btn-square rounded-lg disabled:opacity-30"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              {/* Status Izin */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Status Izin</label>
                <select
                  value={statusIzin}
                  onChange={(e) => setStatusIzin(e.target.value)}
                  disabled={submitting}
                  className="select select-bordered w-full text-sm"
                >
                  {STATUS_IZIN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Alasan Detail */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Alasan Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={alasanDetail}
                  onChange={(e) => setAlasanDetail(e.target.value)}
                  disabled={submitting}
                  rows={3}
                  placeholder="Jelaskan alasan ketidakhadiran Anda..."
                  className="textarea textarea-bordered w-full text-sm"
                  required
                />
              </div>

              {/* Upload Foto/Surat Izin */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Foto Bukti / Surat Izin</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <Upload className="size-4" />
                    {file ? 'Ganti File' : 'Pilih File'}
                  </button>
                  <span className="text-xs text-slate-500">Maks. 5 MB (Gambar/PDF)</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {previewUrl && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                    {file?.type === 'application/pdf' ? (
                      <FileText className="size-8 text-rose-500" />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="size-10 rounded object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 truncate">{file?.name}</p>
                      <p className="text-[10px] text-slate-400">{((file?.size || 0) / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="btn btn-ghost btn-xs text-slate-400 hover:text-red-500"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Modul Tugas (Attachment Titipan Tugas) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Paperclip className="size-3.5" />
                  Berkas Modul Tugas (Attachment)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => tugasFileInputRef.current?.click()}
                    disabled={submitting}
                    className="btn btn-outline btn-sm gap-2"
                  >
                    <Upload className="size-4" />
                    {tugasFile ? 'Ganti Berkas' : 'Pilih Berkas'}
                  </button>
                  <span className="text-xs text-slate-500">Maks. 10 MB (PDF, DOCX, Gambar)</span>
                </div>
                <input
                  ref={tugasFileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.gif,.webp"
                  onChange={handleTugasFileChange}
                  className="file-input file-input-bordered file-input-sm w-full text-sm mt-1"
                />
                {tugasFile && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                    {tugasFile.type.startsWith('image/') && tugasPreviewUrl ? (
                      <img src={tugasPreviewUrl} alt="Preview" className="size-10 rounded object-cover" />
                    ) : (
                      <FileText className="size-8 text-blue-500" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 truncate">{tugasFile.name}</p>
                      <p className="text-[10px] text-slate-400">{((tugasFile.size || 0) / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setTugasFile(null); setTugasPreviewUrl(null); if (tugasFileInputRef.current) tugasFileInputRef.current.value = ''; }}
                      className="btn btn-ghost btn-xs text-slate-400 hover:text-red-500"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Titipan Tugas Kelas */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Titipan Tugas Kelas</label>
                <textarea
                  value={titipanTugas}
                  onChange={(e) => setTitipanTugas(e.target.value)}
                  disabled={submitting}
                  rows={2}
                  placeholder="Titipan tugas untuk siswa selama guru tidak hadir (opsional)..."
                  className="textarea textarea-bordered w-full text-sm"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !alasanDetail.trim()}
                className="btn btn-soft btn-rose w-full gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {uploading ? 'Mengupload...' : 'Mengirim...'}
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-4" />
                    Ajukan Izin
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
