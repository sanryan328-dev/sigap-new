import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  LogOut,
  Satellite,
  AlertTriangle,
  Backpack,
  Home,
  Trophy,
  BarChart3,
  FileText,
  Loader2,
  ScrollText,
  ClipboardCheck,
  Users,
  Star,
  CalendarX,
} from 'lucide-react';
import ModalUnduh from './ModalUnduh';
import OnlineStatus from './OnlineStatus';
import FormPengajuanIzin from './FormPengajuanIzin';
import { useAuthStore, selectIsPiket, selectIsGureBK } from '../store/useAuthStore';
import type { MapelEntry } from '../store/useAuthStore';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { toast } from 'sonner';

interface DashboardMenuProps {
  setCurrentRole: (role: 'guru_mapel' | 'wali_kelas' | 'pembina_ekskul' | 'guru_piket' | 'guru_bk' | null) => void;
  handleLogout: () => void;
  daftarKelas?: string[];
}

const cardHover = {
  whileHover: { scale: 1.02, y: -3 },
  transition: { type: 'spring' as const, stiffness: 350, damping: 18 },
};

export default function DashboardMenu({ setCurrentRole, handleLogout, daftarKelas = [] }: DashboardMenuProps) {
  const profile = useAuthStore((s) => s.profile);
  const isPiket = useAuthStore(selectIsPiket);
  const isGureBK = useAuthStore(selectIsGureBK);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [modalJenis, setModalJenis] = useState<'nilai' | 'jurnal' | 'bk' | null>(null);
  const [showFormIzin, setShowFormIzin] = useState(false);
  const { pendingCount, syncing, syncNow } = useOfflineSync();

  const mataPelajaranData: MapelEntry[] = useMemo(() => {
    if (profile?.mata_pelajaran && Array.isArray(profile.mata_pelajaran)) {
      return profile.mata_pelajaran.filter((e: any) => e?.mapel?.trim());
    }
    if (profile?.mapel) {
      return [{ mapel: profile.mapel, kelas: [] }];
    }
    return [];
  }, [profile]);

  const ekstrakBobotDariTeks = (detailTeks: string): number => {
    if (!detailTeks) return 0;
    const match = detailTeks.match(/\[Bobot Poin:\s*(\d+)\]/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  };

  const handleDownloadBKPDF = async () => {
    if (!profile) return;
    setLoadingDownload(true);

    try {
      let query = supabase.from('bk_records').select('*');
      if (!isGureBK && profile.is_wali_kelas && profile.kelas_wali) {
        query = query.eq('kelas', profile.kelas_wali);
      }
      const { data: bkData, error: bkError } = await query.order('created_at', { ascending: true });
      if (bkError) throw bkError;

      if (!bkData || bkData.length === 0) {
        toast.error('Belum ada data rekap catatan kasus BK di sistem.');
        return;
      }

      const { data: studentsData, error: studentError } = await supabase.from('students').select('id, nama_siswa');
      if (studentError) throw studentError;

      const groupedSiswa: { [key: string]: any } = {};

      bkData.forEach((d: any) => {
        const matchStudent = studentsData?.find(s => String(s.id) === String(d.student_id));
        const namaSiswa = matchStudent ? matchStudent.nama_siswa : (d.nama_siswa || 'Siswa Hilang');

        let poinBobot = Number(d.bobot || d.bobot_pelanggaran || 0);
        if (poinBobot === 0 && d.detail_kasus) {
          poinBobot = ekstrakBobotDariTeks(d.detail_kasus);
        }

        const tglStr = new Date(d.created_at).toLocaleDateString('id-ID');

        if (!groupedSiswa[namaSiswa]) {
          groupedSiswa[namaSiswa] = {
            nama: namaSiswa,
            kelas: d.kelas || '-',
            kasusList: [`1. [${tglStr}] ${d.detail_kasus || d.kategori_kasus}`],
            penangananList: [d.tindakan_penanganan ? `1. ${d.tindakan_penanganan}` : ''],
            totalBobot: poinBobot,
            statusTerakhir: d.status,
          };
        } else {
          const idx = groupedSiswa[namaSiswa].kasusList.length + 1;
          groupedSiswa[namaSiswa].kasusList.push(`${idx}. [${tglStr}] ${d.detail_kasus || d.kategori_kasus}`);
          if (d.tindakan_penanganan) {
            groupedSiswa[namaSiswa].penangananList.push(`${idx}. ${d.tindakan_penanganan}`);
          }
          groupedSiswa[namaSiswa].totalBobot += poinBobot;
          groupedSiswa[namaSiswa].statusTerakhir = d.status;
        }
      });

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('LAPORAN AKUMULASI POIN & KASUS BK SISWA', 14, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Dicetak Oleh  : ${profile.nama_lengkap}`, 14, 27);
      doc.text(`Hak Akses     : ${isGureBK ? 'Guru Bimbingan Konseling (BK)' : `Wali Kelas ${profile.kelas_wali}`}`, 14, 32);
      doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString('id-ID')}`, 14, 37);

      doc.setDrawColor(200, 200, 200);
      doc.line(14, 42, 196, 42);

      const tableColumn = ['No', 'Kelas', 'Nama Siswa', 'Daftar Histori Kasus Pelanggaran', 'Tindakan Penanganan', 'Total Bobot', 'Status'];

      const tableRows = Object.values(groupedSiswa).map((s: any, index: number) => [
        index + 1,
        s.kelas,
        s.nama,
        s.kasusList.join('\n'),
        s.penangananList.filter((p: string) => p !== '').join('\n') || '-',
        `${s.totalBobot} Poin`,
        s.statusTerakhir,
      ]);

      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 47,
        theme: 'grid',
        headStyles: { fillColor: [190, 24, 74], fontStyle: 'bold' },
        styles: { fontSize: 8, overflow: 'linebreak', valign: 'top' },
        columnStyles: {
          2: { cellWidth: 35 },
          3: { cellWidth: 60 },
          4: { cellWidth: 40 },
        },
      });

      const namaFile = isGureBK ? 'Laporan_Akumulasi_BK_Sekolah' : `Laporan_Akumulasi_BK_Kelas_${profile.kelas_wali}`;
      doc.save(`${namaFile}.pdf`);

    } catch (err: any) {
      toast.error(`Gagal mengunduh PDF: ${err.message}`);
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleDownload = async (
    jenis: 'jurnal' | 'nilai' | 'bk' | 'ekskul_jurnal' | 'ekskul_anggota' | 'ekskul_nilai',
    filters?: { bulan?: string; kelas?: string; mapel?: string },
  ) => {
    if (!profile) return;
    setLoadingDownload(true);

    const filterBulan = (tglStr: string) => {
      if (!filters?.bulan) return true;
      const d = new Date(tglStr);
      const bulanAngka = d.getMonth(); // 0-11
      const namaBulan = [
        'Januari','Februari','Maret','April','Mei','Juni',
        'Juli','Agustus','September','Oktober','November','Desember',
      ][bulanAngka];
      return namaBulan === filters.bulan;
    };

    try {
      let dataToExport: any[] = [];
      let fileName = `Rekap_${jenis}_${profile.nama_lengkap.replace(/[^a-zA-Z0-9]/g, '_')}`;

      if (jenis === 'jurnal') {
        let queryJurnal = supabase.from('teaching_journals').select('*').eq('user_id', profile.user_id);
        if (filters?.mapel) queryJurnal = queryJurnal.eq('mata_pelajaran', filters.mapel);
        if (filters?.kelas) queryJurnal = queryJurnal.eq('kelas', filters.kelas);
        const { data, error } = await queryJurnal.order('created_at', { ascending: false });
        if (error) throw error;
        dataToExport = data
          .filter((d: any) => filterBulan(d.created_at))
          .map((d: any) => ({
          'Tanggal': new Date(d.created_at).toLocaleDateString('id-ID'),
          'Kelas': d.kelas,
          'Mata Pelajaran': d.mata_pelajaran,
          'Jam Ke': d.jam_ke,
          'Materi Pembelajaran': d.materi_pembelajaran,
          'Catatan / Log': d.catatan_kelas || '-',
        }));

      } else if (jenis === 'nilai') {
        const { data, error } = await supabase.from('student_scores').select('*').eq('user_id', profile.user_id).order('created_at', { ascending: false });
        if (error) throw error;
        dataToExport = data
          .filter((d: any) => {
            if (filters?.mapel && d.mapel !== filters.mapel) return false;
            if (filters?.kelas && d.kelas !== filters.kelas) return false;
            return true;
          })
          .map((d: any) => ({
          'Tanggal Input': new Date(d.created_at).toLocaleDateString('id-ID'),
          'Kelas': d.kelas,
          'Mata Pelajaran': d.mapel,
          'Jenis Penilaian': d.jenis_penilaian,
          'Nilai': d.nilai,
        }));

      } else if (jenis === 'bk') {
        let query = supabase.from('bk_records').select('*');
        if (!isGureBK && profile.is_wali_kelas) {
          query = query.eq('kelas', profile.kelas_wali);
        }

        const { data: bkData, error: bkError } = await query.order('created_at', { ascending: true });
        if (bkError) throw bkError;

        const { data: studentsData, error: studentError } = await supabase.from('students').select('id, nama_siswa');
        if (studentError) throw studentError;

        const filteredBk = bkData.filter((d: any) => {
          if (filters?.kelas && d.kelas !== filters.kelas) return false;
          if (!filterBulan(d.created_at)) return false;
          return true;
        });

        const excelGroup: { [key: string]: any } = {};

        filteredBk.forEach((d: any) => {
          const matchStudent = studentsData?.find(s => String(s.id) === String(d.student_id));
          const namaSiswa = matchStudent ? matchStudent.nama_siswa : (d.nama_siswa || 'Siswa Hilang');

          let pBobot = Number(d.bobot || d.bobot_pelanggaran || 0);
          if (pBobot === 0 && d.detail_kasus) {
            pBobot = ekstrakBobotDariTeks(d.detail_kasus);
          }

          const tglStr = new Date(d.created_at).toLocaleDateString('id-ID');

          if (!excelGroup[namaSiswa]) {
            excelGroup[namaSiswa] = {
              'Kelas': d.kelas,
              'Nama Siswa': namaSiswa,
              'Histori Kasus Pelanggaran': `1. [${tglStr}] ${d.detail_kasus || d.kategori_kasus}`,
              'Tindakan Penanganan': d.tindakan_penanganan ? `1. ${d.tindakan_penanganan}` : '-',
              'Akumulasi Poin (Total)': pBobot,
              'Status Terakhir': d.status,
            };
          } else {
            const currentRowsCount = excelGroup[namaSiswa]['Histori Kasus Pelanggaran'].split('\n').length + 1;
            excelGroup[namaSiswa]['Histori Kasus Pelanggaran'] += `\n${currentRowsCount}. [${tglStr}] ${d.detail_kasus || d.kategori_kasus}`;
            if (d.tindakan_penanganan) {
              if (excelGroup[namaSiswa]['Tindakan Penanganan'] === '-') excelGroup[namaSiswa]['Tindakan Penanganan'] = '';
              excelGroup[namaSiswa]['Tindakan Penanganan'] += `\n${currentRowsCount}. ${d.tindakan_penanganan}`;
            }
            excelGroup[namaSiswa]['Akumulasi Poin (Total)'] += pBobot;
            excelGroup[namaSiswa]['Status Terakhir'] = d.status;
          }
        });

        dataToExport = Object.values(excelGroup);
        const labelKelas = filters?.kelas ? `_Kelas_${filters.kelas}` : isGureBK ? '_Semua_Siswa' : `_Kelas_${profile.kelas_wali}`;
        fileName = `Akumulasi_BK${labelKelas}`;

      } else if (jenis === 'ekskul_jurnal') {
        const { data, error } = await supabase.from('teaching_journals').select('*').eq('user_id', profile.user_id).ilike('mata_pelajaran', '%Ekskul%').order('created_at', { ascending: false });
        if (error) throw error;
        dataToExport = data.map((d: any) => ({
          'Tanggal Latihan': new Date(d.created_at).toLocaleDateString('id-ID'),
          'Ekstrakurikuler': d.mata_pelajaran,
          'Topik / Kegiatan': d.materi_pembelajaran,
          'Catatan Evaluasi': d.catatan_kelas || '-',
        }));
        fileName = `Rekap_Jurnal_Ekskul_${profile.nama_ekstrakurikuler}`;

      } else if (jenis === 'ekskul_anggota') {
        const { data, error } = await supabase.from('student_ekskul').select('*, students(nama_siswa, kelas, nisn)').eq('nama_ekskul', profile.nama_ekstrakurikuler);
        if (error) throw error;
        dataToExport = data.map((d: any) => ({
          'Nama Siswa': d.students?.nama_siswa,
          'Kelas Rombel': d.students?.kelas,
          'NISN': d.students?.nisn,
          'Nama Ekstrakurikuler': d.nama_ekskul,
          'Tanggal Bergabung': new Date(d.created_at).toLocaleDateString('id-ID'),
        }));
        fileName = `Daftar_Anggota_Ekskul_${profile.nama_ekstrakurikuler}`;

      } else if (jenis === 'ekskul_nilai') {
        const { data, error } = await supabase.from('student_ekskul').select('*, students(nama_siswa, kelas, nisn)').eq('nama_ekskul', profile.nama_ekstrakurikuler);
        if (error) throw error;
        dataToExport = data.map((d: any) => ({
          'Nama Siswa': d.students?.nama_siswa,
          'Kelas': d.students?.kelas,
          'NISN': d.students?.nisn,
          'Nilai Kualitatif': d.nilai_kualitatif || 'Belum Dinilai',
          'Deskripsi Catatan Kemajuan': d.deskripsi_kemajuan || '-',
        }));
        fileName = `Rekap_Nilai_Ekskul_${profile.nama_ekstrakurikuler}`;
      }

      if (dataToExport.length === 0) {
        toast.error('Belum ada data rekap untuk kategori ini.');
        return;
      }

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data Rekap');
      const maxColWidth = dataToExport.reduce((w, r) => Object.keys(r).map((k, i) => Math.max(w[i] || 10, String(r[k]).length)), []);
      ws['!cols'] = maxColWidth.map((w: number) => ({ wth: w + 5 }));
      XLSX.writeFile(wb, `${fileName}.xlsx`);

    } catch (err: any) {
      toast.error(`Gagal mengunduh rekap: ${err.message}`);
    } finally {
      setLoadingDownload(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="flex min-h-dvh items-start justify-center bg-gradient-to-br from-slate-50 to-zinc-100 p-3 pt-6 sm:p-6"
    >
      <div className="w-full max-w-4xl space-y-6">
        {/* ── Navbar Atas ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="navbar rounded-box border border-white/30 bg-white/80 shadow-lg backdrop-blur-md"
        >
          <div className="flex-1 flex-col items-start gap-1">
            <div className="badge badge-soft badge-info badge-sm uppercase tracking-widest">Dashboard Utama</div>
            <h2 className="mt-0.5 text-xl font-extrabold text-slate-900 sm:text-2xl">{profile?.nama_lengkap}</h2>
            <p className="text-xs font-medium text-slate-500">Silakan pilih menu sesuai aktivitas tugas Anda.</p>
          </div>
          <div className="flex-none gap-2">
            <OnlineStatus pendingCount={pendingCount} onSyncNow={syncNow} syncing={syncing} />
            <button onClick={handleLogout} className="btn btn-soft btn-error btn-sm">
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        </motion.div>

        {/* ── Menu Utama ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {isPiket && (
            <motion.button
              {...cardHover}
              onClick={() => setCurrentRole('guru_piket')}
              className="card border border-indigo-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-indigo-500 cursor-pointer sm:col-span-2 md:col-span-1"
            >
              <div className="card-body gap-3 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/20">
                  <Satellite className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">Panel Guru Piket Harian</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Akses kendali validasi izin pendidik dan monitor radar absensi harian sekolah.
                </p>
              </div>
            </motion.button>
          )}

          {isGureBK && (
            <motion.button
              {...cardHover}
              onClick={() => setCurrentRole('guru_bk')}
              className="card border border-rose-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-rose-500 cursor-pointer"
            >
              <div className="card-body gap-3 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-sm ring-1 ring-rose-500/20">
                  <AlertTriangle className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">Panel Guru Bimbingan Konseling (BK)</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Akses radar rekap kasus kerawanan siswa dan koordinasi penanganan konseling sekolah.
                </p>
              </div>
            </motion.button>
          )}

          {profile?.mapel && (
            <motion.button
              {...cardHover}
              onClick={() => setCurrentRole('guru_mapel')}
              className="card border border-blue-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer"
            >
              <div className="card-body gap-3 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm ring-1 ring-blue-500/20">
                  <Backpack className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">Guru Mata Pelajaran</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Kelola Jurnal Pengajaran harian, Presensi Siswa, dan Input Nilai.
                </p>
              </div>
            </motion.button>
          )}

          {profile?.is_wali_kelas && (
            <motion.button
              {...cardHover}
              onClick={() => setCurrentRole('wali_kelas')}
              className="card border border-amber-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
            >
              <div className="card-body gap-3 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm ring-1 ring-amber-500/20">
                  <Home className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">
                  Absensi Kelas Binaan
                  {profile.kelas_wali && <span className="badge badge-soft badge-amber badge-sm ml-1">{profile.kelas_wali}</span>}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Mengelola absensi harian &amp; kasus BK khusus siswa kelas binaan.
                </p>
              </div>
            </motion.button>
          )}

          {profile?.nama_ekstrakurikuler && (
            <motion.button
              {...cardHover}
              onClick={() => setCurrentRole('pembina_ekskul')}
              className="card border border-violet-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-violet-500 cursor-pointer"
            >
              <div className="card-body gap-3 text-left">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm ring-1 ring-violet-500/20">
                  <Trophy className="size-5" />
                </div>
                <h3 className="card-title text-sm text-slate-900">
                  Kegiatan Ekstrakurikuler
                  <span className="badge badge-soft badge-violet badge-sm ml-1">{profile.nama_ekstrakurikuler}</span>
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Input log pelaksanaan latihan, manajemen rombel &amp; nilai kualitatif.
                </p>
              </div>
            </motion.button>
          )}

          {/* ── Ajukan Izin ── */}
          <motion.button
            {...cardHover}
            onClick={() => setShowFormIzin(true)}
            className="card border border-rose-200/60 bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-rose-500 cursor-pointer"
          >
            <div className="card-body gap-3 text-left">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm ring-1 ring-rose-500/20">
                <CalendarX className="size-5" />
              </div>
              <h3 className="card-title text-sm text-slate-900">Pengajuan Berhalangan Hadir</h3>
              <p className="text-xs leading-relaxed text-slate-500">
                Ajukan surat izin sakit, dinas, atau keperluan mendesak untuk diverifikasi guru piket.
              </p>
            </div>
          </motion.button>
        </div>

        {/* ── Pusat Unduh Laporan ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="card border border-slate-200/60 bg-white shadow-lg"
        >
          <div className="card-body gap-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="card-title gap-2 text-sm text-slate-900">
                  <BarChart3 className="size-4 text-slate-600" />
                  Pusat Unduh Laporan Mandiri
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  Ekspor rekap data milik Anda langsung ke format Excel (.xlsx) atau PDF (.pdf)
                </p>
              </div>
              {loadingDownload && (
                <span className="badge badge-soft badge-info gap-1.5 py-3">
                  <Loader2 className="size-3 animate-spin" />
                  Memproses...
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profile?.mapel && (
                <>
                  <button
                    onClick={() => setModalJenis('jurnal')}
                    disabled={loadingDownload}
                    className="btn btn-outline btn-sm h-auto min-h-0 gap-2 border-slate-300 px-3 py-3 text-[11px] font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
                  >
                    <ScrollText className="size-4" />
                    Jurnal Mapel
                  </button>
                  <button
                    onClick={() => setModalJenis('nilai')}
                    disabled={loadingDownload}
                    className="btn btn-outline btn-sm h-auto min-h-0 gap-2 border-slate-300 px-3 py-3 text-[11px] font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-40"
                  >
                    <ClipboardCheck className="size-4" />
                    Nilai Mapel
                  </button>
                </>
              )}

              {(profile?.is_wali_kelas || isGureBK) && (
                <>
                  <button
                    onClick={() => setModalJenis('bk')}
                    disabled={loadingDownload}
                    className="btn btn-soft btn-error btn-sm h-auto min-h-0 gap-2 px-3 py-3 text-[11px] font-bold disabled:opacity-40"
                  >
                    <AlertTriangle className="size-4" />
                    Rekap BK (Excel)
                  </button>
                  <button
                    onClick={handleDownloadBKPDF}
                    disabled={loadingDownload}
                    className="btn btn-soft btn-error btn-sm h-auto min-h-0 gap-2 px-3 py-3 text-[11px] font-bold disabled:opacity-40"
                  >
                    <FileText className="size-4" />
                    Rekap BK (PDF)
                  </button>
                </>
              )}

              {profile?.nama_ekstrakurikuler && (
                <>
                  <button
                    onClick={() => handleDownload('ekskul_jurnal')}
                    disabled={loadingDownload}
                    className="btn btn-soft btn-secondary btn-sm h-auto min-h-0 gap-2 px-3 py-3 text-[11px] font-bold disabled:opacity-40"
                  >
                    <ScrollText className="size-4" />
                    Jurnal Latihan
                  </button>
                  <button
                    onClick={() => handleDownload('ekskul_anggota')}
                    disabled={loadingDownload}
                    className="btn btn-soft btn-secondary btn-sm h-auto min-h-0 gap-2 px-3 py-3 text-[11px] font-bold disabled:opacity-40"
                  >
                    <Users className="size-4" />
                    Anggota Rombel
                  </button>
                  <button
                    onClick={() => handleDownload('ekskul_nilai')}
                    disabled={loadingDownload}
                    className="btn btn-soft btn-secondary btn-sm h-auto min-h-0 gap-2 px-3 py-3 text-[11px] font-bold disabled:opacity-40"
                  >
                    <Star className="size-4" />
                    Nilai Kualitatif
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <p className="text-center text-[10px] font-medium tracking-wider text-slate-400">
          SIGAP SPENSAWA &bull; Sistem Informasi Guru Aktif &amp; Pengelolaan Akademik
        </p>
        {/* ── Modal Unduh ── */}
        <ModalUnduh
          open={modalJenis !== null}
          onClose={() => setModalJenis(null)}
          jenis={modalJenis}
          daftarKelas={daftarKelas || []}
          mataPelajaranData={mataPelajaranData}
          isGureBK={isGureBK}
          onDownload={(params) => {
            handleDownload(
              params.jenis as 'jurnal' | 'nilai' | 'bk',
              {
                bulan: params.selectedBulan || undefined,
                kelas: params.selectedKelas || undefined,
                mapel: params.selectedMapel || undefined,
              },
            );
            setModalJenis(null);
          }}
        />

        {/* ── Modal Pengajuan Izin ── */}
        <FormPengajuanIzin
          open={showFormIzin}
          onClose={() => setShowFormIzin(false)}
          userId={profile?.user_id || ''}
          namaLengkap={profile?.nama_lengkap || ''}
        />
      </div>
    </motion.div>
  );
}
