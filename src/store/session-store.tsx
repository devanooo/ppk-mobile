
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { users } from '@/data/dummy';
import {
  ambilProfil,
  daftarAkun as daftarAkunFirebase,
  keluarAkun,
  masukDenganEmail,
  pantauAuth,
  type InputDaftarAkun,
  type HasilAuth,
} from '@/lib/auth';
import type { Presensi, Sesi, User } from '@/types';

import {
  bukaSesi as bukaSesiLogika,
  catatPresensi as catatPresensiLogika,
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
  authLoading: boolean;
  sesi: Sesi[];
  presensi: Presensi[];
  login: (email: string, password: string) => Promise<HasilLogin>;
  daftarAkun: (
    input: InputDaftarAkun,
  ) => Promise<HasilAuth>;
  logout: () => Promise<HasilAksi>;
  sesiById: (sesiId: string) => Sesi | undefined;
  sesiUntuk: (user: User) => Sesi[];
  bukaSesi: (sesiId: string) => HasilAksi;
  tutupSesi: (sesiId: string) => HasilAksi;
  catatPresensi: (sesiId: string, praktikanId: string) => HasilAksi;
  presensiSaya: (praktikanId: string) => Presensi[];
  rekapSesi: (sesiId: string) => { praktikan: User; waktu: string }[];
  sudahPresensi: (sesiId: string, praktikanId: string) => boolean;
};

// Data sesi dan presensi masih sementara menunggu integrasi P3.
const AWAL: StateAplikasi = {
  user: null,
  sesi: [],
  presensi: [],
};

const SessionContext = createContext<Store | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StateAplikasi>(AWAL);
  const [authLoading, setAuthLoading] = useState(true);

  // Menandai proses registrasi agar tidak bertabrakan
  // dengan Firebase Auth State Listener.
  const registrasiAktif = useRef(false);

  // ========================================
  // FIREBASE AUTH STATE LISTENER

  useEffect(() => {
    let aktif = true;

    const unsubscribe = pantauAuth(async (firebaseUser) => {
      // Lewati perubahan Auth selama registrasi berlangsung.
      // Profil Firestore masih dalam proses penyimpanan.
      if (registrasiAktif.current) {
        return;
      }

      if (!firebaseUser) {
        if (aktif) {
          setState((lama) => ({ ...lama, user: null }));
          setAuthLoading(false);
        }
        return;
      }

      try {
        const profil = await ambilProfil(firebaseUser);

        if (aktif) {
          setState((lama) => ({ ...lama, user: profil }));
        }
      } catch (error) {
        console.error('Gagal memulihkan profil:', error);

        // Akun tanpa profil Firestore tidak boleh masuk aplikasi.
        await keluarAkun();

        if (aktif) {
          setState((lama) => ({ ...lama, user: null }));
        }
      } finally {
        if (aktif) {
          setAuthLoading(false);
        }
      }
    });

    return () => {
      aktif = false;
      unsubscribe();
    };
  }, []);

  // ========================================
  // LOGIN

  const login = useCallback(
    async (email: string, password: string): Promise<HasilLogin> => {
      if (!email.trim() || !password) {
        return {
          ok: false,
          pesan: 'Email dan kata sandi wajib diisi.',
        };
      }

      return masukDenganEmail(email.trim(), password);
    },
    [],
  );

  // ========================================
  // REGISTER

  const daftarAkun = useCallback(
    async (
      input: InputDaftarAkun,
    ): Promise<HasilAuth> => {
      // Mencegah proses registrasi ganda.
      if (registrasiAktif.current) {
        return {
          ok: false,
          pesan: 'Registrasi sedang diproses. Silakan tunggu.',
        };
      }

      registrasiAktif.current = true;

      try {
        const hasil = await daftarAkunFirebase(input);

        if (!hasil.ok) {
          return hasil;
        }

        // State diperbarui hanya setelah Authentication
        // dan Firestore berhasil menyimpan data.
        setState((lama) => ({
          ...lama,
          user: hasil.user,
        }));

        return hasil;
      } finally {
        registrasiAktif.current = false;
      }
    },
    [],
  );

  // ========================================
  // LOGOUT

  const logout = useCallback(async (): Promise<HasilAksi> => {
    const hasil = await keluarAkun();

    if (hasil.ok) {
      setState((lama) => ({ ...lama, user: null }));
    }

    return hasil;
  }, []);

  // ========================================
  // SESSION AND ATTENDANCE
  // Sementara menggunakan logika Sprint 1.
  // Menunggu migrasi Firestore oleh P3.

  const sesiById = useCallback(
    (sesiId: string) => state.sesi.find((s) => s.id === sesiId),
    [state.sesi],
  );

  const bukaSesi = useCallback(
    (sesiId: string): HasilAksi => {
      const hasil = bukaSesiLogika(
        state,
        sesiId,
        new Date().toISOString(),
      );

      if (!hasil.ok) return hasil;

      setState(hasil.state);
      return { ok: true, pesan: hasil.pesan };
    },
    [state],
  );

  const tutupSesi = useCallback(
    (sesiId: string): HasilAksi => {
      const hasil = tutupSesiLogika(
        state,
        sesiId,
        new Date().toISOString(),
      );

      if (!hasil.ok) return hasil;

      setState(hasil.state);
      return { ok: true, pesan: hasil.pesan };
    },
    [state],
  );

  const catatPresensi = useCallback(
    (sesiId: string, praktikanId: string): HasilAksi => {
      const hasil = catatPresensiLogika(
        state,
        sesiId,
        praktikanId,
        new Date().toISOString(),
      );

      if (!hasil.ok) return hasil;

      setState(hasil.state);
      return { ok: true, pesan: hasil.pesan };
    },
    [state],
  );

  const presensiSaya = useCallback(
    (praktikanId: string) =>
      presensiSayaLogika(state.presensi, praktikanId),
    [state.presensi],
  );

  const rekapSesi = useCallback(
    (sesiId: string) =>
      rekapSesiLogika(sesiId, state.presensi, users),
    [state.presensi],
  );

  const sudahPresensi = useCallback(
    (sesiId: string, praktikanId: string) =>
      sudahPresensiLogika(state.presensi, sesiId, praktikanId),
    [state.presensi],
  );

  // ========================================
  // STORE

  const store = useMemo<Store>(
    () => ({
      user: state.user,
      authLoading,
      sesi: state.sesi,
      presensi: state.presensi,
      login,
      daftarAkun,
      logout,
      sesiById,
      sesiUntuk: (pengguna: User) =>
        sesiUntukLogika(state.sesi, pengguna),
      bukaSesi,
      tutupSesi,
      catatPresensi,
      presensiSaya,
      rekapSesi,
      sudahPresensi,
    }),
    [
      state,
      authLoading,
      login,
      daftarAkun,
      logout,
      sesiById,
      bukaSesi,
      tutupSesi,
      catatPresensi,
      presensiSaya,
      rekapSesi,
      sudahPresensi,
    ],
  );

  return (
    <SessionContext.Provider value={store}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Store {
  const store = useContext(SessionContext);

  if (!store) {
    throw new Error('useSession harus dipakai di dalam SessionProvider');
  }

  return store;
}
