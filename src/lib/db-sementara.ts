/**
 * SEMENTARA - hapus berkas ini begitu T-016 merge.
 *
 * TODO(p1): `src/lib/firebase.ts` (T-016) belum ada, sedangkan layar izin sudah
 * butuh `db` untuk bisa diuji. Modul ini adalah pengganti sementara dengan
 * cakupan sesempit mungkin: hanya membuat `db`, tanpa `auth`, tanpa persistence.
 *
 * Setelah T-016 merge:
 *   1. Impor `db` dari `@/lib/firebase` di setiap pemakaian.
 *   2. Hapus berkas ini.
 *
 * `getApps()` dipakai supaya tidak terjadi `initializeApp` ganda bila modul ini
 * dan T-016 sempat hidup bersamaan selama transisi.
 */

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

function bacaKonfigurasi() {
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
}

/**
 * Mengembalikan `db`, atau `null` bila env Firebase belum lengkap. Layar
 * menampilkan state gagal alih-alih melempar saat bundel dijalankan tanpa
 * `.env`, supaya aplikasi tetap bisa dibuka.
 */
export function ambilDbSementara(): Firestore | null {
  const konfigurasi = bacaKonfigurasi();

  if (!konfigurasi.apiKey || !konfigurasi.projectId || !konfigurasi.appId) {
    return null;
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(konfigurasi);

    return getFirestore(app);
  } catch {
    return null;
  }
}
