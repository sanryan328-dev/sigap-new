import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Save, Trophy, ScrollText } from 'lucide-react';

interface Profile {
  user_id: string;
  nama_lengkap: string;
  nama_ekstrakurikuler: string | null;
}

interface FormNilaiEkskulProps {
  profile: Profile;
  onBack: () => void;
}

export default function FormNilaiEkskul({ profile, onBack }: FormNilaiEkskulProps) {
  const [anggota, setAnggota] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nilai, setNilai] = useState<Record<string, { grade: string; description: string }>>({});

  useEffect(() => {
    fetchAnggota();
  }, []);

  const fetchAnggota = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_ekskul')
        .select('*, students(nama_siswa, kelas, nisn)')
        .eq('nama_ekskul', profile.nama_ekstrakurikuler);
      if (error) throw error;
      if (data) {
        setAnggota(data);
        const init: Record<string, { grade: string; description: string }> = {};
        data.forEach((a: any) => {
          init[a.student_id] = {
            grade: a.nilai_kualitatif || 'B',
            description: a.deskripsi_kemajuan || '',
          };
        });
        setNilai(init);
      }
    } catch (err: any) {
      toast.error('Gagal memuat data anggota: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimpanSemua = async () => {
    setSaving(true);
    try {
      const updates = anggota.map((a) =>
        supabase
          .from('student_ekskul')
          .update({
            nilai_kualitatif: nilai[a.student_id]?.grade || 'B',
            deskripsi_kemajuan:
              nilai[a.student_id]?.description?.trim() ||
              getDefaultDescription(nilai[a.student_id]?.grade || 'B'),
          })
          .eq('id', a.id),
      );
      await Promise.all(updates);
      toast.success('Nilai ekstrakurikuler berhasil disimpan!');
    } catch (err: any) {
      toast.error('Gagal menyimpan nilai: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSimpanSatu = async (studentId: string) => {
    const item = anggota.find((a) => a.student_id === studentId);
    if (!item) return;
    setSaving(true);
    try {
      const data = nilai[studentId] || { grade: 'B', description: '' };
      await supabase
        .from('student_ekskul')
        .update({
          nilai_kualitatif: data.grade,
          deskripsi_kemajuan: data.description.trim() || getDefaultDescription(data.grade),
        })
        .eq('id', item.id);
      toast.success(`Nilai ${item.students?.nama_siswa} berhasil disimpan.`);
    } catch (err: any) {
      toast.error('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const getDefaultDescription = (grade: string) => {
    const map: Record<string, string> = {
      A: 'Sangat aktif, menunjukkan kepemimpinan dan penguasaan teknik tinggi.',
      B: 'Aktif mengikuti latihan dan menunjukkan perkembangan keterampilan yang baik.',
      C: 'Cukup aktif mengikuti latihan, keterampilan perlu ditingkatkan.',
      D: 'Kurang berpartisipasi dalam agenda latihan.',
    };
    return map[grade] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
    >
      <div className="w-full max-w-4xl space-y-5">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md"
        >
          <div className="flex-1 flex-col items-start gap-1">
            <div className="badge badge-soft badge-violet badge-sm uppercase tracking-widest">Penilaian Ekskul</div>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {profile.nama_ekstrakurikuler}
            </h2>
            <p className="text-xs font-medium text-slate-500">{profile.nama_lengkap}</p>
          </div>
          <div className="flex-none">
            <button onClick={onBack} className="btn btn-ghost btn-sm">
              <ArrowLeft className="size-4" />
              Kembali
            </button>
          </div>
        </motion.div>

        {/* ── Konten ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card border border-violet-200/60 bg-white shadow-lg"
        >
          <div className="card-body gap-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="card-title gap-2 text-sm text-slate-900">
                  <Trophy className="size-4 text-violet-500" />
                  Input Nilai & Deskripsi Capaian
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  Berikan predikat A/B/C/D dan deskripsi kemajuan untuk setiap anggota.
                </p>
              </div>
              {anggota.length > 0 && (
                <button
                  onClick={handleSimpanSemua}
                  disabled={saving}
                  className="btn btn-soft btn-violet btn-sm gap-2"
                >
                  <Save className="size-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Semua'}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-md text-violet-500" />
              </div>
            ) : anggota.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <ScrollText className="size-10 text-slate-300" />
                <p className="text-sm font-medium text-slate-400">
                  Belum ada anggota terdaftar untuk ekskul ini.
                </p>
                <p className="text-xs text-slate-400">
                  Tambahkan anggota terlebih dahulu melalui menu Anggota Ekskul.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {anggota.map((item, idx) => {
                  const val = nilai[item.student_id] || { grade: 'B', description: '' };
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="card card-border border-slate-200 bg-slate-50/50 transition-all duration-200 hover:border-violet-300 hover:shadow-sm"
                    >
                      <div className="card-body gap-3 p-4 sm:flex-row sm:items-end">
                        {/* Info Siswa */}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm">
                            {item.students?.nama_siswa}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500">
                            Kelas {item.students?.kelas} &bull; NISN {item.students?.nisn}
                          </p>
                        </div>

                        {/* Grade */}
                        <div className="w-full sm:w-28">
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Nilai
                          </label>
                          <select
                            value={val.grade}
                            onChange={(e) =>
                              setNilai((prev) => ({
                                ...prev,
                                [item.student_id]: { ...val, grade: e.target.value },
                              }))
                            }
                            disabled={saving}
                            className="select select-bordered select-sm w-full font-semibold"
                          >
                            <option value="A">A — Sangat Baik</option>
                            <option value="B">B — Baik</option>
                            <option value="C">C — Cukup</option>
                            <option value="D">D — Kurang</option>
                          </select>
                        </div>

                        {/* Description */}
                        <div className="w-full flex-1">
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Deskripsi Capaian
                          </label>
                          <div className="join w-full">
                            <input
                              type="text"
                              value={val.description}
                              onChange={(e) =>
                                setNilai((prev) => ({
                                  ...prev,
                                  [item.student_id]: { ...val, description: e.target.value },
                                }))
                              }
                              disabled={saving}
                              placeholder="Kosongkan untuk deskripsi otomatis..."
                              className="input input-bordered input-sm join-item w-full"
                            />
                            <button
                              onClick={() => handleSimpanSatu(item.student_id)}
                              disabled={saving}
                              className="btn btn-soft btn-violet btn-sm join-item"
                            >
                              <Save className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
          SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
        </p>
      </div>
    </motion.div>
  );
}
