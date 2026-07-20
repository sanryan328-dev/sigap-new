import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  Repeat, LogOut, CheckCircle, XCircle, Eye, X, FileText, Image, Loader2, Lock, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore, selectUserId, selectPicketAccessGranted, selectPicketDay } from '../store/useAuthStore';

interface GuruPiketDashboardProps {
  handleLogout?: () => void;
  onSwitchRole?: () => void;
}

export default function GuruPiketDashboard({ handleLogout: handleLogoutProp, onSwitchRole }: GuruPiketDashboardProps) {
  const profile = useAuthStore((s) => s.profile);
  const userId = useAuthStore(selectUserId);
  const picketAccessGranted = useAuthStore(selectPicketAccessGranted);
  const picketDay = useAuthStore(selectPicketDay);
  const storeLogout = useAuthStore((s) => s.logout);

  const handleLogout = handleLogoutProp ?? storeLogout;
  const [subMenuPiket, setSubMenuPiket] = useState<'validasi_absen' | 'radar_piket' | null>(null);
  const [loading, setLoading] = useState(false);

  // State Data Master
  const [listProfiles, setListProfiles] = useState<any[]>([]);
  const [listStudents, setListStudents] = useState<any[]>([]);

  // State Validasi Izin (ACC)
  const [listAbsenGuru, setListAbsenGuru] = useState<any[]>([]);
  const [fileModal, setFileModal] = useState<{ url: string; nama: string } | null>(null);
  const [verifLoading, setVerifLoading] = useState<string | null>(null);

  // State Radar Harian
  const [radarSiswaAbsen, setRadarSiswaAbsen] = useState<any[]>([]);
  const [radarGuruIzin, setRadarGuruIzin] = useState<any[]>([]);
  const [radarGuruKosong, setRadarGuruKosong] = useState<any[]>([]);

  // State Notifikasi BK
  const [bkNotifications, setBkNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchDataMaster();
    fetchBkNotification();
  }, []);

  useEffect(() => {
    if (subMenuPiket === 'validasi_absen' || subMenuPiket === null) {
      fetchPengajuanIzin();
    }
    if (subMenuPiket === 'radar_piket') {
      fetchRadarHarian();
    }
  }, [subMenuPiket, listProfiles, listStudents]);

  // ==========================================
  // 📥 FETCH DATA MASTER (Untuk Pencocokan Nama)
  // ==========================================
  const fetchDataMaster = async () => {
    const { data: profiles } = await supabase.from('profiles').select('user_id, nama_lengkap');
    if (profiles) setListProfiles(profiles);

    const { data: students } = await supabase.from('students').select('id, nama_siswa, kelas');
    if (students) setListStudents(students);
  };

  // ==========================================
  // 🚨 NOTIFIKASI GURU BK (SEDANG MENANGANI KASUS)
  // ==========================================
  const fetchBkNotification = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('teacher_absences')
        .select('*, profiles(nama_lengkap)')
        .eq('tanggal_absen', todayStr)
        .ilike('alasan_detail', 'NOTIFIKASI: Sedang Menangani Kasus%');
      setBkNotifications(data || []);
    } catch (err) {
      console.error('Gagal memuat notifikasi BK:', err);
    }
  };

  // ==========================================
  // 📋 FITUR 1: ACC / VALIDASI IZIN PENDIDIK
  // ==========================================
  const fetchPengajuanIzin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teacher_absences')
        .select('*, profiles(nama_lengkap)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListAbsenGuru(data || []);
    } catch (err: any) {
      console.error("Gagal memuat izin guru:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifikasiAbsen = async (id: string, status: string) => {
    setVerifLoading(id);
    try {
      const { error } = await supabase
        .from('teacher_absences')
        .update({ status_verifikasi: status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      const label = status === 'diverifikasi_piket' ? 'disetujui' : 'ditolak';
      toast.success(`Izin berhasil ${label}!`);
      fetchPengajuanIzin();
    } catch (err: any) {
      toast.error(`Gagal: ${err.message}`);
    } finally {
      setVerifLoading(null);
    }
  };

  // ==========================================
  // 📡 FITUR 2: RADAR PIKET (LOGIKA OTOMATIS)
  // ==========================================
  const fetchRadarHarian = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();

      // --- LOGIKA A: TARIK SISWA ABSEN DARI JAM PERTAMA ---
      const { data: jurnalHariIni } = await supabase
        .from('teaching_journals')
        .select('id, user_id, kelas, created_at')
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('created_at', { ascending: true });

      let jurnalPertamaMap: { [key: string]: any } = {};
      let guruHadirIds: number[] = [];

      if (jurnalHariIni) {
        jurnalHariIni.forEach((j: any) => {
          // Kumpulkan ID guru yang sudah mengisi jurnal hari ini (Guru Hadir)
          if (!guruHadirIds.includes(j.user_id)) guruHadirIds.push(j.user_id);
          // Ambil jurnal paling awal per kelas
          if (!jurnalPertamaMap[j.kelas]) jurnalPertamaMap[j.kelas] = j.id;
        });
      }

      const idJurnalPertamaArray = Object.values(jurnalPertamaMap);

      if (idJurnalPertamaArray.length > 0 && listStudents.length > 0) {
        const { data: absenSiswaData } = await supabase
          .from('student_attendances')
          .select('student_id, status, teaching_journal_id')
          .in('teaching_journal_id', idJurnalPertamaArray)
          .neq('status', 'Hadir'); // Ambil yang TDK HADIR saja

        if (absenSiswaData) {
          const mappedSiswa = absenSiswaData.map((a: any) => {
            const mhs = listStudents.find(s => s.id === a.student_id);
            return {
              nama: mhs?.nama_siswa || 'Siswa',
              kelas: mhs?.kelas || '?',
              status: a.status
            };
          });
          setRadarSiswaAbsen(mappedSiswa);
        }
      } else {
        setRadarSiswaAbsen([]);
      }

      // --- LOGIKA B: TARIK GURU IZIN & GURU KOSONG ---
      const { data: izinHariIniData } = await supabase
        .from('teacher_absences')
        .select('user_id, status_izin, status_verifikasi, alasan_detail, titipan_tugas_kelas')
        .eq('tanggal_absen', todayString);

      let guruIzinHariIni: any[] = [];
      let guruIzinIds: number[] = [];

      if (izinHariIniData && listProfiles.length > 0) {
        guruIzinHariIni = izinHariIniData.map((izin: any) => {
          guruIzinIds.push(izin.user_id);
          const p = listProfiles.find(x => x.user_id === izin.user_id);
          return { ...izin, nama_guru: p?.nama_lengkap || 'Pendidik' };
        });
        setRadarGuruIzin(guruIzinHariIni);
      }

      // Guru Kosong = Ada di profiles, tapi TIDAK ada di guruHadirIds dan TIDAK ada di guruIzinIds
      // (Asumsi: Anggap semua profil selain BK/Admin/Piket wajib terdeteksi. Untuk amannya, 
      // kita periksa semua user_id di profiles yang belum ada laporannya).
      if (listProfiles.length > 0) {
        const missingTeachers = listProfiles.filter(p => 
          !guruHadirIds.includes(p.user_id) && !guruIzinIds.includes(p.user_id)
        );
        // Hapus diri sendiri (Guru Piket) dari daftar merah
        const filteredMissing = missingTeachers.filter(p => p.user_id !== parseInt(userId));
        setRadarGuruKosong(filteredMissing);
      }

    } catch (err: any) {
      console.error("Gagal memuat radar piket:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Kalkulasi Menu Utama
  const antreanACC = listAbsenGuru.filter(a => a.status_verifikasi === 'pending').length;
  const statusLabels: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'badge badge-soft badge-warning' },
    diverifikasi_piket: { label: 'Disetujui', className: 'badge badge-soft badge-success' },
    ditolak: { label: 'Ditolak', className: 'badge badge-soft badge-error' },
  };
  const izinLabels: Record<string, string> = {
    sakit: 'Sakit',
    tugas_dinas: 'Izin Dinas',
    izin_keperluan: 'Keperluan Mendesak',
  };

  // ==========================================
  // 📋 SUB-MENU 1: VALIDASI IZIN GURU (ACC)
  // ==========================================
  if (subMenuPiket === 'validasi_absen') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center w-full">
        <div className="w-full max-w-5xl space-y-4">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-100">
            <div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Meja Piket
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-1">Persetujuan Izin Guru Hari Ini</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                <span className="font-semibold text-amber-600">{antreanACC}</span> pengajuan pending &mdash; verifikasi segera
              </p>
            </div>
            <button
              onClick={() => setSubMenuPiket(null)}
              className="btn btn-ghost btn-sm text-slate-600"
            >
              <X className="size-4" />
              Kembali
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
            <table className="table table-sm w-full">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th>Tanggal</th>
                  <th>Nama Guru</th>
                  <th>Jenis Izin</th>
                  <th>Alasan &amp; Tugas</th>
                  <th>Bukti</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-slate-400">
                      <Loader2 className="size-5 animate-spin inline-block mr-2" />
                      Memuat data pengajuan izin...
                    </td>
                  </tr>
                ) : listAbsenGuru.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-slate-400">
                      Belum ada pengajuan izin.
                    </td>
                  </tr>
                ) : (
                  listAbsenGuru.map((absen) => {
                    const statusInfo = statusLabels[absen.status_verifikasi] || statusLabels.pending;
                    const namaGuru = absen.profiles?.nama_lengkap || 'Guru Tidak Ditemukan';
                    return (
                      <tr key={absen.id} className="hover:bg-slate-50/50">
                        <td className="font-mono text-sm text-slate-500">{absen.tanggal_absen}</td>
                        <td className="font-semibold text-slate-900 text-sm">{namaGuru}</td>
                        <td>
                          <span className="badge badge-soft badge-info badge-sm">
                            {izinLabels[absen.status_izin] || absen.status_izin}
                          </span>
                        </td>
                        <td className="max-w-xs">
                          <div className="text-sm text-slate-700 line-clamp-2">{absen.alasan_detail}</div>
                          {absen.titipan_tugas_kelas && (
                            <div className="text-[10px] text-blue-600 mt-0.5 italic truncate">
                              Tugas: {absen.titipan_tugas_kelas}
                            </div>
                          )}
                        </td>
                        <td>
                          {absen.file_surat_keterangan ? (
                            <button
                              onClick={() => setFileModal({
                                url: absen.file_surat_keterangan,
                                nama: namaGuru,
                              })}
                              className="btn btn-ghost btn-xs gap-1 text-blue-600"
                            >
                              <Eye className="size-3.5" />
                              Lihat
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">-</span>
                          )}
                        </td>
                        <td>
                          <span className={statusInfo.className}>{statusInfo.label}</span>
                        </td>
                        <td className="text-center">
                          {absen.status_verifikasi === 'pending' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleVerifikasiAbsen(absen.id, 'diverifikasi_piket')}
                                disabled={verifLoading === absen.id}
                                className="btn btn-soft btn-success btn-xs gap-1"
                              >
                                {verifLoading === absen.id ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="size-3.5" />
                                )}
                                Setujui
                              </button>
                              <button
                                onClick={() => handleVerifikasiAbsen(absen.id, 'ditolak')}
                                disabled={verifLoading === absen.id}
                                className="btn btn-soft btn-error btn-xs gap-1"
                              >
                                {verifLoading === absen.id ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <XCircle className="size-3.5" />
                                )}
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Selesai</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Lihat Bukti */}
        <dialog
          className={`modal ${fileModal ? 'modal-open' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) setFileModal(null); }}
        >
          <div className="modal-box max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <FileText className="size-4 text-blue-600" />
                Bukti Surat Izin &mdash; {fileModal?.nama}
              </h3>
              <button onClick={() => setFileModal(null)} className="btn btn-ghost btn-xs btn-square">
                <X className="size-4" />
              </button>
            </div>
            {fileModal?.url.endsWith('.pdf') ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <FileText className="size-16 text-rose-500" />
                <p className="text-sm text-slate-600">File PDF</p>
                <a
                  href={fileModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <Eye className="size-4" />
                  Buka PDF
                </a>
              </div>
            ) : (
              <div className="flex justify-center">
                <img
                  src={fileModal?.url}
                  alt="Bukti Surat Izin"
                  className="max-h-96 rounded-lg object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <div className="fallback hidden flex-col items-center gap-3 py-6">
                  <Image className="size-16 text-slate-300" />
                  <p className="text-sm text-slate-500">Gambar tidak dapat dimuat</p>
                  <a
                    href={fileModal?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Eye className="size-4" />
                    Buka di Tab Baru
                  </a>
                </div>
              </div>
            )}
            <div className="modal-action">
              <button onClick={() => setFileModal(null)} className="btn btn-ghost btn-sm">Tutup</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setFileModal(null)}>close</button>
          </form>
        </dialog>
      </div>
    );
  }

  // ==========================================
  // 📡 SUB-MENU 2: RADAR PIKET (SISWA & GURU)
  // ==========================================
  if (subMenuPiket === 'radar_piket') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center w-full">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Live Monitoring
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-1">Radar Kehadiran Harian</h2>
            </div>
            <button onClick={() => setSubMenuPiket(null)} className="text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium cursor-pointer">
              ⬅️ Kembali
            </button>
          </div>

          {loading ? (
             <div className="text-center p-8 text-sm text-indigo-600 font-bold animate-pulse">Memindai data kehadiran seluruh sekolah...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* KOLOM KIRI: SISWA TIDAK HADIR */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800">📉 Siswa Tidak Hadir (Dari Jam Pertama)</h3>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{radarSiswaAbsen.length} Anak</span>
                </div>
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <tr><th className="p-3">Kelas</th><th className="p-3">Nama Siswa</th><th className="p-3 text-center">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {radarSiswaAbsen.length === 0 ? (
                      <tr><td colSpan={3} className="p-6 text-center text-slate-400 italic">Semua siswa terpantau hadir / Jurnal jam pertama belum diisi.</td></tr>
                    ) : (
                      radarSiswaAbsen.map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">{s.kelas}</td>
                          <td className="p-3 font-medium">{s.nama}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.status === 'Sakit' ? 'bg-amber-100 text-amber-700' :
                              s.status === 'Izin' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>{s.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* KOLOM KANAN: STATUS GURU */}
              <div className="space-y-6">
                
                {/* Guru Izin (Kuning) */}
                <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-amber-50 p-3 border-b border-amber-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-amber-900">🟨 Pendidik Izin / Halangan Hari Ini</h3>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">{radarGuruIzin.length} Guru</span>
                  </div>
                  <ul className="divide-y divide-amber-100/50 text-sm">
                    {radarGuruIzin.length === 0 ? (
                      <li className="p-4 text-center text-amber-600/70 italic">Tidak ada guru yang izin hari ini.</li>
                    ) : (
                      radarGuruIzin.map((g, idx) => (
                        <li key={idx} className="p-3 hover:bg-amber-50/50">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-amber-900">{g.nama_guru}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-1.5 rounded">{g.status_izin}</span>
                          </div>
                          {g.titipan_tugas_kelas && <div className="mt-1 text-[10px] text-amber-700 font-medium line-clamp-1">Tugas: {g.titipan_tugas_kelas}</div>}
                          <div className="mt-1 text-[10px] text-slate-400">Status ACC: {g.status_verifikasi === 'pending' ? 'Belum' : 'Sudah'}</div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Guru Kosong/Warning (Merah) */}
                <div className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-red-50 p-3 border-b border-red-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-red-900">🟥 Indikasi Kelas Kosong (Belum Absen/Jurnal)</h3>
                    <span className="text-[10px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">{radarGuruKosong.length} Guru</span>
                  </div>
                  <ul className="divide-y divide-red-100/50 text-sm max-h-60 overflow-y-auto">
                    {radarGuruKosong.length === 0 ? (
                      <li className="p-4 text-center text-red-500/70 italic">Aman. Semua guru terdeteksi sudah mengisi jurnal atau izin.</li>
                    ) : (
                      radarGuruKosong.map((g, idx) => (
                        <li key={idx} className="p-3 flex justify-between items-center hover:bg-red-50/50">
                          <span className="font-bold text-slate-700">{g.nama_lengkap}</span>
                          <span className="text-[10px] text-red-600 font-medium animate-pulse">Menunggu Laporan...</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* ── Grafik Visualisasi Radar ── */}
          {!loading && (() => {
            const STATUS_WARNA = [
              { key: 'Sakit', color: '#F59E0B' },
              { key: 'Izin', color: '#3B82F6' },
              { key: 'Alpha', color: '#EF4444' },
            ];

            const dataStatus = STATUS_WARNA.map(s => ({
              name: s.key,
              value: radarSiswaAbsen.filter(rsa => rsa.status === s.key).length,
              color: s.color,
            })).filter(d => d.value > 0);

            const kelasSet = new Set(radarSiswaAbsen.map(s => s.kelas));
            const dataPerKelas = Array.from(kelasSet)
              .map(kelas => ({
                kelas,
                Sakit: radarSiswaAbsen.filter(s => s.kelas === kelas && s.status === 'Sakit').length,
                Izin: radarSiswaAbsen.filter(s => s.kelas === kelas && s.status === 'Izin').length,
                Alpha: radarSiswaAbsen.filter(s => s.kelas === kelas && s.status === 'Alpha').length,
              }))
              .sort((a, b) => (b.Sakit + b.Izin + b.Alpha) - (a.Sakit + a.Izin + a.Alpha));

            return (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* PieChart — Status Ketidakhadiran */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body gap-3">
                    <h3 className="card-title text-sm">Status Ketidakhadiran Siswa</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={dataStatus}
                          cx="50%" cy="50%"
                          innerRadius={46}
                          outerRadius={78}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {dataStatus.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                        />
                        <Legend
                          iconType="circle"
                          formatter={(value) => (
                            <span className="text-sm text-base-content/70">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* BarChart — Per Kelas */}
                <div className="card bg-base-100 shadow-sm">
                  <div className="card-body gap-3">
                    <h3 className="card-title text-sm">Ketidakhadiran per Kelas</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={dataPerKelas} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="kelas"
                          tick={{ fontSize: 10, fill: '#64748b' }}
                        />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                        />
                        <Legend
                          iconType="rect"
                          formatter={(value) => (
                            <span className="text-sm text-base-content/70">{value}</span>
                          )}
                        />
                        <Bar dataKey="Sakit" stackId="a" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="Izin" stackId="a" fill="#3B82F6" />
                        <Bar dataKey="Alpha" stackId="a" fill="#EF4444" radius={[0, 0, 2, 2]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // ==========================================
  // 📊 MENU UTAMA DASHBOARD GURU PIKET
  // ==========================================
  if (!picketAccessGranted) {
    const todayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-4"
      >
        <div className="w-full max-w-lg space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Panel Kendali Guru Piket
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1.5">{profile?.nama_lengkap}</h2>
            </div>
            <div className="flex items-center gap-2">
              {onSwitchRole && (
                <button onClick={onSwitchRole} className="btn btn-soft btn-primary btn-sm">
                  <Repeat className="size-3" />
                  Beralih Peran
                </button>
              )}
              <button onClick={handleLogout} className="btn btn-ghost btn-sm text-red-600">
                <LogOut className="size-4" /> Keluar
              </button>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="alert alert-soft alert-error shadow-lg"
          >
            <Lock className="size-6 shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Akses Ditolak</h3>
              <div className="text-sm leading-relaxed">
                Panel verifikasi hanya dapat dibuka pada hari jadwal piket Anda.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card border border-slate-200/60 bg-white shadow-sm"
          >
            <div className="card-body items-center text-center gap-3 py-8">
              <div className="flex size-16 items-center justify-center rounded-full bg-amber-50">
                <Calendar className="size-8 text-amber-500" />
              </div>
              <h3 className="card-title text-sm text-slate-800">Hari ini: {todayName}</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Jadwal piket Anda: <strong className="text-slate-700">{picketDay || '—'}</strong>.
                {picketDay ? ` Panel verifikasi hanya aktif setiap hari ${picketDay}.` : ' Hubungi admin untuk pengaturan jadwal piket.'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        
        <div className="flex justify-between items-start border-b border-slate-100 pb-5 mb-6">
          <div>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Panel Kendali Guru Piket
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-1.5">{profile?.nama_lengkap}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Antrean Verifikasi Izin: <strong className="text-amber-600">{antreanACC} Pengajuan</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onSwitchRole && (
              <button onClick={onSwitchRole} className="btn btn-soft btn-primary btn-sm btn-xs leading-none">
                <Repeat className="size-3" />
                Beralih Peran
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-ghost btn-sm text-red-600">
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        </div>

        {bkNotifications.length > 0 && bkNotifications.map((notif: any) => (
          <div key={notif.id} className="alert alert-soft alert-warning mb-4 rounded-xl shadow-sm text-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <div>
                <strong>Guru BK {notif.profiles?.nama_lengkap || '—'}</strong> Saat Ini Sedang Menangani Kasus
                <br />
                <span className="text-slate-500">{notif.alasan_detail}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setSubMenuPiket('validasi_absen')} className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="text-xl mb-2 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">📝</div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Persetujuan Izin Guru</h3>
            <p className="text-[11px] text-slate-500 mt-1">Verifikasi permohonan izin/sakit guru yang masuk, lihat bukti surat, dan tinjau titipan tugas.</p>
          </button>

          <button onClick={() => setSubMenuPiket('radar_piket')} className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left group cursor-pointer">
            <div className="text-xl mb-2 p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">📡</div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600">Radar Piket Harian</h3>
            <p className="text-[11px] text-slate-500 mt-1">Pantau otomatis daftar siswa absen jam pertama & cek guru yang belum masuk kelas.</p>
          </button>
        </div>
      </div>
    </div>
  );
}