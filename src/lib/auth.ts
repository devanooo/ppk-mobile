
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
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { userConverter } from '@/lib/konversi';

import type { User } from '@/types';
import type { UserFirestore } from '@/types/firestore';

export type HasilAuth =
  | { ok: true; user: User }
  | { ok: false; pesan: string };

export type HasilAksiAuth =
  | { ok: true; pesan: string }
  | { ok: false; pesan: string };

function pesanError(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return 'Terjadi kesalahan. Silakan coba kembali.';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Email sudah terdaftar.';
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
      return 'Tidak memiliki izin mengakses profil.';
    default:
      return 'Terjadi kesalahan saat menghubungi Firebase.';
  }
}

function konversiUser(uid: string, data: UserFirestore): User {
  return {
    id: uid,
    nama: data.nama,
    nomorInduk: data.nomorInduk,
    peran: data.peran,
  };
}

/**
 * Mengambil profil pengguna dari Firestore.
 */
export async function ambilProfil(
  pengguna: FirebaseUser,
): Promise<User> {
  const referensi = doc(db, 'users', pengguna.uid).withConverter(userConverter);
  const snapshot = await getDoc(referensi);

  if (!snapshot.exists()) {
    throw new Error('Profil pengguna tidak ditemukan di Firestore.');
  }

  return konversiUser(pengguna.uid, snapshot.data());
}

/**
 * Registrasi akun praktikan.
 * Akun asisten dibuat melalui proses administrasi, bukan registrasi publik.
 */
export async function daftarPraktikan(input: {
  nama: string;
  nomorInduk: string;
  email: string;
  password: string;
}): Promise<HasilAuth> {
  const nama = input.nama.trim();
  const nomorInduk = input.nomorInduk.trim();
  const email = input.email.trim();

  if (!nama || !nomorInduk || !email || !input.password) {
    return { ok: false, pesan: 'Semua kolom wajib diisi.' };
  }

  if (input.password.length < 6) {
    return { ok: false, pesan: 'Kata sandi minimal 6 karakter.' };
  }

  let pengguna: FirebaseUser | null = null;

  try {
    const hasil = await createUserWithEmailAndPassword(
      auth,
      email,
      input.password,
    );

    pengguna = hasil.user;

    const referensi = doc(db, 'users', pengguna.uid)
      .withConverter(userConverter);

    const profil: UserFirestore = {
      nama,
      nomorInduk,
      peran: 'praktikan',
      dibuatPada: serverTimestamp() as UserFirestore['dibuatPada'],
    };

    await setDoc(referensi, profil);

    return {
      ok: true,
      user: konversiUser(pengguna.uid, profil),
    };
  } catch (error) {
    // Jika pembuatan profil gagal, jangan tinggalkan akun Auth yatim.
    if (pengguna) {
      try {
        await deleteUser(pengguna);
      } catch {
        // Kegagalan rollback perlu ditangani melalui pemeriksaan akun.
      }
    }

    return { ok: false, pesan: pesanError(error) };
  }
}

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
      email.trim(),
      password,
    );

    const user = await ambilProfil(hasil.user);

    return { ok: true, user };
  } catch (error) {
    await signOut(auth).catch(() => undefined);
    return { ok: false, pesan: pesanError(error) };
  }
}

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
    return { ok: false, pesan: pesanError(error) };
  }
}

/**
 * Memantau perubahan status autentikasi.
 */
export function pantauAuth(
  onBerubah: (pengguna: FirebaseUser | null) => void,
) {
  return onAuthStateChanged(auth, onBerubah);
}


