import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Trophy,
  Save,
  LogOut,
  Plus,
  Trash2,
  BarChart3,
  Repeat,
} from 'lucide-react';
import FormNilaiEkskul from './FormNilaiEkskul';
import EkskulAnalytics from './EkskulAnalytics';
import { useAuthStore } from '../store/useAuthStore';

interface PembinaEkskulProps {
  setCurrentRole: (role: any) => void;
  daftarKelas: string[];
  onSwitchRole?: () => void;
}

const cardHover = {
  whileHover: { scale: 1.02, y: -3 },
  transition: { type: 'spring' as const, stiffness: 350, damping: 18 },
};

export default function PembinaEkskulDashboard({ setCurrentRole, daftarKelas, onSwitchRole }: PembinaEkskulProps) {
  const profile = useAuthStore((s) => s.profile);
  const [subMenu, setSubMenu] = useState<'menu' | 'jurnal' | 'anggota' | 'nilai' | 'analytics'>('menu');
  const [loading, setLoading] = useState(false);
  const [daftarSiswa, setDaftarSiswa] = useState<any[]>([]);
  const [filterKelas, setFilterKelas] = useState(daftarKelas[0] || '');

  const [topik, setTopik] = useState('');
  const [catatan, setCatatan] = useState('');
  const [absensiEkskul, setAbsensiEkskul] = useState<{ [key: string]: string }>({});

  const [anggotaEkskul, setAnggotaEkskul] = useState<any[]>([]);

  useEffect(() => {
    if (subMenu !== 'menu' && filterKelas) {
      fetchSiswaPerKelas();
    }
  }, [filterKelas, subMenu]);

  useEffect(() => {
    if (subMenu === 'anggota' || subMenu === 'nilai') {
      fetchAnggotaEkskul();
    }
  }, [subMenu]);

  const fetchSiswaPerKelas = async () => {
    const { data } = await supabase.from('students').select('id, nama_siswa, nisn, kelas').eq('kelas', filterKelas).order('nama_siswa');
    if (data) setDaftarSiswa(data);
  };

  const fetchAnggotaEkskul = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_ekskul')
      .select('*, students(nama_siswa, kelas, nisn)')
      .eq('nama_ekskul', profile.nama_ekstrakurikuler);
    if (!error && data) {
      setAnggotaEkskul(data);
      const defaultAbsen: any = {};
      data.forEach((item: any) => {
        defaultAbsen[item.student_id] = 'Hadir';
      });
      setAbsensiEkskul(defaultAbsen);
    }
    setLoading(false);
  };

  const handleTambahAnggota = async (studentId: string) => {
    const { error } = await supabase.from('student_ekskul').insert([{
      student_id: studentId,
      nama_ekskul: profile.nama_ekstrakurikuler,
    }]);
    if (!error) {
      toast.success('Berhasil menambahkan anggota!');
      fetchAnggotaEkskul();
    } else {
      toast.error('Siswa sudah terdaftar di ekskul ini.');
    }
  };

  const handleHapusAnggota = async (id: string) => {
    await supabase.from('student_ekskul').delete().eq('id', id);
    toast.success('Anggota berhasil dikeluarkan.');
    fetchAnggotaEkskul();
  };

  const handleSubmitJurnalEkskul = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: jurnal, error } = await supabase.from('teaching_journals').insert([{
        user_id: profile.user_id,
        kelas: 'Ekskul',
        mata_pelajaran: `Ekskul ${profile.nama_ekstrakurikuler}`,
        jam_ke: 'Kegiatan Sore',
        materi_pembelajaran: topik,
        catatan_kelas: catatan,
      }]).select().single();

      if (error) throw error;

      const dataAbsen = anggotaEkskul.map(a => ({
        teaching_journal_id: jurnal.id,
        student_id: a.student_id,
        status: absensiEkskul[a.student_id] || 'Hadir',
      }));
      await supabase.from('student_attendances').insert(dataAbsen);

      toast.success('Jurnal Latihan & Absensi Ekskul berhasil disimpan!');
      setTopik('');
      setCatatan('');
      setSubMenu('menu');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render EkskulAnalytics ──
  if (subMenu === 'analytics') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
      >
        <div className="w-full max-w-4xl space-y-5">
          <div className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md">
            <div className="flex-1 flex-col items-start gap-1">
              <div className="badge badge-soft badge-violet badge-sm uppercase tracking-widest">Dashboard Pembina</div>
              <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                Analitik {profile.nama_ekstrakurikuler}
              </h3>
            </div>
            <div className="flex-none">
              <button onClick={() => setSubMenu('menu')} className="btn btn-ghost btn-sm">
                <ArrowLeft className="size-4" /> Kembali
              </button>
            </div>
          </div>
          <EkskulAnalytics />
          <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
            SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Render FormNilaiEkskul ──
  if (subMenu === 'nilai') {
    return (
      <FormNilaiEkskul
        profile={profile}
        onBack={() => setSubMenu('menu')}
      />
    );
  }

  // ── SUB-MENU: JURNAL ──
  if (subMenu === 'jurnal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
      >
        <div className="w-full max-w-3xl">
          <div className="card border border-violet-200/60 bg-white shadow-lg">
            <div className="card-body gap-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="badge badge-soft badge-violet badge-sm uppercase tracking-widest">Jurnal & Absensi</div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900">Input Jurnal Latihan & Absensi</h3>
                </div>
                <button onClick={() => setSubMenu('menu')} className="btn btn-ghost btn-sm">
                  <ArrowLeft className="size-4" /> Kembali
                </button>
              </div>

              <form onSubmit={handleSubmitJurnalEkskul} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Topik / Materi Latihan</label>
                  <input
                    type="text"
                    value={topik}
                    onChange={(e) => setTopik(e.target.value)}
                    placeholder="Contoh: Teknik Dasar Pasing Bawah"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Catatan Tambahan</label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Kondisi lapangan, hambatan, atau rangkuman aktivitas..."
                    className="textarea textarea-bordered w-full h-20"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="mb-3 text-sm font-bold text-slate-700">
                    Lembar Absensi Anggota ({anggotaEkskul.length} Siswa)
                  </h4>
                  {anggotaEkskul.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-400">
                      Belum ada anggota. Tambahkan anggota terlebih dahulu.
                    </p>
                  ) : (
                    <div className="max-h-72 divide-y overflow-y-auto rounded-box border">
                      {anggotaEkskul.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 text-sm hover:bg-slate-50">
                          <div>
                            <p className="font-semibold text-slate-800">{item.students?.nama_siswa}</p>
                            <p className="text-[10px] text-slate-500">Kelas {item.students?.kelas}</p>
                          </div>
                          <div className="flex gap-1">
                            {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setAbsensiEkskul({ ...absensiEkskul, [item.student_id]: st })}
                                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold cursor-pointer ${
                                  absensiEkskul[item.student_id] === st
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || anggotaEkskul.length === 0}
                  className="btn btn-soft btn-violet w-full"
                >
                  <Save className="size-4" />
                  {loading ? 'Menyimpan...' : 'Simpan Jurnal & Absensi'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── SUB-MENU: ANGGOTA ──
  if (subMenu === 'anggota') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
      >
        <div className="w-full max-w-4xl">
          <div className="card border border-violet-200/60 bg-white shadow-lg">
            <div className="card-body gap-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="badge badge-soft badge-violet badge-sm uppercase tracking-widest">Anggota Ekskul</div>
                  <h3 className="mt-1 text-sm font-bold text-slate-900">{profile.nama_ekstrakurikuler}</h3>
                  <p className="text-[11px] text-slate-500">Total terdaftar: {anggotaEkskul.length} Siswa</p>
                </div>
                <button onClick={() => setSubMenu('menu')} className="btn btn-ghost btn-sm">
                  <ArrowLeft className="size-4" /> Kembali
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="card border border-slate-200 bg-slate-50">
                  <div className="card-body gap-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Plus className="size-3.5" />
                      Tambah Anggota Baru
                    </h4>
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-500">Cari Kelas Rombel</label>
                      <select
                        value={filterKelas}
                        onChange={(e) => setFilterKelas(e.target.value)}
                        className="select select-bordered select-sm w-full"
                      >
                        {daftarKelas.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div className="max-h-52 divide-y overflow-y-auto rounded-box border bg-white">
                      {daftarSiswa.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-2 text-[11px]">
                          <span className="max-w-[130px] truncate font-medium text-slate-700">{s.nama_siswa}</span>
                          <button
                            onClick={() => handleTambahAnggota(s.id)}
                            className="btn btn-soft btn-primary btn-xs"
                          >
                            Pilih
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto md:col-span-2">
                  <table className="table table-sm w-full">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                        <th>Nama Siswa</th>
                        <th>Kelas</th>
                        <th>NISN</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anggotaEkskul.length === 0 ? (
                        <tr><td colSpan={4} className="py-8 text-center text-sm text-slate-400">Belum ada anggota.</td></tr>
                      ) : (
                        anggotaEkskul.map((item) => (
                          <tr key={item.id} className="hover">
                            <td className="font-semibold text-slate-800">{item.students?.nama_siswa}</td>
                            <td className="text-slate-600">{item.students?.kelas}</td>
                            <td className="font-mono text-slate-600">{item.students?.nisn}</td>
                            <td className="text-center">
                              <button
                                onClick={() => handleHapusAnggota(item.id)}
                                className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── MENU UTAMA ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
    >
      <div className="w-full max-w-2xl space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md"
        >
          <div className="flex-1 flex-col items-start gap-1">
            <div className="badge badge-soft badge-violet badge-sm uppercase tracking-widest">Dashboard Pembina</div>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {profile.nama_ekstrakurikuler}
            </h2>
            <p className="text-sm font-medium text-slate-500">{profile.nama_lengkap}</p>
          </div>
          <div className="flex-none gap-2">
            {onSwitchRole && (
              <button onClick={onSwitchRole} className="btn btn-soft btn-primary btn-sm">
                <Repeat className="size-3.5" />
                Beralih Peran
              </button>
            )}
            <button onClick={() => setCurrentRole(null)} className="btn btn-ghost btn-sm">
              <LogOut className="size-4" />
              Kembali
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.button
            {...cardHover}
            onClick={() => setSubMenu('jurnal')}
            className="card border border-violet-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-violet-500 cursor-pointer"
          >
            <div className="card-body items-center gap-3 text-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm ring-1 ring-violet-500/20">
                <BookOpen className="size-5" />
              </div>
              <h4 className="card-title text-sm text-slate-900">Jurnal & Absen</h4>
              <p className="text-sm leading-relaxed text-slate-500">
                Catat topik latihan dan presensi anggota ekskul.
              </p>
            </div>
          </motion.button>

          <motion.button
            {...cardHover}
            onClick={() => setSubMenu('anggota')}
            className="card border border-violet-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-violet-500 cursor-pointer"
          >
            <div className="card-body items-center gap-3 text-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm ring-1 ring-violet-500/20">
                <Users className="size-5" />
              </div>
              <h4 className="card-title text-sm text-slate-900">Anggota Ekskul</h4>
              <p className="text-sm leading-relaxed text-slate-500">
                Kelola daftar anggota dan tambah siswa baru.
              </p>
            </div>
          </motion.button>

          <motion.button
            {...cardHover}
            onClick={() => setSubMenu('nilai')}
            className="card border border-violet-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-violet-500 cursor-pointer"
          >
            <div className="card-body items-center gap-3 text-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm ring-1 ring-violet-500/20">
                <Trophy className="size-5" />
              </div>
              <h4 className="card-title text-sm text-slate-900">Penilaian</h4>
              <p className="text-sm leading-relaxed text-slate-500">
                Input nilai kualitatif dan deskripsi capaian siswa.
              </p>
            </div>
          </motion.button>

          <motion.button
            {...cardHover}
            onClick={() => setSubMenu('analytics')}
            className="card border border-violet-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-violet-500 cursor-pointer"
          >
            <div className="card-body items-center gap-3 text-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm ring-1 ring-violet-500/20">
                <BarChart3 className="size-5" />
              </div>
              <h4 className="card-title text-sm text-slate-900">Analitik Ekskul</h4>
              <p className="text-sm leading-relaxed text-slate-500">
                Grafik tren kehadiran, sebaran anggota, dan capaian nilai.
              </p>
            </div>
          </motion.button>
        </div>

        <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
          SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
        </p>
      </div>
    </motion.div>
  );
}
