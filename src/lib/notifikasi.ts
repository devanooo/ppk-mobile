// Klien notifikasi push.
//
// Arsitektur yang dipakai:
//   aplikasi -> Cloud Functions (server.js) -> Firebase Admin SDK -> FCM -> perangkat
//
// Klien tidak pernah mengirim ke FCM langsung. Tugas klien hanya meminta izin,
// menyediakan token perangkat, dan menampilkan notifikasi yang masuk.
//
// Token perangkat disimpan di koleksi terpisah `tokenPerangkat/{token}` agar
// tidak mencampur data profil pengguna. Pengiriman dari server belum ada karena
// menunggu Cloud Functions pada PM-04.
//
// Web tidak termasuk cakupan Sprint 3, sesuai keputusan fokus Android dan iOS.

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';

const SALURAN_ANDROID = 'praktikum';
const KOLEKSI_TOKEN = 'tokenPerangkat';

export type PlatformPerangkat = 'ios' | 'android';

export type TokenPerangkat = {
  token: string;
  platform: PlatformPerangkat;
};

/** Dipasang sekali saat aplikasi dimulai agar notifikasi tampil di foreground. */
export function pasangHandlerNotifikasi(): void {
  if (Platform.OS === 'web') return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Android wajib punya saluran sebelum notifikasi bisa tampil. */
export async function siapkanSaluranAndroid(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(SALURAN_ANDROID, {
    name: 'Notifikasi praktikum',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function mintaIzinNotifikasi(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const hasil = await Notifications.requestPermissionsAsync();

  return hasil.granted;
}

export function ambilProjectId(): string | undefined {
  const extra = Constants.expoConfig?.extra as
    | { eas?: { projectId?: string } }
    | undefined;

  return extra?.eas?.projectId;
}

/**
 * Mengambil token perangkat native. Di Android token ini adalah token FCM yang
 * bisa dipakai Admin SDK. Di iOS nilainya token APNs, sehingga server perlu
 * konversi ke FCM sebelum mengirim.
 */
export async function ambilTokenPerangkat(): Promise<TokenPerangkat | null> {
  if (Platform.OS === 'web') return null;

  try {
    const hasil = await Notifications.getDevicePushTokenAsync();

    return {
      token: hasil.data,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
    };
  } catch {
    return null;
  }
}

/**
 * Menyimpan token ke `tokenPerangkat/{token}`. Dokumen dimiliki pengguna lewat
 * field `uid`; aturan Firestore membatasi tulis hanya untuk pemiliknya.
 */
export async function simpanTokenPerangkat(
  db: Firestore,
  userId: string,
  { token, platform }: TokenPerangkat,
): Promise<boolean> {
  try {
    await setDoc(doc(db, KOLEKSI_TOKEN, token), {
      uid: userId,
      platform,
      diperbaruiPada: serverTimestamp(),
    });

    return true;
  } catch {
    return false;
  }
}

/** Menghapus token saat pengguna keluar atau mematikan notifikasi. */
export async function hapusTokenPerangkat(
  db: Firestore,
  token: string,
): Promise<boolean> {
  try {
    await deleteDoc(doc(db, KOLEKSI_TOKEN, token));
    return true;
  } catch {
    return false;
  }
}
