import { create } from 'zustand';

/* ─── Types ─── */

export interface MapelEntry {
  mapel: string;
  kelas: string[];
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface UserProfile {
  user_id: string;
  nama_lengkap: string;
  mapel: string | null;
  mata_pelajaran: MapelEntry[] | null;
  is_wali_kelas: boolean;
  kelas_wali: string | null;
  nama_ekstrakurikuler: string | null;
  hari_piket?: string;
}

export type RoleView =
  | 'guru_mapel'
  | 'wali_kelas'
  | 'pembina_ekskul'
  | 'guru_piket'
  | 'guru_bk'
  | 'kurikulum'
  | null;

/* ─── Store Interface ─── */

interface AuthStore {
  user: AuthUser | null;
  profile: UserProfile | null;
  activeRoleView: RoleView;
  isOnline: boolean;

  setAuth: (user: AuthUser, profile: UserProfile) => void;
  setActiveRoleView: (role: RoleView) => void;
  setOnlineStatus: (status: boolean) => void;
  logout: () => void;
}

/* ─── Store Implementation ─── */

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  activeRoleView: null,
  isOnline: true,

  setAuth: (user, profile) => set({ user, profile }),

  setActiveRoleView: (role) => set({ activeRoleView: role }),

  setOnlineStatus: (status) => set({ isOnline: status }),

  logout: () =>
    set({
      user: null,
      profile: null,
      activeRoleView: null,
    }),
}));

/* ─── Selector Helpers (optional, for derived booleans) ─── */

export const selectIsAdmin = (s: AuthStore) => s.user?.role === 'admin';
export const selectIsKurikulum = (s: AuthStore) => s.user?.role === 'kurikulum';
export const selectIsPiket = (s: AuthStore) =>
  s.user?.role === 'guru_piket' ||
  (s.profile?.hari_piket != null && s.profile.hari_piket !== 'Tidak Ada');
export const selectIsGureBK = (s: AuthStore) => s.user?.role === 'guru_bk';

export const selectUserId = (s: AuthStore) => s.profile?.user_id ?? '';

const HARI_INDONESIA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

export const selectPicketDay = (s: AuthStore) => s.profile?.hari_piket?.trim() ?? null;

export const selectPicketAccessGranted = (s: AuthStore) => {
  const hariPiket = s.profile?.hari_piket?.trim().toLowerCase();
  if (!hariPiket || hariPiket === 'tidak ada') return false;
  const todayName = HARI_INDONESIA[new Date().getDay()].toLowerCase();
  return hariPiket === todayName;
};
