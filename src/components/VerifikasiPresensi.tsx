import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { CheckCircle, Lock, RefreshCw } from 'lucide-react';

type StatusKehadiran = 'Hadir' | 'Sakit' | 'Izin' | 'Alpha';

const STATUS_LIST: StatusKehadiran[] = ['Hadir', 'Sakit', 'Izin', 'Alpha'];

const STATUS_WARNA: Record<StatusKehadiran, string> = {
  Hadir: 'bg-emerald-600 text-white',
  Sakit: 'bg-amber-500 text-white',
  Izin: 'bg-blue-600 text-white',
  Alpha: 'bg-rose-600 text-white',
};

export default function VerifikasiPresensi() {
  const profile = useAuthStore((s) => s.profile);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [localEdits, setLocalEdits] = useState<Record<number, StatusKehadiran>>({});
  const [kolomTersedia, setKolomTersedia] = useState(true);

  const kelasWali = profile?.kelas_wali;

  const fetchPending = useCallback(async () => {
    if (!kelasWali) return;
    setLoading(true);
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { data: journals, error: eJ } = await supabase
        .from('teaching_journals')
        .select('id, mata_pelajaran, jam_ke')
        .eq('kelas', kelasWali)
        .gte('created_at', todayStart.toISOString())
        .lte('created_at', todayEnd.toISOString());

      if (eJ) throw eJ;
      if (!journals?.length) { setRecords([]); return; }

      const jIds = journals.map((j: any) => j.id);
      const jMap = new Map<number, { mapel: string; jamKe: string }>();
      journals.forEach((j: any) => jMap.set(j.id, { mapel: j.mata_pelajaran, jamKe: j.jam_ke }));

      /* Query with status_verifikasi — tolerate missing column */
      let att: any[];
      try {
        const res = await supabase
          .from('student_attendances')
          .select('id, teaching_journal_id, student_id, status, status_verifikasi')
          .in('teaching_journal_id', jIds)
          .in('status_verifikasi', ['pending', 'verified_wali_kelas'])
          .order('student_id');
        if (res.error) throw res.error;
        att = res.data ?? [];
      } catch (_colErr: any) {
        /* Column not yet in DB — query all records w/o filter */
        console.warn('⚠️ status_verifikasi column not found — falling back to unfiltered query');
        setKolomTersedia(false);
        const res = await supabase
          .from('student_attendances')
          .select('id, teaching_journal_id, student_id, status')
          .in('teaching_journal_id', jIds)
          .order('student_id');
        if (res.error) throw res.error;
        att = (res.data ?? []).map((a: any) => ({ ...a, status_verifikasi: 'pending' }));
      }

      if (!att.length) { setRecords([]); return; }

      const sIds = [...new Set(att.map((a: any) => a.student_id))];
      const { data: students } = await supabase
        .from('students')
        .select('id, nama_siswa')
        .in('id', sIds);
      const sMap = new Map<number, string>();
      if (students) students.forEach((s: any) => sMap.set(s.id, s.nama_siswa));

      const grouped = att.map((a: any) => ({
        id: a.id,
        teaching_journal_id: a.teaching_journal_id,
        student_id: a.student_id,
        status: a.status,
        status_verifikasi: a.status_verifikasi ?? 'pending',
        student_name: sMap.get(a.student_id) || `(id: ${a.student_id})`,
        journal_mapel: jMap.get(a.teaching_journal_id)?.mapel,
        journal_jam_ke: jMap.get(a.teaching_journal_id)?.jamKe,
      }));

      setRecords(grouped);
      setLocalEdits({});
    } catch (err: any) {
      toast.error('Gagal memuat data presensi: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kelasWali]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const editStatus = (recordId: number, status: StatusKehadiran) => {
    setLocalEdits((prev) => ({ ...prev, [recordId]: status }));
  };

  const pendings = records.filter((r) => !kolomTersedia || r.status_verifikasi === 'pending');
  const lockeds = records.filter((r) => kolomTersedia && r.status_verifikasi === 'verified_wali_kelas');

  const handleVerifyAll = async () => {
    if (!kelasWali) return;
    setVerifying(true);
    try {
      const pendingIds = pendings.map((r) => r.id);
      if (!pendingIds.length) {
        toast.error('Tidak ada data presensi yang menunggu verifikasi.');
        setVerifying(false);
        return;
      }

      /* Terapkan edit lokal */
      for (const [recordId, newStatus] of Object.entries(localEdits)) {
        const { error: eUpd } = await supabase
          .from('student_attendances')
          .update({ status: newStatus })
          .eq('id', parseInt(recordId));
        if (eUpd) console.error('Gagal update status #' + recordId, eUpd);
      }

      /* Kunci dengan status_verifikasi */
      const { error } = await supabase
        .from('student_attendances')
        .update({ status_verifikasi: 'verified_wali_kelas', updated_at: new Date().toISOString() })
        .in('id', pendingIds);

      if (error) throw error;

      toast.success('Presensi Kelas Binaan Berhasil Diverifikasi dan Dikunci!');
      setLocalEdits({});
      fetchPending();
    } catch (err: any) {
      toast.error('Gagal memverifikasi: ' + err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (!kelasWali) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5 space-y-4"
      style={{
        backgroundColor: '#fefaef',
        borderColor: '#f4aa18',
        color: '#1d1601',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold" style={{ color: '#1d1601' }}>
            Persetujuan Presensi Kelas Binaan ({kelasWali})
          </h3>
          <p className="text-sm mt-0.5" style={{ color: '#1d1601' }}>
            {pendings.length} menunggu &bull; {lockeds.length} sudah diverifikasi
            {!kolomTersedia && (
              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                (kolom verifikasi belum ada — jalankan migrasi DB)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchPending}
          disabled={loading}
          className="p-2 rounded-lg cursor-pointer"
          style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
        >
          <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <p className="text-base animate-pulse font-semibold" style={{ color: '#1d1601' }}>
          Memuat data presensi...
        </p>
      ) : records.length === 0 ? (
        <p className="text-base" style={{ color: '#1d1601' }}>
          Belum ada data presensi dari Guru Mapel untuk hari ini.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#f4aa18' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}>
                <th className="p-2.5 text-left font-bold">Nama Siswa</th>
                <th className="p-2.5 text-left font-bold">Mapel</th>
                <th className="p-2.5 text-left font-bold">Jam</th>
                <th className="p-2.5 text-center font-bold">Status Guru</th>
                <th className="p-2.5 text-center font-bold">Koreksi Wali</th>
                <th className="p-2.5 text-center font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => {
                const isPending = !kolomTersedia || r.status_verifikasi === 'pending';
                const edited = localEdits[r.id] !== undefined;
                const displayStatus = edited ? localEdits[r.id] : r.status;
                return (
                  <tr
                    key={r.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#fefaef' : '#ffffff',
                      color: '#1d1601',
                    }}
                    className="border-b"
                  >
                    <td className="p-2.5 font-medium">{r.student_name}</td>
                    <td className="p-2.5">{r.journal_mapel || '-'}</td>
                    <td className="p-2.5">{r.journal_jam_ke || '-'}</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          STATUS_WARNA[displayStatus as StatusKehadiran] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {isPending ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {STATUS_LIST.map((s) => (
                            <button
                              key={s}
                              onClick={() => editStatus(r.id, s)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                                displayStatus === s
                                  ? STATUS_WARNA[s]
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold"
                            style={{ backgroundColor: '#4bf666', color: '#1d1601' }}
                          >
                            <CheckCircle className="size-3" />
                            Terverifikasi
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 text-center">
                      {isPending ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold"
                          style={{ backgroundColor: '#4bf666', color: '#1d1601' }}
                        >
                          <Lock className="size-3" />
                          Dikunci
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pendings.length > 0 && (
        <button
          onClick={handleVerifyAll}
          disabled={verifying}
          className="w-full p-3 rounded-lg text-base font-bold cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: '#f4aa18', color: '#1d1601' }}
        >
          {verifying ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="size-4 animate-spin" />
              Memproses...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Lock className="size-4" />
              Verifikasi & Simpan Permanen Presensi
            </span>
          )}
        </button>
      )}
    </motion.div>
  );
}
