import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { kredensial } from '@/data/credentials';
import { presensi as presensiAwal, sesi as sesiAwal, users } from '@/data/dummy';
import type { Presensi, Sesi, User } from '@/types';

import {
  bukaSesi as bukaSesiLogika,
  catatPresensi as catatPresensiLogika,
  cocokkanKredensial,
  presensiSaya as presensiSayaLogika,
  rekapSesi as rekapSesiLogika,
  sesiUntuk as sesiUntukLogika,
  sudahPresensi as sudahPresensiLogika,
  tutupSesi as tutupSesiLogika,
  type HasilAksi,
  type HasilLogin,
} from './session-logic';

export type { HasilAksi, HasilLogin } from './session-logic';

type Store = {
  user: User | null;
  sesi: Sesi[];
  presensi: Presensi[];
  login: (username: string, password: string) => HasilLogin;
  logout: () => void;
  setUser: (pengguna: User | null) => void;
  gantiPeranDemo: (userId?: string) => User | null;
  sesiById: (sesiId: string) => Sesi | undefined;
  sesiUntuk: (user: User) => Sesi[];
  bukaSesi: (sesiId: string) => HasilAksi;
  tutupSesi: (sesiId: string) => HasilAksi;
  catatPresensi: (sesiId: string, praktikanId: string) => HasilAksi;
  presensiSaya: (praktikanId: string) => Presensi[];
  rekapSesi: (sesiId: string) => { praktikan: User; waktu: string }[];
  sudahPresensi: (sesiId: string, praktikanId: string) => boolean;
};

const SessionContext = createContext<Store | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sesi, setSesi] = useState<Sesi[]>(sesiAwal);
  const [presensi, setPresensi] = useState<Presensi[]>(presensiAwal);

  const login = useCallback((username: string, password: string): HasilLogin => {
    const hasil = cocokkanKredensial(kredensial, users, username, password);
    if (hasil.ok) setUser(hasil.user);
    return hasil;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const gantiPeranDemo = useCallback(
    (userId?: string): User | null => {
      const tujuanId =
        userId ?? (user ? (user.peran === 'asisten' ? 'mhs-1' : 'asisten-1') : null);
      if (!tujuanId) return null;

      const tujuan = users.find((u) => u.id === tujuanId);
      if (!tujuan) return null;

      setUser(tujuan);
      return tujuan;
    },
    [user],
  );

  const sesiById = useCallback((sesiId: string) => sesi.find((s) => s.id === sesiId), [sesi]);

  const bukaSesi = useCallback(
    (sesiId: string): HasilAksi => {
      const target = sesi.find((s) => s.id === sesiId);
      if (!target) return { ok: false, pesan: 'Sesi tidak ditemukan' };

      const hasil = bukaSesiLogika(target, new Date().toISOString());
      if (!hasil.ok) return hasil;

      setSesi((daftar) => daftar.map((s) => (s.id === sesiId ? hasil.sesi : s)));
      return { ok: true, pesan: hasil.pesan };
    },
    [sesi],
  );

  const tutupSesi = useCallback(
    (sesiId: string): HasilAksi => {
      const target = sesi.find((s) => s.id === sesiId);
      if (!target) return { ok: false, pesan: 'Sesi tidak ditemukan' };

      const hasil = tutupSesiLogika(target, new Date().toISOString());
      if (!hasil.ok) return hasil;

      setSesi((daftar) => daftar.map((s) => (s.id === sesiId ? hasil.sesi : s)));
      return { ok: true, pesan: hasil.pesan };
    },
    [sesi],
  );

  const catatPresensi = useCallback(
    (sesiId: string, praktikanId: string): HasilAksi => {
      const target = sesi.find((s) => s.id === sesiId);
      if (!target) return { ok: false, pesan: 'Sesi tidak ditemukan' };

      const hasil = catatPresensiLogika(target, presensi, praktikanId, new Date().toISOString());
      if (!hasil.ok) return hasil;

      setPresensi((daftar) => [...daftar, hasil.presensi]);
      return { ok: true, pesan: hasil.pesan };
    },
    [sesi, presensi],
  );

  const presensiSaya = useCallback(
    (praktikanId: string) => presensiSayaLogika(presensi, praktikanId),
    [presensi],
  );

  const rekapSesi = useCallback(
    (sesiId: string) => rekapSesiLogika(sesiId, presensi, users),
    [presensi],
  );

  const sudahPresensi = useCallback(
    (sesiId: string, praktikanId: string) => sudahPresensiLogika(presensi, sesiId, praktikanId),
    [presensi],
  );

  const store = useMemo<Store>(
    () => ({
      user,
      sesi,
      presensi,
      login,
      logout,
      setUser,
      gantiPeranDemo,
      sesiById,
      sesiUntuk: (pengguna: User) => sesiUntukLogika(sesi, pengguna),
      bukaSesi,
      tutupSesi,
      catatPresensi,
      presensiSaya,
      rekapSesi,
      sudahPresensi,
    }),
    [
      user,
      sesi,
      presensi,
      login,
      logout,
      gantiPeranDemo,
      sesiById,
      bukaSesi,
      tutupSesi,
      catatPresensi,
      presensiSaya,
      rekapSesi,
      sudahPresensi,
    ],
  );

  return <SessionContext.Provider value={store}>{children}</SessionContext.Provider>;
}

export function useSession(): Store {
  const store = useContext(SessionContext);
  if (!store) throw new Error('useSession harus dipakai di dalam SessionProvider');
  return store;
}
