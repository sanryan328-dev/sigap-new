import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ArrowUpCircle, AlertTriangle } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

interface AdminPortalProps {
  handleLogout: () => void;
  daftarKelas: string[];
}

interface MapelKelasEntry {
  mapel: string;
  kelas: string[];
}

export default function AdminPortal({ handleLogout, daftarKelas }: AdminPortalProps) {
  const [tabAdmin, setTabAdmin] = useState<'dashboard' | 'siswa' | 'guru' | 'import' | 'tambah' | 'jadwal' | null>(null);
  const [loading, setLoading] = useState(false);

  const [listSiswa, setListSiswa] = useState<any[]>([]);
  const [formSiswa, setFormSiswa] = useState({ id: '', nama_siswa: '', nisn: '', kelas: '' });
  const [isEditSiswa, setIsEditSiswa] = useState(false);
  const [filterKelas, setFilterKelas] = useState<string>('');
  const [searchSiswa, setSearchSiswa] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [bulkTargetKelas, setBulkTargetKelas] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  const [listGuru, setListGuru] = useState<any[]>([]);
  const [formGuru, setFormGuru] = useState({ 
    pengenal: '', id_pengguna: '', username: '', nama_lengkap: '', 
    mapel: '', mataPelajaran: [] as MapelKelasEntry[], is_wali_kelas: false, kelas_wali: '', 
    nama_ekstrakurikuler: '', role: 'guru_mapel', hari_piket: 'Tidak Ada' 
  });
  const [isEditGuru, setIsEditGuru] = useState(false);

  const [listJadwal, setListJadwal] = useState<any[]>([]);
  const [listProfilesForJadwal, setListProfilesForJadwal] = useState<any[]>([]);
  const [formJadwal, setFormJadwal] = useState({
    user_id: '',
    nama_lengkap: '',
    mata_pelajaran: '',
    kelas: '',
    hari: 'Senin',
    jam_mulai: '1',
    durasi_jam: '2',
  });
  const [pesanJadwal, setPesanJadwal] = useState<{ type: 'sukses' | 'error'; text: string } | null>(null);
  const [simpangJadwal, setSimpangJadwal] = useState(false);
  const [importLogJadwal, setImportLogJadwal] = useState<{ sukses: number; gagal: { baris: number; pesan: string }[] } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean; type: 'siswa' | 'guru_hapus'; id?: string; payload?: any;
  }>({ show: false, type: 'siswa' });
  const modalRef = useRef<HTMLDialogElement>(null);
  const masterCheckRef = useRef<HTMLInputElement>(null);

  const [parentSiswa] = useAutoAnimate();
  const [parentGuru] = useAutoAnimate();

  const [tambahMode, setTambahMode] = useState<'siswa' | 'guru'>('siswa');
  const [formTambahSiswa, setFormTambahSiswa] = useState({ nama_siswa: '', nisn: '', kelas: '' });
  const [formTambahGuru, setFormTambahGuru] = useState({ 
    username: '', nama_lengkap: '', mapel: '', mataPelajaran: [] as MapelKelasEntry[], is_wali_kelas: false, 
    kelas_wali: '', nama_ekstrakurikuler: '', role: 'guru_mapel', hari_piket: 'Tidak Ada' 
  });

  useEffect(() => {
    if (tabAdmin === 'siswa') fetchAllSiswa();
    if (tabAdmin === 'guru') fetchAllGuru();
    if (tabAdmin === 'jadwal') { fetchJadwal(); fetchProfilesForJadwal(); }
    if (tabAdmin === 'tambah' && daftarKelas.length > 0 && !formTambahSiswa.kelas) {
      setFormTambahSiswa(prev => ({ ...prev, kelas: daftarKelas[0] }));
    }
  }, [tabAdmin, daftarKelas]);

  const fetchJadwal = async () => {
    const { data } = await supabase
      .from('teaching_schedules')
      .select('*')
      .order('hari', { ascending: true })
      .order('jam_mulai', { ascending: true });
    if (data) setListJadwal(data);
  };

  const fetchProfilesForJadwal = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id, nama_lengkap, mapel, mata_pelajaran');
    if (data) {
      const unik: any[] = [];
      const seen = new Set<number>();
      data.forEach((p: any) => {
        if (p.user_id && !seen.has(p.user_id)) {
          seen.add(p.user_id);
          unik.push(p);
        }
      });
      setListProfilesForJadwal(unik);
    }
  };

  const unduhTemplateJadwal = () => {
    const headers = [['username_guru', 'mata_pelajaran', 'kelas', 'hari', 'jam_ke', 'durasi']];
    const contoh = [
      ['budiman_smp', 'Matematika', 'VIII A', 'Senin', '5', '2'],
      ['siti_aminah', 'PAI', 'VII C', 'Jumat', '08:00-10:00', ''],
    ];
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...contoh]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Jadwal');
    const lebarKolom = [
      { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 16 }, { wch: 8 },
    ];
    ws['!cols'] = lebarKolom;
    XLSX.writeFile(wb, 'Template_Import_Jadwal.xlsx');
  };

  const handleImportJadwal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLogJadwal(null);
    setPesanJadwal(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const rawData: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

        if (rawData.length === 0) {
          setPesanJadwal({ type: 'error', text: 'File Excel kosong. Tidak ada data yang diimpor.' });
          e.target.value = '';
          return;
        }

        /* Ambil mapping username → user_id dari tabel users */
        const { data: usersData } = await supabase.from('users').select('id, username');
        const userMap = new Map<string, number>();
        if (usersData) {
          usersData.forEach((u: any) => {
            if (u.username) userMap.set(u.username.trim().toLowerCase(), u.id);
          });
        }

        const sukses: any[] = [];
        const gagal: { baris: number; pesan: string }[] = [];

        /* Fungsi konversi jam digital Jumat */
        const konversiJumat = (jamKeRaw: string): { jam_mulai: number; durasi_jam: number } | null => {
          const bersih = jamKeRaw.trim();
          if (/^0?6:30\s*-\s*0?8:00$/.test(bersih)) return { jam_mulai: 1, durasi_jam: 3 };
          if (/^0?8:00\s*-\s*10:00$/.test(bersih)) return { jam_mulai: 5, durasi_jam: 4 };
          return null;
        };

        /* ── Parsing baris 1 per 1 ── */
        rawData.forEach((item: any, idx: number) => {
          const baris = idx + 2;
          const username = String(item.username_guru || '').trim();
          const mapel = String(item.mata_pelajaran || '').trim();
          const kelas = String(item.kelas || '').trim();
          const hari = String(item.hari || '').trim();

          if (!username) {
            gagal.push({ baris, pesan: 'username_guru kosong' });
            return;
          }
          const userId = userMap.get(username.toLowerCase());
          if (!userId) {
            gagal.push({ baris, pesan: `username "${username}" tidak terdaftar di sistem` });
            return;
          }

          const errs: string[] = [];
          if (!mapel) errs.push('mata_pelajaran kosong');
          if (!kelas) errs.push('kelas kosong');
          const hariValid = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          if (!hariValid.includes(hari)) errs.push(`hari "${hari}" tidak valid`);

          let jamMulaiInt = 0;
          let durasiInt = 0;
          const jamKeRaw = String(item.jam_ke ?? '').trim();
          const durasiRaw = String(item.durasi ?? '').trim();

          if (hari === 'Jumat' && /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(jamKeRaw)) {
            /* Format jam digital Jumat */
            const hasil = konversiJumat(jamKeRaw);
            if (!hasil) {
              errs.push(`jam_ke "${jamKeRaw}" — format waktu Jumat belum didukung`);
            } else {
              jamMulaiInt = hasil.jam_mulai;
              durasiInt = hasil.durasi_jam;
            }
          } else {
            /* Format angka biasa (Senin–Kamis atau Jumat angka) */
            jamMulaiInt = parseInt(jamKeRaw);
            if (isNaN(jamMulaiInt) || jamMulaiInt < 1 || jamMulaiInt > 10) {
              errs.push(`jam_ke "${jamKeRaw}" bukan angka 1-10`);
            }
            durasiInt = parseInt(durasiRaw);
            if (isNaN(durasiInt) || durasiInt < 1 || durasiInt > 6) {
              errs.push(`durasi "${durasiRaw}" bukan angka 1-6`);
            }
          }

          if (errs.length > 0) {
            gagal.push({ baris, pesan: errs.join('; ') });
            return;
          }

          sukses.push({
            baris,
            user_id: userId,
            mata_pelajaran: mapel,
            kelas,
            hari,
            jam_mulai: jamMulaiInt,
            durasi_jam: durasiInt,
          });
        });

        /* ── Validasi bentrok sebelum batch insert ── */
        if (sukses.length > 0) {
          /* Kumpulkan semua (kelas, hari) unik */
          const filterSet = new Set<string>();
          sukses.forEach((s: any) => filterSet.add(`${s.kelas}|${s.hari}`));

          /* Query existing schedules untuk kombinasi tsb */
          const { data: existingAll } = await supabase
            .from('teaching_schedules')
            .select('user_id, kelas, hari, jam_mulai, durasi_jam');

          const bentrokExisting = new Map<string, any[]>();
          if (existingAll) {
            existingAll.forEach((s: any) => {
              const key = `${s.kelas}|${s.hari}`;
              if (filterSet.has(key)) {
                if (!bentrokExisting.has(key)) bentrokExisting.set(key, []);
                bentrokExisting.get(key)!.push(s);
              }
            });
          }

          /* Periksa bentrok per baris */
          const postBentrok: number[] = [];
          sukses.forEach((s: any, i: number) => {
            const key = `${s.kelas}|${s.hari}`;
            const daftar = bentrokExisting.get(key) || [];
            const sAkhir = s.jam_mulai + s.durasi_jam - 1;

            /* Bentrok dengan jadwal existing (guru lain) */
            const bentrok = daftar.some((e: any) => {
              if (e.user_id === s.user_id) return false;
              const eAkhir = e.jam_mulai + e.durasi_jam - 1;
              return (s.jam_mulai <= eAkhir) && (sAkhir >= e.jam_mulai);
            });

            if (bentrok) {
              gagal.push({
                baris: s.baris,
                pesan: `Jadwal bentrok dengan jadwal yang sudah tersimpan di kelas ${s.kelas} hari ${s.hari} jam ${s.jam_mulai}–${sAkhir}`,
              });
              postBentrok.push(i);
            }
          });

          /* Hapus baris yg bentrok dari array sukses (mundur) */
          for (const i of postBentrok.sort((a, b) => b - a)) {
            sukses.splice(i, 1);
          }
        }

        /* ── Batch insert ── */
        if (sukses.length > 0) {
          const toInsert = sukses.map((s: any) => ({
            user_id: s.user_id,
            mata_pelajaran: s.mata_pelajaran,
            kelas: s.kelas,
            hari: s.hari,
            jam_mulai: s.jam_mulai,
            durasi_jam: s.durasi_jam,
          }));
          const { error } = await supabase.from('teaching_schedules').insert(toInsert);
          if (error) throw error;
        }

        setImportLogJadwal({ sukses: sukses.length, gagal });

        if (gagal.length === 0) {
          setPesanJadwal({ type: 'sukses', text: `Berhasil mengimpor ${sukses.length} data jadwal pelajaran!` });
        } else {
          setPesanJadwal({
            type: sukses.length > 0 ? 'sukses' : 'error',
            text: `Berhasil ${sukses.length} data. ${gagal.length} baris gagal — lihat detail di bawah.`,
          });
        }

        fetchJadwal();
      } catch (err: any) {
        setPesanJadwal({ type: 'error', text: `Gagal memproses file: ${err.message}` });
      }
      e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const fetchAllSiswa = async () => {
    setLoading(true);
    const { data } = await supabase.from('students').select('*').order('kelas', { ascending: true }).order('nama_siswa', { ascending: true });
    if (data) setListSiswa(data);
    setLoading(false);
  };

  const handleSimpanJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    setPesanJadwal(null);
    setSimpangJadwal(true);

    const userIdNum = parseInt(formJadwal.user_id);
    if (!userIdNum) {
      setPesanJadwal({ type: 'error', text: 'Silakan pilih guru terlebih dahulu.' });
      setSimpangJadwal(false);
      return;
    }

    const jamMulaiNum = parseInt(formJadwal.jam_mulai);
    const durasiJamNum = parseInt(formJadwal.durasi_jam);
    const jamSelesaiNum = jamMulaiNum + durasiJamNum - 1;

    try {
      const { data: existing } = await supabase
        .from('teaching_schedules')
        .select('*')
        .eq('kelas', formJadwal.kelas)
        .eq('hari', formJadwal.hari);

      if (existing) {
        const { data: profiles } = await supabase.from('profiles').select('user_id, nama_lengkap');
        const profileMap = new Map((profiles || []).map(p => [p.user_id, p.nama_lengkap]));
        const bentrok = existing.find((s: any) => {
          if (s.user_id === userIdNum) return false;
          const sMulai = s.jam_mulai;
          const sAkhir = s.jam_mulai + s.durasi_jam - 1;
          return (jamMulaiNum <= sAkhir) && (jamSelesaiNum >= sMulai);
        });
        if (bentrok) {
          const namaGuru = profileMap.get(bentrok.user_id) || `(user_id: ${bentrok.user_id})`;
          setPesanJadwal({
            type: 'error',
            text: `Jadwal bentrok dengan ${namaGuru} di kelas ${formJadwal.kelas} pada hari ${formJadwal.hari}!`,
          });
          setSimpangJadwal(false);
          return;
        }
      }

      const { error } = await supabase.from('teaching_schedules').insert({
        user_id: userIdNum,
        mata_pelajaran: formJadwal.mata_pelajaran,
        kelas: formJadwal.kelas,
        hari: formJadwal.hari,
        jam_mulai: jamMulaiNum,
        durasi_jam: durasiJamNum,
      });

      if (error) {
        setPesanJadwal({ type: 'error', text: error.message });
      } else {
        setPesanJadwal({ type: 'sukses', text: 'Jadwal berhasil disimpan!' });
        setFormJadwal(prev => ({ ...prev, user_id: '', nama_lengkap: '', mata_pelajaran: '' }));
        fetchJadwal();
      }
    } catch (err: any) {
      setPesanJadwal({ type: 'error', text: err.message });
    }
    setSimpangJadwal(false);
  };

  const handleHapusJadwal = async (id: number) => {
    setSimpangJadwal(true);
    const { error } = await supabase.from('teaching_schedules').delete().eq('id', id);
    if (!error) {
      toast.success('Jadwal berhasil dihapus.');
      fetchJadwal();
    } else {
      toast.error('Gagal menghapus jadwal: ' + error.message);
    }
    setSimpangJadwal(false);
  };

  const handleUpdateJadwal = async (id: number, field: string, value: any) => {
    const { error } = await supabase.from('teaching_schedules').update({ [field]: value }).eq('id', id);
    if (!error) {
      toast.success(`Jadwal #${id} diperbarui.`);
      fetchJadwal();
    } else {
      toast.error('Gagal memperbarui: ' + error.message);
    }
  };

  const hapusSemuaJadwal = async () => {
    if (!confirm('Hapus semua jadwal? Tindakan ini tidak dapat dibatalkan.')) return;
    setSimpangJadwal(true);
    const { error } = await supabase.from('teaching_schedules').delete().neq('id', 0);
    if (!error) {
      toast.success('Semua jadwal berhasil dihapus.');
      fetchJadwal();
    } else {
      toast.error('Gagal: ' + error.message);
    }
    setSimpangJadwal(false);
  };

  const handleUpdateSiswa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('students').update({ nama_siswa: formSiswa.nama_siswa, nisn: formSiswa.nisn, kelas: formSiswa.kelas }).eq('id', formSiswa.id);
    if (!error) {
      toast.success('Data siswa berhasil diperbarui!');
      setIsEditSiswa(false);
      fetchAllSiswa();
    }
    setLoading(false);
  };

  const handleHapusSiswa = async (id: string) => {
    setConfirmDelete({ show: true, type: 'siswa', id });
    modalRef.current?.showModal();
  };

  const execHapusSiswa = async () => {
    if (!confirmDelete.id) return;
    await supabase.from('students').delete().eq('id', confirmDelete.id);
    toast.success('Data siswa berhasil dihapus.');
    setConfirmDelete({ show: false, type: 'siswa' });
    modalRef.current?.close();
    fetchAllSiswa();
  };

  const fetchAllGuru = async () => {
    setLoading(true);
    try {
      let profilesData;
      const res = await supabase.from('profiles').select('id, user_id, nama_lengkap, mapel, mata_pelajaran, is_wali_kelas, kelas_wali, nama_ekstrakurikuler, hari_piket');
      
      if (res.error) {
        const fallback = await supabase.from('profiles').select('id, user_id, nama_lengkap, mapel, mata_pelajaran, is_wali_kelas, kelas_wali, nama_ekstrakurikuler');
        profilesData = fallback.data;
      } else {
        profilesData = res.data;
      }

      const { data: usersData } = await supabase.from('users').select('id, username, role'); 

      if (profilesData && usersData) {
        const cleanGuru = profilesData.map((g: any) => {
          const matchUser = usersData.find((u: any) => u.id === g.user_id);
          const parsedMp = Array.isArray(g.mata_pelajaran)
            ? g.mata_pelajaran.filter((e: any) => e?.mapel?.trim())
            : g.mapel
              ? [{ mapel: g.mapel, kelas: [] as string[] }]
              : [];
          return {
            pengenal: g.id,
            id_pengguna: g.user_id,
            nama_lengkap: g.nama_lengkap || 'Tanpa Nama',
            mapel: g.mapel || '',
            mataPelajaran: parsedMp,
            is_wali_kelas: g.is_wali_kelas || false,
            kelas_wali: g.kelas_wali || '',
            nama_ekstrakurikuler: g.nama_ekstrakurikuler || '',
            hari_piket: g.hari_piket || 'Tidak Ada',
            username: matchUser?.username || '(Belum Sinkron)',
            role: matchUser?.role || 'guru_mapel' 
          };
        });
        setListGuru(cleanGuru);
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const bersihMp = formGuru.mataPelajaran.filter((e) => e.mapel.trim());
      const dataUpdate: any = {
        nama_lengkap: formGuru.nama_lengkap,
        mapel: bersihMp.length > 0 ? bersihMp.map((e) => e.mapel).join(', ') : null,
        mata_pelajaran: bersihMp,
        is_wali_kelas: formGuru.is_wali_kelas,
        kelas_wali: formGuru.is_wali_kelas ? formGuru.kelas_wali : null,
        nama_ekstrakurikuler: formGuru.nama_ekstrakurikuler || null
      };

      if (formGuru.hari_piket !== 'Tidak Ada') {
         dataUpdate.hari_piket = formGuru.hari_piket;
      }

      await supabase.from('profiles').update(dataUpdate).eq('id', formGuru.pengenal);

      if (formGuru.id_pengguna) {
        await supabase.from('users').update({ role: formGuru.role }).eq('id', formGuru.id_pengguna);
      }

      toast.success('Struktur tugas mengajar dan jadwal hari piket guru berhasil diperbarui!');
      setIsEditGuru(false);
      fetchAllGuru();
    } catch (err: any) {
      toast.error(`Gagal mengupdate: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleHapusGuru = async (pengenal: string, id_pengguna: string) => {
    setConfirmDelete({ show: true, type: 'guru_hapus', payload: { pengenal, id_pengguna } });
    modalRef.current?.showModal();
  };

  const execHapusGuru = async () => {
    if (!confirmDelete.payload) return;
    setLoading(true);
    await supabase.from('profiles').delete().eq('id', confirmDelete.payload.pengenal);
    if (confirmDelete.payload.id_pengguna) await supabase.from('users').delete().eq('id', confirmDelete.payload.id_pengguna);
    toast.success('Data guru berhasil dihapus.');
    setConfirmDelete({ show: false, type: 'guru_hapus' });
    modalRef.current?.close();
    fetchAllGuru();
  };

  const [konfirmasiTA, setKonfirmasiTA] = useState<'kelulusan' | 'kenaikan' | null>(null);
  const [loadingTA, setLoadingTA] = useState(false);

  const tahunIni = new Date().getFullYear();

  const prosesKelulusan = async () => {
    setLoadingTA(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .update({ kelas: `LULUS ${tahunIni}`, kelas_belajar: `LULUS ${tahunIni}` })
        .ilike('kelas', 'IX%');
      if (error) throw error;
      const jumlah = data?.length ?? 0;
      toast.success(`Sukses! ${jumlah} siswa kelas IX telah diproses lulus (${tahunIni}).`);
      setKonfirmasiTA(null);
      if (tabAdmin === 'siswa') fetchAllSiswa();
    } catch (err: any) {
      toast.error(`Gagal: ${err.message}`);
    } finally {
      setLoadingTA(false);
    }
  };

  const prosesKenaikan = async () => {
    setLoadingTA(true);
    try {
      const { data: allKelas } = await supabase.from('students').select('kelas');
      const uniqueKelas = [...new Set((allKelas ?? []).map((r: any) => r.kelas))];

      // ── Tahap A (sekuensial sebelum B): semua kelas VIII → IX secara konkuren ──
      const tahapA = uniqueKelas
        .filter((k: string) => k.startsWith('VIII'))
        .map((k: string) => {
          const newK = 'IX' + k.slice(4);
          return supabase.from('students').update({ kelas: newK, kelas_belajar: newK }).eq('kelas', k);
        });
      await Promise.all(tahapA);

      // ── Tahap B (setelah A selesai): semua kelas VII → VIII secara konkuren ──
      const tahapB = uniqueKelas
        .filter((k: string) => k.startsWith('VII'))
        .map((k: string) => {
          const newK = 'VIII' + k.slice(3);
          return supabase.from('students').update({ kelas: newK, kelas_belajar: newK }).eq('kelas', k);
        });
      await Promise.all(tahapB);

      toast.success('Kenaikan kelas berhasil! VII→VIII, VIII→IX.');
      setKonfirmasiTA(null);
      if (tabAdmin === 'siswa') fetchAllSiswa();
    } catch (err: any) {
      toast.error(`Gagal: ${err.message}`);
    } finally {
      setLoadingTA(false);
    }
  };

  const handleBulkUpdateKelasBelajar = async () => {
    if (selectedStudentIds.length === 0 || !bulkTargetKelas) return;
    setBulkLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({ kelas_belajar: bulkTargetKelas === '__clear__' ? null : bulkTargetKelas })
        .in('id', selectedStudentIds);
      if (error) throw error;
      toast.success(
        bulkTargetKelas === '__clear__'
          ? `Berhasil menghapus kelas belajar dari ${selectedStudentIds.length} siswa`
          : `Berhasil memindahkan ${selectedStudentIds.length} siswa ke kelas belajar ${bulkTargetKelas}`
      );
      setSelectedStudentIds([]);
      setBulkTargetKelas('');
      fetchAllSiswa();
    } catch (err: any) {
      toast.error(`Gagal: ${err.message}`);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleTambahSiswaManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('students').insert([{ nama_siswa: formTambahSiswa.nama_siswa, nisn: formTambahSiswa.nisn, kelas: formTambahSiswa.kelas }]);
      if (error) throw error;
      toast.success('Sukses! Data Siswa baru berhasil ditambahkan.');
      setFormTambahSiswa({ nama_siswa: '', nisn: '', kelas: formTambahSiswa.kelas });
    } catch (err: any) { toast.error(`Gagal: ${err.message}`); } finally { setLoading(false); }
  };

  const handleTambahGuruManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: newUser, error: errUser } = await supabase.from('users').insert([{ 
        username: formTambahGuru.username, 
        role: formTambahGuru.role,
        password: 'guru123'
      }]).select().single();
      if (errUser) throw errUser;

      if (newUser) {
        const bersihMp = formTambahGuru.mataPelajaran.filter((e) => e.mapel.trim());
        const insertData: any = {
          user_id: newUser.id,
          nama_lengkap: formTambahGuru.nama_lengkap,
          mapel: bersihMp.length > 0 ? bersihMp.map((e) => e.mapel).join(', ') : null,
          mata_pelajaran: bersihMp,
          is_wali_kelas: formTambahGuru.is_wali_kelas,
          kelas_wali: formTambahGuru.is_wali_kelas ? formTambahGuru.kelas_wali : null,
          nama_ekstrakurikuler: formTambahGuru.nama_ekstrakurikuler || null
        };
        
        if (formTambahGuru.hari_piket !== 'Tidak Ada') {
           insertData.hari_piket = formTambahGuru.hari_piket;
        }

        await supabase.from('profiles').insert([insertData]);
      }

      toast.success('Sukses! Akun Guru baru berhasil dibuat. Password Default: guru123');
      setFormTambahGuru({ username: '', nama_lengkap: '', mapel: '', mataPelajaran: [], is_wali_kelas: false, kelas_wali: '', nama_ekstrakurikuler: '', role: 'guru_mapel', hari_piket: 'Tidak Ada' });
    } catch (err: any) { toast.error(`Gagal: ${err.message}`); } finally { setLoading(false); }
  };

  const unduhTemplateExcel = (jenis: 'siswa' | 'guru') => {
    let headers = jenis === 'siswa' ? [['nama_siswa', 'nisn', 'jenis_kelamin', 'kelas']] : [['username', 'nama_lengkap', 'mata_pelajaran', 'is_wali_kelas', 'kelas_wali', 'nama_ekstrakurikuler']];
    let contohData = jenis === 'siswa' ? [['Ahmad Fauzi', '0098765432', 'L', 'VIII A'], ['Siti Aminah', '0098765433', 'P', 'VIII A']] : [['budiman_smp', 'Budiman, S.Pd', 'Matematika', 'TRUE', 'VIII C', 'Pramuka']];
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...contohData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Template ${jenis}`);
    XLSX.writeFile(wb, `Template_Import_${jenis}.xlsx`);
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>, jenis: 'siswa' | 'guru') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const rawData: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        if (jenis === 'siswa') {
          const normalisasiJK = (val: any): 'L' | 'P' | null => {
            const teks = String(val || '').trim().toUpperCase();
            if (teks === 'L' || teks.startsWith('LAKI')) return 'L';
            if (teks === 'P' || teks.startsWith('PEREMPUAN')) return 'P';
            return null;
          };

          const baitsGagal: string[] = [];
          const cleanSiswa = rawData
            .map((item: any, idx: number) => {
              const jk = normalisasiJK(item.jenis_kelamin);
              const kelasVal = String(item.kelas || '').trim();
              const namaVal = String(item.nama_siswa || '').trim();
              
              let nisnBersih = "";
              if (item.nisn) {
                const angkaNisn = Number(item.nisn);
                nisnBersih = isNaN(angkaNisn) ? String(item.nisn).trim() : String(Math.round(angkaNisn));
              }

              // 🔥 PENTING: Filter Ketat! Jika NISN kosong, lewatkan baris ini agar Supabase tidak error (Rollback)
              if (!namaVal || !kelasVal || !jk || !nisnBersih) {
                baitsGagal.push(`Baris ${idx + 2} (${namaVal || 'tanpa nama'}): ${!namaVal ? 'nama kosong ' : ''}${!kelasVal ? 'kelas kosong ' : ''}${!jk ? 'L/P tidak valid ' : ''}${!nisnBersih ? 'NISN KOSONG' : ''}`);
                return null;
              }

              return { 
                nama_siswa: namaVal, 
                nisn: nisnBersih, 
                jenis_kelamin: jk, 
                kelas: kelasVal 
              };
            })
            .filter((x): x is { nama_siswa: string; nisn: string; jenis_kelamin: 'L' | 'P'; kelas: string } => x !== null);

          if (cleanSiswa.length > 0) {
            const { error: errSiswa } = await supabase.from('students').insert(cleanSiswa);
            if (errSiswa) throw errSiswa;
          }

          if (baitsGagal.length > 0) {
            toast.warning(`Sukses mengimport ${cleanSiswa.length} data siswa! ${baitsGagal.length} baris dilewati karena data tidak lengkap.`);
          } else {
            toast.success(`Sukses total mengimport ${cleanSiswa.length} data siswa!`);
          }
        } else {
          for (const guru of rawData) {
            const { data: userBaru, error: eUser } = await supabase.from('users').insert([{ 
              username: guru.username,
              password: '123456'
            }]).select().single();
            
            if (!eUser && userBaru) {
              await supabase.from('profiles').insert([{ user_id: userBaru.id, nama_lengkap: guru.nama_lengkap, mapel: guru.mata_pelajaran || null, is_wali_kelas: String(guru.is_wali_kelas).toLowerCase() === 'true', kelas_wali: guru.kelas_wali || null, nama_ekstrakurikuler: guru.nama_ekstrakurikuler || null }]);
            }
          }
          toast.success('Import massal selesai. Password default seluruh guru baru adalah: 123456');
        }
      } catch (err: any) { toast.error(`Gagal: ${err.message}`); } finally { setLoading(false); e.target.value = ''; }
    };
    reader.readAsBinaryString(file);
  };

  const siswaTerfilter = listSiswa.filter((s) => {
    const matchKelas = !filterKelas || s.kelas === filterKelas;
    const matchNama = !searchSiswa || s.nama_siswa.toLowerCase().includes(searchSiswa.toLowerCase());
    return matchKelas && matchNama;
  });

  const selectAllIds = siswaTerfilter.map((s) => s.id);
  const allSelected = selectAllIds.length > 0 && selectAllIds.every((id) => selectedStudentIds.includes(id));
  const someSelected = selectAllIds.some((id) => selectedStudentIds.includes(id));

  useEffect(() => {
    if (masterCheckRef.current) {
      masterCheckRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  if (tabAdmin === null || tabAdmin === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-start border-b border-slate-100 pb-5 mb-6">
            <div>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Portal Admin</span>
              <h2 className="text-xl font-bold text-slate-800 mt-1.5">Administrator Sistem</h2>
              <p className="text-sm text-slate-500 mt-0.5">SIGAP SPENSAWA Control Panel</p>
            </div>
            <button onClick={handleLogout} className="text-sm text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium cursor-pointer">🚪 Keluar Sistem</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setTabAdmin('tambah')} className="flex flex-col items-start p-5 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl hover:border-indigo-500 hover:shadow-md text-left group cursor-pointer md:col-span-2">
              <div className="text-2xl mb-3 p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-600 group-hover:text-white">✨</div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600">Tambah Pengguna Manual</h3>
              <p className="text-[11px] text-slate-500 mt-1">Daftarkan data siswa atau buat akun guru baru lengkap dengan jadwal hari piket.</p>
            </button>
            <button onClick={() => setTabAdmin('siswa')} className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md text-left group cursor-pointer">
              <div className="text-2xl mb-3 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white">🎓</div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">Kelola & Edit Data Siswa</h3>
              <p className="text-[11px] text-slate-500 mt-1">Lihat, edit, dan hapus data siswa per kelas.</p>
            </button>
            <button onClick={() => setTabAdmin('guru')} className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-md text-left group cursor-pointer">
              <div className="text-2xl mb-3 p-2 bg-amber-50 rounded-lg group-hover:bg-amber-600 group-hover:text-white">💼</div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-600">Kelola & Edit Akun Guru</h3>
              <p className="text-[11px] text-slate-500 mt-1">Ubah struktur penugasan mapel, wali kelas, ekskul, dan hari piket mingguan.</p>
            </button>
            <button onClick={() => setTabAdmin('import')} className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md text-left group cursor-pointer md:col-span-2">
              <div className="text-2xl mb-3 p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-600 group-hover:text-white">📥</div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600">Import Massal Excel</h3>
              <p className="text-[11px] text-slate-500 mt-1">Unggah ribuan data siswa atau buat puluhan akun guru sekaligus menggunakan template Excel.</p>
            </button>
            <button onClick={() => setTabAdmin('jadwal')} className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-md text-left group cursor-pointer md:col-span-2">
              <div className="text-2xl mb-3 p-2 bg-amber-50 rounded-lg group-hover:bg-amber-600 group-hover:text-white">📅</div>
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-600">Manajemen Jadwal Mengajar</h3>
              <p className="text-[11px] text-slate-500 mt-1">Tambah, edit, dan hapus jadwal guru per kelas, hari, dan jam pelajaran.</p>
            </button>
          </div>

          {/* ── Card Tahun Ajaran Baru ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-6"
          >
            <h3 className="mb-1 text-sm font-extrabold text-amber-900">
              Proses Tahun Ajaran Baru
            </h3>
            <p className="mb-4 text-[11px] leading-relaxed text-amber-700">
              Perbarui kelas siswa secara masal untuk tahun ajaran baru. 
              Kelas IX akan ditandai lulus, kelas VIII naik ke IX, dan kelas VII naik ke VIII. 
              Data riwayat akademik tetap utuh.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setKonfirmasiTA('kelulusan')}
                className="btn btn-soft btn-error btn-sm gap-1.5"
              >
                <GraduationCap className="size-4" />
                Proses Kelulusan Kelas IX
              </button>
              <button
                onClick={() => setKonfirmasiTA('kenaikan')}
                className="btn btn-soft btn-accent btn-sm gap-1.5"
              >
                <ArrowUpCircle className="size-4" />
                Proses Kenaikan Kelas Masal
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-6">
           <button onClick={() => setTabAdmin(null)} className="text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium cursor-pointer">⬅️ Kembali ke Portal</button>
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            {tabAdmin === 'siswa' && 'Kelola & Edit Data Siswa'}
            {tabAdmin === 'guru' && 'Kelola & Edit Akun Guru'}
            {tabAdmin === 'import' && 'Import Massal Excel'}
            {tabAdmin === 'tambah' && 'Tambah Pengguna Baru'}
            {tabAdmin === 'jadwal' && 'Manajemen Jadwal Mengajar'}
          </span>
        </div>

        {loading && <div className="text-sm text-blue-600 font-bold mb-4 animate-pulse">Sedang sinkronisasi database...</div>}

        {tabAdmin === 'tambah' && (
          <div className="space-y-6">
            <div className="flex border-b border-slate-200">
              <button onClick={() => setTambahMode('siswa')} className={`py-3 px-6 text-sm font-bold transition-colors cursor-pointer ${tambahMode === 'siswa' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>Tambah Data Siswa</button>
              <button onClick={() => setTambahMode('guru')} className={`py-3 px-6 text-sm font-bold transition-colors cursor-pointer ${tambahMode === 'guru' ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}>Buat Akun Guru</button>
            </div>

            {tambahMode === 'siswa' && (
              <form onSubmit={handleTambahSiswaManual} className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                    <input type="text" value={formTambahSiswa.nama_siswa} onChange={(e) => setFormTambahSiswa({ ...formTambahSiswa, nama_siswa: e.target.value })} placeholder="Masukkan nama lengkap" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">NISN</label>
                      <input type="text" value={formTambahSiswa.nisn} onChange={(e) => setFormTambahSiswa({ ...formTambahSiswa, nisn: e.target.value })} placeholder="10 Digit" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Kelas</label>
                      <select value={formTambahSiswa.kelas} onChange={(e) => setFormTambahSiswa({ ...formTambahSiswa, kelas: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" required>
                        <option value="">-- Pilih Kelas --</option>
                        {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg text-sm font-bold cursor-pointer">Simpan Siswa</button>
                </div>
              </form>
            )}

            {tambahMode === 'guru' && (
              <form onSubmit={handleTambahGuruManual} className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-3xl">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Username Login</label>
                      <input type="text" value={formTambahGuru.username} onChange={(e) => setFormTambahGuru({ ...formTambahGuru, username: e.target.value.replace(/\s/g, '') })} placeholder="budiman_smp" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input type="text" value={formTambahGuru.nama_lengkap} onChange={(e) => setFormTambahGuru({ ...formTambahGuru, nama_lengkap: e.target.value })} placeholder="Budiman, S.Pd" className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mata Pelajaran yang Diajar & Kelas Tujuan</label>
                      <div className="space-y-2">
                        {formTambahGuru.mataPelajaran.map((entry, idx) => (
                          <div key={idx} className="flex flex-wrap items-start gap-2 rounded-lg border border-slate-200 bg-white p-2">
                            <input
                              type="text"
                              value={entry.mapel}
                              onChange={(e) => {
                                const next = [...formTambahGuru.mataPelajaran];
                                next[idx] = { ...next[idx], mapel: e.target.value };
                                setFormTambahGuru({ ...formTambahGuru, mataPelajaran: next });
                              }}
                              placeholder="Nama Mapel"
                              className="input input-sm w-36 bg-slate-50"
                            />
                            <div className="flex flex-wrap gap-1">
                              {daftarKelas.map((k) => {
                                const aktif = entry.kelas.includes(k);
                                return (
                                  <button
                                    key={k}
                                    type="button"
                                    onClick={() => {
                                      const next = [...formTambahGuru.mataPelajaran];
                                      next[idx] = {
                                        ...next[idx],
                                        kelas: aktif
                                          ? next[idx].kelas.filter((c) => c !== k)
                                          : [...next[idx].kelas, k],
                                      };
                                      setFormTambahGuru({ ...formTambahGuru, mataPelajaran: next });
                                    }}
                                    className={`badge cursor-pointer px-2 py-1.5 text-[10px] font-semibold transition-all ${
                                      aktif
                                        ? 'badge-soft badge-info ring-1 ring-sky-400/40'
                                        : 'badge-soft badge-ghost text-slate-500 hover:bg-slate-200'
                                    }`}
                                  >
                                    {aktif && (
                                      <svg className="size-2.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                      </svg>
                                    )}
                                    {k}
                                  </button>
                                );
                              })}
                            </div>
                            {formTambahGuru.mataPelajaran.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormTambahGuru({
                                    ...formTambahGuru,
                                    mataPelajaran: formTambahGuru.mataPelajaran.filter((_, i) => i !== idx),
                                  });
                                }}
                                className="btn btn-ghost btn-xs text-red-500"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFormTambahGuru({
                              ...formTambahGuru,
                              mataPelajaran: [...formTambahGuru.mataPelajaran, { mapel: '', kelas: [] }],
                            });
                          }}
                          className="btn btn-soft btn-info btn-xs gap-1"
                        >
                          + Tambah Mapel
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Ekstrakurikuler</label>
                      <input type="text" value={formTambahGuru.nama_ekstrakurikuler} onChange={(e) => setFormTambahGuru({ ...formTambahGuru, nama_ekstrakurikuler: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-indigo-600 mb-1">Jadwal Tugas Piket Harian</label>
                      <select value={formTambahGuru.hari_piket} onChange={(e) => setFormTambahGuru({ ...formTambahGuru, hari_piket: e.target.value })} className="w-full p-2.5 border border-slate-300 bg-white rounded-lg text-sm font-semibold" required>
                        <option value="Tidak Ada">Tidak Ada Tugas Piket</option>
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-4 bg-white rounded-lg border border-slate-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={formTambahGuru.is_wali_kelas} onChange={(e) => setFormTambahGuru({ ...formTambahGuru, is_wali_kelas: e.target.checked })} className="w-5 h-5 text-indigo-600 border-slate-300 rounded" />
                      Wali Kelas
                    </label>
                    {formTambahGuru.is_wali_kelas && (
                      <select value={formTambahGuru.kelas_wali} onChange={(e) => setFormTambahGuru({ ...formTambahGuru, kelas_wali: e.target.value })} className="flex-1 p-2 border border-slate-300 rounded-lg text-sm bg-white" required>
                        <option value="">-- Pilih Kelas Binaan --</option>
                        {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    )}
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg text-sm font-bold cursor-pointer">Simpan & Buat Guru Baru (Password: guru123)</button>
                </div>
              </form>
            )}
          </div>
        )}

        {tabAdmin === 'siswa' && (
          <div className="space-y-6">
            {isEditSiswa && (
              <form onSubmit={handleUpdateSiswa} className="bg-amber-50 p-6 rounded-xl border border-amber-200 mb-6">
                <h2 className="text-sm font-bold text-amber-800 mb-4">Edit Data Siswa</h2>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <input type="text" value={formSiswa.nama_siswa} onChange={(e) => setFormSiswa({ ...formSiswa, nama_siswa: e.target.value })} className="input input-bordered input-sm w-full" required />
                  </div>
                  <div>
                    <input type="text" value={formSiswa.nisn} onChange={(e) => setFormSiswa({ ...formSiswa, nisn: e.target.value })} className="input input-bordered input-sm w-full" required />
                  </div>
                  <div>
                    <select value={formSiswa.kelas} onChange={(e) => setFormSiswa({ ...formSiswa, kelas: e.target.value })} className="select select-bordered select-sm w-full">
                      {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-sm btn-amber flex-1">Update</button>
                    <button type="button" onClick={() => setIsEditSiswa(false)} className="btn btn-sm btn-ghost">Batal</button>
                  </div>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* ── Filter & Search ── */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 border-b border-slate-200">
                <label className="text-sm font-semibold text-slate-700">Filter Kelas:</label>
                <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="select select-bordered select-sm w-36">
                  <option value="">Semua Kelas</option>
                  {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="w-px h-5 bg-slate-300 hidden sm:block" />
                <input
                  type="text"
                  value={searchSiswa}
                  onChange={(e) => setSearchSiswa(e.target.value)}
                  placeholder="Cari nama siswa..."
                  className="input input-bordered input-sm w-full max-w-xs"
                />
                {siswaTerfilter.length < listSiswa.length && (
                  <span className="text-[10px] text-slate-500 ml-auto">
                    {siswaTerfilter.length} / {listSiswa.length} siswa
                  </span>
                )}
              </div>

              {/* ── Floating Bulk Action Panel ── */}
              <AnimatePresence>
                {selectedStudentIds.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden border-b border-blue-200"
                  >
                    <div className="flex flex-wrap items-center gap-3 bg-blue-50 px-4 py-3">
                      <span className="text-sm font-bold text-blue-800 whitespace-nowrap">
                        Terpilih {selectedStudentIds.length} siswa
                      </span>
                      <select
                        value={bulkTargetKelas}
                        onChange={(e) => setBulkTargetKelas(e.target.value)}
                        className="select select-bordered select-sm w-44 bg-white"
                      >
                        <option value="">Pindahkan ke Kelas Belajar…</option>
                        <option value="__clear__">— Hapus Kelas Belajar —</option>
                        {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                      <button
                        onClick={handleBulkUpdateKelasBelajar}
                        disabled={!bulkTargetKelas || bulkLoading}
                        className="btn btn-primary btn-sm"
                      >
                        {bulkLoading && <span className="loading loading-spinner loading-xs" />}
                        Terapkan Perubahan Masal
                      </button>
                      <button
                        onClick={() => { setSelectedStudentIds([]); setBulkTargetKelas(''); }}
                        className="btn btn-ghost btn-sm ml-auto"
                      >
                        Batal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Tabel Siswa ── */}
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200 sticky top-0 z-10">
                      <th className="p-3 w-10">
                        <input
                          ref={masterCheckRef}
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => {
                            if (allSelected) {
                              setSelectedStudentIds((prev) => prev.filter((id) => !selectAllIds.includes(id)));
                            } else {
                              setSelectedStudentIds((prev) => [...new Set([...prev, ...selectAllIds])]);
                            }
                          }}
                          className="checkbox checkbox-sm"
                        />
                      </th>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Kelas Administratif</th>
                      <th className="p-3">Kelas Belajar</th>
                      <th className="p-3 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody ref={parentSiswa} className="divide-y divide-slate-100">
                    {siswaTerfilter.length > 0 ? siswaTerfilter.map((s) => (
                      <tr key={s.id} className={`hover:bg-slate-50/50 transition-colors ${selectedStudentIds.includes(s.id) ? 'bg-blue-50/60' : ''}`}>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(s.id)}
                            onChange={() => {
                              setSelectedStudentIds((prev) =>
                                prev.includes(s.id)
                                  ? prev.filter((id) => id !== s.id)
                                  : [...prev, s.id]
                              );
                            }}
                            className="checkbox checkbox-sm"
                          />
                        </td>
                        <td className="p-3 font-semibold text-slate-900">{s.nama_siswa}</td>
                        <td className="p-3 text-slate-600 font-mono">{s.nisn}</td>
                        <td className="p-3">
                          <span className="badge badge-soft badge-ghost badge-sm">{s.kelas}</span>
                        </td>
                        <td className="p-3">
                          {s.kelas_belajar ? (
                            <span className="badge badge-soft badge-info badge-sm">{s.kelas_belajar}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => { setFormSiswa(s); setIsEditSiswa(true); }}
                              className="btn btn-ghost btn-xs text-amber-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleHapusSiswa(s.id)}
                              className="btn btn-ghost btn-xs text-red-600"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          {searchSiswa || filterKelas
                            ? 'Tidak ada siswa yang cocok dengan filter.'
                            : 'Belum ada data siswa.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tabAdmin === 'guru' && (
          <div className="space-y-6">
            {isEditGuru && (
              <form onSubmit={handleUpdateGuru} className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
                <h2 className="text-sm font-bold text-amber-800 mb-4">Edit Struktur & Jadwal Piket Guru</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Nama Lengkap Guru</label>
                    <input type="text" value={formGuru.nama_lengkap} onChange={(e) => setFormGuru({ ...formGuru, nama_lengkap: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">Ekstrakurikuler</label>
                    <input type="text" value={formGuru.nama_ekstrakurikuler} onChange={(e) => setFormGuru({ ...formGuru, nama_ekstrakurikuler: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-700 mb-1">Jadwal Tugas Piket Harian</label>
                    <select value={formGuru.hari_piket} onChange={(e) => setFormGuru({ ...formGuru, hari_piket: e.target.value })} className="w-full p-2 border border-indigo-300 rounded-lg text-sm bg-white font-semibold" required>
                      <option value="Tidak Ada">Tidak Ada Tugas Piket</option>
                      <option value="Senin">Hari Senin</option>
                      <option value="Selasa">Hari Selasa</option>
                      <option value="Rabu">Hari Rabu</option>
                      <option value="Kamis">Hari Kamis</option>
                      <option value="Jumat">Hari Jumat</option>
                    </select>
                  </div>
                </div>

                {/* ── Multi Mapel ── */}
                <div className="mt-3 rounded-lg border border-amber-200 bg-white p-3">
                  <label className="mb-2 block text-[10px] font-semibold text-slate-600">
                    Mata Pelajaran yang Diajar & Kelas Tujuan
                  </label>
                  <div className="space-y-2">
                    {formGuru.mataPelajaran.map((entry, idx) => (
                      <div key={idx} className="flex flex-wrap items-start gap-2 rounded-md border border-slate-200 bg-slate-50 p-2">
                        <input
                          type="text"
                          value={entry.mapel}
                          onChange={(e) => {
                            const next = [...formGuru.mataPelajaran];
                            next[idx] = { ...next[idx], mapel: e.target.value };
                            setFormGuru({ ...formGuru, mataPelajaran: next });
                          }}
                          placeholder="Nama Mapel"
                          className="input input-xs w-36 bg-white"
                        />
                        <div className="flex flex-wrap gap-1">
                          {daftarKelas.map((k) => {
                            const aktif = entry.kelas.includes(k);
                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => {
                                  const next = [...formGuru.mataPelajaran];
                                  next[idx] = {
                                    ...next[idx],
                                    kelas: aktif
                                      ? next[idx].kelas.filter((c) => c !== k)
                                      : [...next[idx].kelas, k],
                                  };
                                  setFormGuru({ ...formGuru, mataPelajaran: next });
                                }}
                                className={`badge cursor-pointer px-2 py-1.5 text-[10px] font-semibold transition-all ${
                                  aktif
                                    ? 'badge-soft badge-info ring-1 ring-sky-400/40'
                                    : 'badge-soft badge-ghost text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {aktif && (
                                  <svg className="size-2.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                )}
                                {k}
                              </button>
                            );
                          })}
                        </div>
                        {formGuru.mataPelajaran.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormGuru({
                                ...formGuru,
                                mataPelajaran: formGuru.mataPelajaran.filter((_, i) => i !== idx),
                              });
                            }}
                            className="btn btn-ghost btn-xs text-red-500"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormGuru({
                          ...formGuru,
                          mataPelajaran: [...formGuru.mataPelajaran, { mapel: '', kelas: [] }],
                        });
                      }}
                      className="btn btn-soft btn-info btn-xs gap-1"
                    >
                      + Tambah Mapel
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-3 bg-white rounded-lg border border-slate-200 mt-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={formGuru.is_wali_kelas} onChange={(e) => setFormGuru({ ...formGuru, is_wali_kelas: e.target.checked })} className="w-4 h-4 text-blue-600 border-slate-300 rounded-sm" />
                    Wali Kelas
                  </label>
                  {formGuru.is_wali_kelas && (
                    <select value={formGuru.kelas_wali} onChange={(e) => setFormGuru({ ...formGuru, kelas_wali: e.target.value })} className="p-1.5 border border-slate-300 rounded-lg text-sm bg-white" required>
                      <option value="">-- Pilih Kelas --</option>
                      {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
                    </select>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer">Simpan Update</button>
                  <button type="button" onClick={() => setIsEditGuru(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer">Batal</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                      <th className="p-3">Username</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Mata Pelajaran</th>
                      <th className="p-3">Jadwal Piket</th>
                      <th className="p-3">Wali Kelas</th>
                      <th className="p-3">Ekskul</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody ref={parentGuru} className="divide-y divide-slate-100">
                    {listGuru.length === 0 ? (
                      <tr><td colSpan={7} className="p-8 text-center text-slate-400">Tidak ada data guru.</td></tr>
                    ) : (
                      listGuru.map((g) => (
                        <tr key={g.pengenal} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono text-blue-700 text-[11px]">{g.username}</td>
                          <td className="p-3 font-semibold text-slate-900">{g.nama_lengkap}</td>
                          <td className="p-3">
                            {g.mataPelajaran?.length > 0
                              ? g.mataPelajaran.map((e: MapelKelasEntry) => (
                                  <span key={e.mapel} className="inline-flex items-center gap-1 mr-1 mb-0.5">
                                    <span className="badge badge-soft badge-info badge-xs">{e.mapel}</span>
                                    {e.kelas.length > 0 && (
                                      <span className="text-[9px] text-slate-500">{e.kelas.join(', ')}</span>
                                    )}
                                  </span>
                                ))
                              : g.mapel || '-'}
                          </td>
                          <td className="p-3 font-medium">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
                              g.hari_piket !== 'Tidak Ada' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {g.hari_piket !== 'Tidak Ada' ? `Piket: ${g.hari_piket}` : 'Tidak Ada'}
                            </span>
                          </td>
                          <td className="p-3">{g.is_wali_kelas ? `✅ ${g.kelas_wali}` : '❌ Bukan'}</td>
                          <td className="p-3 text-slate-600">{g.nama_ekstrakurikuler || '-'}</td>
                          <td className="p-3 flex justify-center gap-2">
                            <button onClick={() => { setFormGuru(g); setIsEditGuru(true); }} className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md font-semibold cursor-pointer">Edit</button>
                            <button onClick={() => handleHapusGuru(g.pengenal, g.id_pengguna)} className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md font-semibold cursor-pointer">Hapus</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tabAdmin === 'jadwal' && (
          <div className="space-y-6">
            {pesanJadwal && (
              <div
                className={`p-4 rounded-xl border text-sm font-semibold ${
                  pesanJadwal.type === 'sukses'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {pesanJadwal.text}
              </div>
            )}

            <form
              onSubmit={handleSimpanJadwal}
              style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
              className="p-6 rounded-xl border max-w-3xl space-y-5"
            >
              <h3 className="text-base font-bold" style={{ color: '#1d1601' }}>Tambah Jadwal Baru</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Nama Guru</label>
                  <select
                    value={formJadwal.user_id}
                    onChange={(e) => {
                      const selected = listProfilesForJadwal.find(p => p.user_id?.toString() === e.target.value);
                      setFormJadwal({
                        ...formJadwal,
                        user_id: e.target.value,
                        nama_lengkap: selected?.nama_lengkap || '',
                        mata_pelajaran: selected?.mata_pelajaran?.[0]?.mapel || selected?.mapel || '',
                      });
                    }}
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    className="w-full p-2.5 border rounded-lg text-base"
                    required
                  >
                    <option value="">-- Pilih Guru --</option>
                    {listProfilesForJadwal
                      .filter(p => p.nama_lengkap)
                      .map((p) => (
                        <option key={p.user_id} value={p.user_id}>{p.nama_lengkap}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formJadwal.mata_pelajaran}
                    onChange={(e) => setFormJadwal({ ...formJadwal, mata_pelajaran: e.target.value })}
                    placeholder="Contoh: Matematika"
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    className="w-full p-2.5 border rounded-lg text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Kelas</label>
                  <select
                    value={formJadwal.kelas}
                    onChange={(e) => setFormJadwal({ ...formJadwal, kelas: e.target.value })}
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    className="w-full p-2.5 border rounded-lg text-base"
                    required
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {daftarKelas.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Hari</label>
                  <select
                    value={formJadwal.hari}
                    onChange={(e) => setFormJadwal({ ...formJadwal, hari: e.target.value })}
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    className="w-full p-2.5 border rounded-lg text-base"
                    required
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Jam Mulai Mengajar</label>
                  <select
                    value={formJadwal.jam_mulai}
                    onChange={(e) => setFormJadwal({ ...formJadwal, jam_mulai: e.target.value })}
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    className="w-full p-2.5 border rounded-lg text-base"
                    required
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((j) => (
                      <option key={j} value={j}>Jam Ke-{j}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#1d1601' }}>Durasi (Jam Pelajaran)</label>
                  <select
                    value={formJadwal.durasi_jam}
                    onChange={(e) => setFormJadwal({ ...formJadwal, durasi_jam: e.target.value })}
                    style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
                    className="w-full p-2.5 border rounded-lg text-base"
                    required
                  >
                    {Array.from({ length: 6 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>{d} Jam</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={simpangJadwal}
                style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                className="w-full p-3 rounded-lg text-base font-bold cursor-pointer hover:opacity-90 disabled:opacity-50"
              >
                {simpangJadwal ? 'Menyimpan...' : 'Simpan Jadwal'}
              </button>
            </form>

            {/* ── Impor Massal Excel ── */}
            <div
              style={{ backgroundColor: '#fefaef', borderColor: '#f4aa18', color: '#1d1601' }}
              className="p-6 rounded-xl border max-w-3xl space-y-4"
            >
              <h3 className="text-base font-bold" style={{ color: '#1d1601' }}>Impor Massal via Excel</h3>
              <p className="text-sm" style={{ color: '#1d1601' }}>
                Gunakan template untuk mengisi data jadwal secara massal. Pastikan username guru sudah terdaftar di sistem.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={unduhTemplateJadwal}
                  style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                  className="px-4 py-2 rounded-lg text-base font-bold cursor-pointer hover:opacity-90"
                >
                  📥 Unduh Template Excel Jadwal
                </button>
                <label
                  style={{ borderColor: '#f4aa18', color: '#1d1601' }}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-[#f4aa18]/10 text-base"
                >
                  <span>📂 Pilih File Excel</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleImportJadwal}
                    className="hidden"
                  />
                </label>
              </div>

              {importLogJadwal && importLogJadwal.gagal.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-red-700">Detail Baris Gagal ({importLogJadwal.gagal.length} baris):</h4>
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3 text-xs space-y-1">
                    {importLogJadwal.gagal.map((g, i) => (
                      <div key={i} className="text-red-800">
                        <strong>Baris {g.baris}:</strong> {g.pesan}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Daftar Jadwal ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold" style={{ color: '#1d1601' }}>Daftar Jadwal Tersimpan</h3>
                {listJadwal.length > 0 && (
                  <button
                    onClick={hapusSemuaJadwal}
                    className="text-sm text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                  >
                    Hapus Semua
                  </button>
                )}
              </div>
              {listJadwal.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada jadwal. Gunakan form di atas untuk menambahkan.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#f4aa18' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}>
                        <th className="p-2.5 text-left font-bold">#</th>
                        <th className="p-2.5 text-left font-bold">Guru</th>
                        <th className="p-2.5 text-left font-bold">Mapel</th>
                        <th className="p-2.5 text-left font-bold">Kelas</th>
                        <th className="p-2.5 text-left font-bold">Hari</th>
                        <th className="p-2.5 text-left font-bold">Jam</th>
                        <th className="p-2.5 text-left font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listJadwal.map((j, idx) => {
                        const jamAkhir = j.jam_mulai + j.durasi_jam - 1;
                        const profileGuru = listProfilesForJadwal.find(p => p.user_id === j.user_id);
                        return (
                          <tr
                            key={j.id}
                            style={{ backgroundColor: idx % 2 === 0 ? '#fefaef' : '#ffffff', color: '#1d1601' }}
                            className="border-b"
                          >
                            <td className="p-2.5">{idx + 1}</td>
                            <td className="p-2.5 font-medium">{profileGuru?.nama_lengkap || `(user_id: ${j.user_id})`}</td>
                            <td className="p-2.5">{j.mata_pelajaran}</td>
                            <td className="p-2.5">{j.kelas}</td>
                            <td className="p-2.5">{j.hari}</td>
                            <td className="p-2.5">{j.jam_mulai}–{jamAkhir}</td>
                            <td className="p-2.5">
                              <button
                                onClick={() => handleHapusJadwal(j.id)}
                                style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
                                className="text-xs font-bold px-2.5 py-1 rounded-lg cursor-pointer hover:opacity-80"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {tabAdmin === 'import' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center space-y-5">
              <div className="text-4xl">🎓</div>
              <h3 className="font-bold text-slate-800 text-base">Import Data Rombel Siswa</h3>
              <button onClick={() => unduhTemplateExcel('siswa')} className="text-sm text-blue-600 hover:underline font-bold cursor-pointer">📥 Unduh Template Siswa.xlsx</button>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleImportExcel(e, 'siswa')} className="text-sm text-slate-600 cursor-pointer" />
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center space-y-5">
              <div className="text-4xl">💼</div>
              <h3 className="font-bold text-slate-800 text-base">Import Akun Kredensial Guru</h3>
              <button onClick={() => unduhTemplateExcel('guru')} className="text-sm text-blue-600 hover:underline font-bold cursor-pointer">📥 Unduh Template Guru.xlsx</button>
              <input type="file" accept=".xlsx, .xls" onChange={(e) => handleImportExcel(e, 'guru')} className="text-sm text-slate-600 cursor-pointer" />
            </div>
          </div>
        )}

        {/* ── Modal Konfirmasi Hapus ── */}
        <dialog ref={modalRef} className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
            <p className="py-4 text-sm text-base-content/70">
              {confirmDelete.type === 'siswa'
                ? 'Apakah Anda yakin ingin menghapus data siswa ini secara permanen?'
                : 'Menghapus data guru akan menghapus penugasan profiles miliknya. Lanjutkan?'}
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => { modalRef.current?.close(); setConfirmDelete({ show: false, type: 'siswa' }); }}
              >
                Batal
              </button>
              <button
                className="btn btn-error"
                onClick={confirmDelete.type === 'siswa' ? execHapusSiswa : execHapusGuru}
              >
                Hapus
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setConfirmDelete({ show: false, type: 'siswa' })}>tutup</button>
          </form>
        </dialog>

        {/* ── Modal Konfirmasi Tahun Ajaran ── */}
        <AnimatePresence>
          {konfirmasiTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
              onClick={() => setKonfirmasiTA(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white shadow-2xl"
              >
                <div className="px-6 py-5">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <AlertTriangle className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {konfirmasiTA === 'kelulusan' ? 'Proses Kelulusan Kelas IX' : 'Proses Kenaikan Kelas Masal'}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {konfirmasiTA === 'kelulusan'
                      ? `Semua siswa kelas IX (IX A, IX B, ...) akan ditandai sebagai "LULUS ${tahunIni}". Data riwayat akademik tetap tersimpan. Tindakan ini tidak dapat dibatalkan.`
                      : 'Semua siswa kelas VIII naik ke IX, lalu kelas VII naik ke VIII secara berurutan. Data nilai dan absensi tetap utuh. Tindakan ini tidak dapat dibatalkan.'}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                  <button
                    onClick={() => setKonfirmasiTA(null)}
                    className="btn btn-ghost btn-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={konfirmasiTA === 'kelulusan' ? prosesKelulusan : prosesKenaikan}
                    disabled={loadingTA}
                    className={`btn btn-sm gap-1.5 ${
                      konfirmasiTA === 'kelulusan' ? 'btn-error' : 'btn-accent'
                    }`}
                  >
                    {loadingTA && <span className="loading loading-spinner loading-xs" />}
                    {konfirmasiTA === 'kelulusan' ? `Luluskan ${tahunIni}` : 'Naikkan Kelas'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
