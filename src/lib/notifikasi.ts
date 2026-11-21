// Klien notifikasi push.
//
// Arsitektur:
//   aplikasi -> endpoint Vercel -> Firebase Admin SDK -> Expo Push API -> perangkat
//
// Klien hanya meminta izin, menyimpan token Expo, dan memanggil endpoint setelah
// aksi yang memicu notifikasi berhasil. Pengiriman tidak dilakukan di perangkat.

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

import { auth } from './firebase';

const SALURAN_ANDROID = 'praktikum';
const KOLEKSI_TOKEN = 'tokenPerangkat';
const URL_ENDPOINT = process.env.EXPO_PUBLIC_NOTIFIKASI_URL;

export type PlatformPerangkat = 'ios' | 'android';

export type TokenPerangkat = {
  token: string;
  platform: PlatformPerangkat;
};

export type TipeEventNotifikasi =
  | 'sesi-dibuka'
  | 'jadwal-berubah'
  | 'izin-disetujui'
  | 'izin-ditolak';

export type EventNotifikasi = {
  tipe: TipeEventNotifikasi;
  sesiId: string;
  praktikanId?: string;
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
 * Mengambil token Expo Push. Token ini yang dikirim ke Expo Push API oleh
 * endpoint; server tidak perlu tahu token FCM atau APNs perangkat.
 */
export async function ambilTokenPerangkat(): Promise<TokenPerangkat | null> {
  if (Platform.OS === 'web') return null;

  const projectId = ambilProjectId();
  if (!projectId) return null;

  try {
    const hasil = await Notifications.getExpoPushTokenAsync({ projectId });

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

/**
 * Meminta endpoint mengirim notifikasi untuk satu event. Pemanggil harus sudah
 * login; endpoint memverifikasi ID token dan memeriksa bahwa pemanggil adalah
 * asisten pemilik sesi.
 */
export async function kirimEventNotifikasi(
  event: EventNotifikasi,
): Promise<boolean> {
  if (!URL_ENDPOINT) return false;

  const pengguna = auth.currentUser;
  if (!pengguna) return false;

  try {
    const idToken = await pengguna.getIdToken();

    const respons = await fetch(
      `${URL_ENDPOINT.replace(/\/$/, '')}/api/notifikasi`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(event),
      },
    );

    return respons.ok;
  } catch {
    return false;
  }
}
