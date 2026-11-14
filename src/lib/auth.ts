
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { userConverter } from '@/lib/konversi';

import type { User, Peran } from '@/types';
import type { UserFirestore } from '@/types/firestore';

export type HasilAuth =
  | { ok: true; user: User }
  | { ok: false; pesan: string };

export type HasilAksiAuth =
  | { ok: true; pesan: string }
  | { ok: false; pesan: string };

export type InputDaftarAkun = {
  nama: string;
  nomorInduk: string;
  email: string;
  password: string;
  peran: Peran;
};

// ========================================
// ERROR HANDLING

function pesanError(error: unknown): string {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('code' in error)
  ) {
    return 'Terjadi kesalahan. Silakan coba kembali.';
  }

  const code = error.code;

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email sudah terdaftar. Gunakan email lain.';

    case 'auth/invalid-email':
      return 'Format email tidak valid.';

    case 'auth/weak-password':
      return 'Kata sandi minimal 6 karakter.';

    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email atau kata sandi salah.';

    case 'auth/network-request-failed':
      return 'Koneksi internet bermasalah.';

    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Registrasi ditolak oleh Firestore. NIM mungkin sudah digunakan atau aturan akses tidak terpenuhi.';

    default:
      return 'Terjadi kesalahan saat menghubungi Firebase.';
  }
}

// ========================================
// USER CONVERTER

function konversiUser(
  uid: string,
  data: UserFirestore,
): User {
  return {
    id: uid,
    nama: data.nama,
    nomorInduk: data.nomorInduk,
    peran: data.peran,
  };
}

// ========================================
// GET USER PROFILE

/**
 * Mengambil profil pengguna dari Firestore.
 */
export async function ambilProfil(
  pengguna: FirebaseUser,
): Promise<User> {
  const referensi = doc(
    db,
    'users',
    pengguna.uid,
  ).withConverter(userConverter);

  const snapshot = await getDoc(referensi);

  if (!snapshot.exists()) {
    throw new Error(
      'Profil pengguna tidak ditemukan di Firestore.',
    );
  }

  return konversiUser(
    pengguna.uid,
    snapshot.data(),
  );
}

// ========================================
// REGISTER

/**
 * Registrasi akun praktikan.
 * Akun asisten dibuat melalui proses administrasi,
 * bukan registrasi publik.
 */
export async function daftarAkun(
  input: InputDaftarAkun,
): Promise<HasilAuth> {
  const nama = input.nama.trim();
  const nomorInduk = input.nomorInduk.trim();
  const email = input.email.trim().toLowerCase();

  if (!nama || !nomorInduk || !email || !input.password) {
    return {
      ok: false,
      pesan: 'Semua kolom wajib diisi.',
    };
  }

  if (!['praktikan', 'asisten'].includes(input.peran)) {
    return {
      ok: false,
      pesan: 'Silakan pilih peran akun.',
    };
  }

  const validNomorInduk =
    input.peran === 'praktikan'
      ? /^\d{10}$/.test(nomorInduk)
      : /^\d{18}$/.test(nomorInduk);

  if (!validNomorInduk) {
    return {
      ok: false,
      pesan:
        input.peran === 'praktikan'
          ? 'NIM harus terdiri dari tepat 10 digit angka.'
          : 'NIP harus terdiri dari tepat 18 digit angka.',
    };
  }

  if (input.password.length < 6) {
    return {
      ok: false,
      pesan: 'Kata sandi minimal 6 karakter.',
    };
  }

  let pengguna: FirebaseUser | null = null;

  try {
    // 1. Membuat akun Firebase Authentication.
    const hasil = await createUserWithEmailAndPassword(
      auth,
      email,
      input.password,
    );

    pengguna = hasil.user;

    // 2. Menyiapkan referensi dokumen Firestore.
    const batch = writeBatch(db);

    const referensiUser = doc(
      db,
      'users',
      pengguna.uid,
    );

    const referensiNim = doc(
      db,
      'nomorInduk',
      nomorInduk,
    );

    // 3. Membuat profil sesuai role pilihan pengguna.
    const profil: UserFirestore = {
      nama,
      nomorInduk,
      peran: input.peran,
      dibuatPada: serverTimestamp() as UserFirestore['dibuatPada'],
    };

    // 4. Menyimpan profil pengguna.
    batch.set(referensiUser, profil);

    // 5. Menyimpan reservasi nomor induk.
    batch.set(referensiNim, {
      uid: pengguna.uid,
    });

    // 6. Menyimpan kedua dokumen secara atomik.
    await batch.commit();

    return {
      ok: true,
      user: konversiUser(pengguna.uid, profil),
    };
  } catch (error) {
    // 7. Rollback jika penyimpanan Firestore gagal.
    if (pengguna) {
      try {
        await deleteUser(pengguna);
      } catch (rollbackError) {
        console.error(
          'Gagal menghapus akun Authentication sementara:',
          rollbackError,
        );
      }
    }

    // 8. Penanganan kegagalan registrasi Firestore.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'permission-denied'
    ) {
      return {
        ok: false,
        pesan:
          'Nomor induk sudah digunakan atau data registrasi tidak memenuhi aturan.',
      };
    }

    return {
      ok: false,
      pesan: pesanError(error),
    };
  }
}

// ========================================
// LOGIN

/**
 * Login menggunakan email dan password Firebase Authentication.
 */
export async function masukDenganEmail(
  email: string,
  password: string,
): Promise<HasilAuth> {
  try {
    const hasil = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password,
    );

    const user = await ambilProfil(hasil.user);

    return {
      ok: true,
      user,
    };
  } catch (error) {
    await signOut(auth).catch(() => undefined);

    return {
      ok: false,
      pesan: pesanError(error),
    };
  }
}

// ========================================
// LOGOUT

/**
 * Logout Firebase Authentication.
 */
export async function keluarAkun(): Promise<HasilAksiAuth> {
  try {
    await signOut(auth);

    return {
      ok: true,
      pesan: 'Berhasil keluar dari akun.',
    };
  } catch (error) {
    return {
      ok: false,
      pesan: pesanError(error),
    };
  }
}

// ========================================
// AUTH STATE LISTENER

/**
 * Memantau perubahan status autentikasi.
 */
export function pantauAuth(
  onBerubah: (pengguna: FirebaseUser | null) => void,
) {
  return onAuthStateChanged(auth, onBerubah);
}
