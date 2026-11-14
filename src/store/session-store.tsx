
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

import {
  ambilProfil,
  daftarAkun as daftarAkunFirebase,
  keluarAkun,
  masukDenganEmail,
  pantauAuth,
  type InputDaftarAkun,
  type HasilAuth,
  type HasilAksiAuth,
} from '@/lib/auth';

import type { User } from '@/types';

// Tipe hasil login tetap dipertahankan untuk kompatibilitas
// dengan login-screen.tsx.
export type HasilLogin = HasilAuth;

type Store = {
  user: User | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<HasilLogin>;
  daftarAkun: (
    input: InputDaftarAkun,
  ) => Promise<HasilAuth>;
  logout: () => Promise<HasilAksiAuth>;
};

const SessionContext = createContext<Store | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      try {
        const profil = await ambilProfil(firebaseUser);

        if (aktif) {
          setUser(profil);
        }
      } catch (error) {
        console.error('Gagal memulihkan profil:', error);

        // Akun tanpa profil Firestore tidak boleh masuk aplikasi.
        await keluarAkun();

        if (aktif) {
          setUser(null);
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
        setUser(hasil.user);

        return hasil;
      } finally {
        registrasiAktif.current = false;
      }
    },
    [],
  );

  // ========================================
  // LOGOUT

  const logout = useCallback(async (): Promise<HasilAksiAuth> => {
    const hasil = await keluarAkun();

    if (hasil.ok) {
      setUser(null);
    }

    return hasil;
  }, []);

  // ========================================
  // STORE

  const store = useMemo<Store>(
    () => ({
      user,
      authLoading,
      login,
      daftarAkun,
      logout,
    }),
    [
      user,
      authLoading,
      login,
      daftarAkun,
      logout,
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
