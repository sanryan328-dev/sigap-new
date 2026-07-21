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
import type { AuthUser, MapelEntry } from '../store/useAuthStore';
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
  const user = useAuthStore((s) => s.user);
  const isPiket = useAuthStore(selectIsPiket);
  const isGureBK = useAuthStore(selectIsGureBK);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [modalJenis, setModalJenis] = useState<'nilai' | 'jurnal' | 'bk' | 'agenda' | null>(null);
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
    jenis: 'jurnal' | 'nilai' | 'bk' | 'ekskul_jurnal' | 'ekskul_anggota' | 'ekskul_nilai' | 'rekap_jurnal_all' | 'rekap_kehadiran_all',
    filters?: { bulan?: string; kelas?: string; mapel?: string },
  ) => {
    if (!profile) return;
    setLoadingDownload(true);

    const monthMapping: { [key: string]: string } = {
      'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
      'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
      'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12',
    };

    const buildDateRange = (bulan: string | undefined) => {
      if (!bulan) return { gte: undefined, lte: undefined };
      const monthNum = monthMapping[bulan];
      if (!monthNum) return { gte: undefined, lte: undefined };
      const year = new Date().getFullYear();
      const startOfMonth = `${year}-${monthNum}-01T00:00:00.000Z`;
      const lastDay = new Date(year, parseInt(monthNum), 0).getDate();
      const endOfMonth = `${year}-${monthNum}-${lastDay}T23:59:59.999Z`;
      return { gte: startOfMonth, lte: endOfMonth };
    };

    const range = buildDateRange(filters?.bulan);

    try {
      let dataToExport: any[] = [];
      let fileName = `Rekap_${jenis}_${profile.nama_lengkap.replace(/[^a-zA-Z0-9]/g, '_')}`;

      if (jenis === 'jurnal') {
        let queryJurnal = supabase.from('teaching_journals').select('*').eq('user_id', profile.user_id);
        if (filters?.mapel) queryJurnal = queryJurnal.eq('mata_pelajaran', filters.mapel);
        if (filters?.kelas) queryJurnal = queryJurnal.eq('kelas', filters.kelas);
        if (range.gte) queryJurnal = queryJurnal.gte('created_at', range.gte).lte('created_at', range.lte);
        const { data, error } = await queryJurnal.order('created_at', { ascending: false });
        if (error) throw error;
        dataToExport = (data ?? []).map((d: any) => ({
          'Tanggal': d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID') : '-',
          'Kelas': d.kelas,
          'Mata Pelajaran': d.mata_pelajaran,
          'Jam Ke': d.jam_ke,
          'Materi Pembelajaran': d.materi_pembelajaran,
          'Catatan / Log': d.catatan_kelas || '-',
        }));

      } else if (jenis === 'nilai') {
        let queryNilai = supabase.from('student_scores').select('*').eq('user_id', profile.user_id);
        if (filters?.mapel) queryNilai = queryNilai.eq('mapel', filters.mapel);
        if (filters?.kelas) queryNilai = queryNilai.eq('kelas', filters.kelas);
        if (range.gte) queryNilai = queryNilai.gte('created_at', range.gte).lte('created_at', range.lte);
        const { data: nilaiData, error: nilaiError } = await queryNilai.order('created_at', { ascending: false });
        if (nilaiError) throw nilaiError;

        const { data: siswaData, error: siswaError } = await supabase.from('students').select('id, nama_siswa, kelas');
        if (siswaError) throw siswaError;

        dataToExport = (nilaiData ?? []).map((d: any) => {
          const siswa = siswaData?.find((s: any) => String(s.id) === String(d.student_id));
          return {
            'Tanggal Input': d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID') : '-',
            'Nama Siswa': siswa?.nama_siswa || '-',
            'Kelas': siswa?.kelas || d.kelas || '-',
            'Mata Pelajaran': d.mapel,
            'Jenis Penilaian': d.jenis_penilaian,
            'Nilai': d.nilai,
          };
        });

      } else if (jenis === 'bk') {
        let query = supabase.from('bk_records').select('*');
        if (!isGureBK && profile.is_wali_kelas) {
          query = query.eq('kelas', profile.kelas_wali);
        }
        if (range.gte) query = query.gte('created_at', range.gte).lte('created_at', range.lte);

        const { data: bkData, error: bkError } = await query.order('created_at', { ascending: true });
        if (bkError) throw bkError;

        const { data: studentsData, error: studentError } = await supabase.from('students').select('id, nama_siswa');
        if (studentError) throw studentError;

        const filteredBk = bkData.filter((d: any) => {
          if (filters?.kelas && d.kelas !== filters.kelas) return false;
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

          const tglStr = d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID') : '-';

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
        let queryEkskul = supabase.from('teaching_journals').select('*').eq('user_id', profile.user_id).ilike('mata_pelajaran', '%Ekskul%');
        if (range.gte) queryEkskul = queryEkskul.gte('created_at', range.gte).lte('created_at', range.lte);
        const { data, error } = await queryEkskul.order('created_at', { ascending: false });
        if (error) throw error;
        dataToExport = data.map((d: any) => ({
          'Tanggal Latihan': d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID') : '-',
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
          'Tanggal Bergabung': d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID') : '-',
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
      } else if (jenis === 'rekap_jurnal_all') {
        let q = supabase.from('teaching_journals').select('*, profiles!inner(user_id, nama_lengkap)');
        if (range.gte) q = q.gte('created_at', range.gte).lte('created_at', range.lte);
        const { data, error } = await q.order('created_at', { ascending: false });
        if (error) throw error;
        dataToExport = (data ?? []).map((d: any, idx: number) => ({
          'No': idx + 1,
          'Tanggal': d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID') : '-',
          'Guru': d.profiles?.nama_lengkap || `(user_id: ${d.user_id})`,
          'Kelas': d.kelas,
          'Mata Pelajaran': d.mata_pelajaran,
          'Jam Ke': d.jam_ke,
          'Materi': d.materi_pembelajaran,
          'Catatan': d.catatan_kelas || '-',
        }));
        fileName = 'Rekap_Jurnal_Seluruh_Guru';

      } else if (jenis === 'rekap_kehadiran_all') {
        let qJ = supabase.from('teaching_journals').select('id, kelas, mata_pelajaran, jam_ke, created_at, profiles!inner(user_id, nama_lengkap)');
        if (range.gte) qJ = qJ.gte('created_at', range.gte).lte('created_at', range.lte);
        const { data: journals, error: eJ } = await qJ.order('created_at', { ascending: false });
        if (eJ) throw eJ;
        if (!journals?.length) {
          toast.error('Belum ada data jurnal untuk periode ini.');
          return;
        }
        const jIds = journals.map((j: any) => j.id);
        const { data: att, error: eA } = await supabase
          .from('student_attendances')
          .select('teaching_journal_id, student_id, status');
        if (eA) throw eA;
        const attMap = new Map<number, { h: number; s: number; i: number; a: number }>();
        (att ?? []).forEach((a: any) => {
          const tid = a.teaching_journal_id;
          if (!attMap.has(tid)) attMap.set(tid, { h: 0, s: 0, i: 0, a: 0 });
          const m = attMap.get(tid)!;
          if (a.status === 'Hadir') m.h++;
          else if (a.status === 'Sakit') m.s++;
          else if (a.status === 'Izin') m.i++;
          else m.a++;
        });
        dataToExport = journals.map((j: any, idx: number) => {
          const s = attMap.get(j.id) || { h: 0, s: 0, i: 0, a: 0 };
          return {
            'No': idx + 1,
            'Tanggal': j.created_at ? new Date(j.created_at).toLocaleDateString('id-ID') : '-',
            'Guru': j.profiles?.nama_lengkap || `(user_id: ${j.user_id})`,
            'Kelas': j.kelas,
            'Mapel': j.mata_pelajaran,
            'Jam': j.jam_ke,
            'Hadir': s.h,
            'Sakit': s.s,
            'Izin': s.i,
            'Alfa': s.a,
          };
        });
        fileName = 'Rekap_Kehadiran_Siswa_Keseluruhan';
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

  const handleDownloadAgenda = async (selectedBulan: string) => {
    if (!profile || !profile.kelas_wali) return;
    setLoadingDownload(true);
    try {
      const monthMapping: { [key: string]: string } = {
        'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
        'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
        'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12',
      };
      const buildRange = (bulan: string) => {
        const m = monthMapping[bulan];
        if (!m) return { gte: undefined, lte: undefined };
        const y = new Date().getFullYear();
        const start = `${y}-${m}-01T00:00:00.000Z`;
        const lastDay = new Date(y, parseInt(m), 0).getDate();
        return { gte: start, lte: `${y}-${m}-${lastDay}T23:59:59.999Z` };
      };
      const range = buildRange(selectedBulan);

      /* Tarik jurnal untuk kelas wali */
      let qJ = supabase.from('teaching_journals').select('*').eq('kelas', profile.kelas_wali);
      if (range.gte) qJ = qJ.gte('created_at', range.gte).lte('created_at', range.lte);
      const { data: journals, error: eJ } = await qJ.order('created_at', { ascending: true });
      if (eJ) throw eJ;
      if (!journals?.length) {
        toast.error(`Belum ada data jurnal untuk kelas ${profile.kelas_wali} pada periode ini.`);
        return;
      }

      /* Tarik kehadiran siswa */
      const jIds = journals.map((j: any) => j.id);
      const { data: att, error: eA } = await supabase
        .from('student_attendances')
        .select('teaching_journal_id, status')
        .in('teaching_journal_id', jIds);
      if (eA) throw eA;

      /* Statistik kehadiran per jurnal */
      const statMap: Record<number, { h: number; s: number; i: number; a: number }> = {};
      (att ?? []).forEach((a: any) => {
        const tid = a.teaching_journal_id;
        if (!statMap[tid]) statMap[tid] = { h: 0, s: 0, i: 0, a: 0 };
        if (a.status === 'Hadir') statMap[tid].h++;
        else if (a.status === 'Sakit') statMap[tid].s++;
        else if (a.status === 'Izin') statMap[tid].i++;
        else if (a.status === 'Alfa' || a.status === 'Alpha') statMap[tid].a++;
      });

      /* Susun data untuk XLSX */
      const colHeaders = [
        'No', 'Hari / Tanggal', 'Jam Ke', 'Mata Pelajaran',
        'Topik / Materi Pembelajaran', 'Catatan Kelas',
        'Hadir', 'Sakit', 'Izin', 'Alfa',
        'Tanda Tangan Guru Mapel',
      ];

      const rows = journals.map((j: any, idx: number) => {
        const s = statMap[j.id] || { h: 0, s: 0, i: 0, a: 0 };
        const tgl = j.created_at
          ? new Date(j.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
          : '-';
        return [
          idx + 1, tgl, j.jam_ke || '-', j.mata_pelajaran || '-',
          j.materi_pembelajaran || '-', j.catatan_kelas || '-',
          s.h, s.s, s.i, s.a, '',
        ];
      });

      const wb = XLSX.utils.book_new();
      const wsData: any[][] = [
        ['AGENDA KELAS'],
        [`Kelas: ${profile.kelas_wali}`],
        [`Periode: ${selectedBulan || 'Semua Bulan'} ${new Date().getFullYear()}`],
        [],
        colHeaders,
        ...rows,
        [],
        ['', '', '', '', '', '', '', '', '', '', ''],
        ['Mengetahui,', '', '', '', '', '', '', '', '', '', 'Mengetahui,'],
        ['Wali Kelas', '', '', '', '', '', '', '', '', '', 'Kepala Sekolah'],
        [],
        ['( ___________________ )', '', '', '', '', '', '', '', '', '', '( ___________________ )'],
        [profile.nama_lengkap, '', '', '', '', '', '', '', '', '', ''],
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 10 } },
      ];
      ws['!cols'] = [
        { wch: 5 }, { wch: 28 }, { wch: 8 }, { wch: 22 },
        { wch: 32 }, { wch: 26 }, { wch: 7 }, { wch: 7 },
        { wch: 7 }, { wch: 7 }, { wch: 30 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Agenda Kelas');
      XLSX.writeFile(wb, `Agenda_Kelas_${profile.kelas_wali}_${selectedBulan || 'Semua'}.xlsx`);
    } catch (err: any) {
      toast.error(`Gagal mengunduh agenda: ${err.message}`);
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
            <p className="text-sm font-medium text-slate-500">Silakan pilih menu sesuai aktivitas tugas Anda.</p>
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
                <p className="text-sm leading-relaxed text-slate-500">
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
                <p className="text-sm leading-relaxed text-slate-500">
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
                <p className="text-sm leading-relaxed text-slate-500">
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
                <p className="text-sm leading-relaxed text-slate-500">
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
                <p className="text-sm leading-relaxed text-slate-500">
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
              <p className="text-sm leading-relaxed text-slate-500">
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
                <p className="text-sm font-medium text-slate-500">
                  Ekspor rekap data milik Anda ke format Excel (.xlsx)
                </p>
              </div>
              {loadingDownload && (
                <span className="badge badge-soft badge-info gap-1.5 py-3">
                  <Loader2 className="size-3 animate-spin" />
                  Memproses...
                </span>
              )}
            </div>

            {/* ── Kelompok Guru Mapel ── */}
            {profile?.mapel && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Backpack className="size-3.5" />
                  Kelompok Guru Mapel
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => setModalJenis('jurnal')}
                    disabled={loadingDownload}
                    className="btn btn-outline btn-sm h-auto min-h-0 gap-2 border-slate-300 px-3 py-3 text-[11px] font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
                  >
                    <ScrollText className="size-4" />
                    Unduh Jurnal Mapel
                  </button>
                  <button
                    onClick={() => setModalJenis('nilai')}
                    disabled={loadingDownload}
                    className="btn btn-outline btn-sm h-auto min-h-0 gap-2 border-slate-300 px-3 py-3 text-[11px] font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-40"
                  >
                    <ClipboardCheck className="size-4" />
                    Unduh Nilai Mapel
                  </button>
                </div>
              </div>
            )}

            {/* ── Kelompok Ekstrakurikuler ── */}
            {profile?.nama_ekstrakurikuler && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Trophy className="size-3.5" />
                  Kelompok Ekstrakurikuler
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <button
                    onClick={() => handleDownload('ekskul_jurnal')}
                    disabled={loadingDownload}
                    className="btn btn-outline btn-sm h-auto min-h-0 gap-2 border-slate-300 px-3 py-3 text-[11px] font-semibold text-slate-700 hover:border-violet-500 hover:text-violet-600 disabled:opacity-40"
                  >
                    <ScrollText className="size-4" />
                    Jurnal Latihan
                  </button>
                  <button
                    onClick={() => handleDownload('ekskul_anggota')}
                    disabled={loadingDownload}
                    className="btn btn-outline btn-sm h-auto min-h-0 gap-2 border-slate-300 px-3 py-3 text-[11px] font-semibold text-slate-700 hover:border-violet-500 hover:text-violet-600 disabled:opacity-40"
                  >
                    <Users className="size-4" />
                    Anggota Rombel
                  </button>
                  <button
                    onClick={() => handleDownload('ekskul_nilai')}
                    disabled={loadingDownload}
                    className="btn btn-outline btn-sm h-auto min-h-0 gap-2 border-slate-300 px-3 py-3 text-[11px] font-semibold text-slate-700 hover:border-violet-500 hover:text-violet-600 disabled:opacity-40"
                  >
                    <Star className="size-4" />
                    Nilai Kualitatif
                  </button>
                </div>
              </div>
            )}

            {/* ── Kelompok Kurikulum / Kesiswaan ── */}
            {(user?.role === 'kurikulum' || user?.role === 'admin' || user?.role === 'kepala_sekolah') && (
              <div className="space-y-2" style={{ color: '#1d1601' }}>
                <h4
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: '#1d1601' }}
                >
                  <BarChart3 className="size-3.5" />
                  Kelompok Kurikulum / Kesiswaan
                </h4>
                <div
                  className="grid grid-cols-2 gap-2 sm:grid-cols-3 p-4 rounded-xl border"
                  style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18' }}
                >
                  <button
                    onClick={() => handleDownload('rekap_jurnal_all')}
                    disabled={loadingDownload}
                    className="px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50 text-center"
                    style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                  >
                    <ScrollText className="size-4 inline-block mr-1.5" />
                    Rekap Jurnal Seluruh Guru
                  </button>
                  <button
                    onClick={() => handleDownload('rekap_kehadiran_all')}
                    disabled={loadingDownload}
                    className="px-3 py-3 rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50 text-center"
                    style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                  >
                    <Users className="size-4 inline-block mr-1.5" />
                    Rekap Kehadiran Siswa
                  </button>
                </div>
              </div>
            )}

            {/* ── Kelompok Tugas Tambahan (Wali Kelas) ── */}
            {(profile?.is_wali_kelas || isGureBK) && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Home className="size-3.5" />
                  Kelompok Tugas Tambahan (Wali Kelas)
                  {profile?.kelas_wali && (
                    <span className="badge badge-soft badge-amber badge-xs">{profile.kelas_wali}</span>
                  )}
                </h4>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                  {profile?.is_wali_kelas && (
                    <button
                      onClick={() => setModalJenis('agenda')}
                      disabled={loadingDownload}
                      className="btn btn-soft btn-warning btn-sm h-auto min-h-0 gap-2 px-3 py-3 text-[11px] font-bold disabled:opacity-40 col-span-2 sm:col-span-1"
                    >
                      <ClipboardCheck className="size-4" />
                      Unduh Agenda Kelas
                    </button>
                  )}
                </div>
              </div>
            )}
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
            if (params.jenis === 'agenda') {
              handleDownloadAgenda(params.selectedBulan);
            } else {
              handleDownload(
                params.jenis as 'jurnal' | 'nilai' | 'bk',
                {
                  bulan: params.selectedBulan || undefined,
                  kelas: params.selectedKelas || undefined,
                  mapel: params.selectedMapel || undefined,
                },
              );
            }
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
