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
  gantiPeran as gantiPeranLogika,
  keluar as keluarLogika,
  masuk as masukLogika,
  presensiSaya as presensiSayaLogika,
  rekapSesi as rekapSesiLogika,
  sesiUntuk as sesiUntukLogika,
  sudahPresensi as sudahPresensiLogika,
  tutupSesi as tutupSesiLogika,
  type HasilAksi,
  type HasilLogin,
  type StateAplikasi,
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

const AWAL: StateAplikasi = { user: null, sesi: sesiAwal, presensi: presensiAwal };

const SessionContext = createContext<Store | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StateAplikasi>(AWAL);

  const login = useCallback(
    (username: string, password: string): HasilLogin => {
      const hasil = masukLogika(state, kredensial, users, username, password);
      if (!hasil.ok) return hasil;

      setState(hasil.state);
      return { ok: true, user: hasil.user };
    },
    [state],
  );

  const logout = useCallback(() => setState(keluarLogika), []);

  const setUser = useCallback(
    (pengguna: User | null) => setState((lama) => ({ ...lama, user: pengguna })),
    [],
  );

  const gantiPeranDemo = useCallback(
    (userId?: string): User | null => {
      const hasil = gantiPeranLogika(state, users, userId);
      if (!hasil.ok) return null;

      setState(hasil.state);
      return hasil.user;
    },
    [state],
  );

  const sesiById = useCallback((sesiId: string) => state.sesi.find((s) => s.id === sesiId), [
    state.sesi,
  ]);

  const bukaSesi = useCallback(
    (sesiId: string): HasilAksi => {
      const hasil = bukaSesiLogika(state, sesiId, new Date().toISOString());
      if (!hasil.ok) return hasil;

      setState(hasil.state);
      return { ok: true, pesan: hasil.pesan };
    },
    [state],
  );

  const tutupSesi = useCallback(
    (sesiId: string): HasilAksi => {
      const hasil = tutupSesiLogika(state, sesiId, new Date().toISOString());
      if (!hasil.ok) return hasil;

      setState(hasil.state);
      return { ok: true, pesan: hasil.pesan };
    },
    [state],
  );

  const catatPresensi = useCallback(
    (sesiId: string, praktikanId: string): HasilAksi => {
      const hasil = catatPresensiLogika(state, sesiId, praktikanId, new Date().toISOString());
      if (!hasil.ok) return hasil;

      setState(hasil.state);
      return { ok: true, pesan: hasil.pesan };
    },
    [state],
  );

  const presensiSaya = useCallback(
    (praktikanId: string) => presensiSayaLogika(state.presensi, praktikanId),
    [state.presensi],
  );

  const rekapSesi = useCallback(
    (sesiId: string) => rekapSesiLogika(sesiId, state.presensi, users),
    [state.presensi],
  );

  const sudahPresensi = useCallback(
    (sesiId: string, praktikanId: string) =>
      sudahPresensiLogika(state.presensi, sesiId, praktikanId),
    [state.presensi],
  );

  const store = useMemo<Store>(
    () => ({
      user: state.user,
      sesi: state.sesi,
      presensi: state.presensi,
      login,
      logout,
      setUser,
      gantiPeranDemo,
      sesiById,
      sesiUntuk: (pengguna: User) => sesiUntukLogika(state.sesi, pengguna),
      bukaSesi,
      tutupSesi,
      catatPresensi,
      presensiSaya,
      rekapSesi,
      sudahPresensi,
    }),
    [
      state,
      login,
      logout,
      setUser,
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
