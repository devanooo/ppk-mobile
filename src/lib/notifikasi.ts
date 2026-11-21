// Klien push notification.
//
// Cakupan saat ini: izin perangkat, token Expo Push, dan handler notifikasi di
// foreground. Pengiriman dari server menunggu keputusan PM-04 dan Cloud
// Functions, jadi modul ini belum mengirim apa pun.
//
// Penerima push di Web tidak didukung pada Sprint 3, sesuai keputusan untuk
// fokus ke Android dan iOS.

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';

const SALURAN_ANDROID = 'praktikum';

/** Dipasang sekali saat aplikasi dimulai agar notifikasi tampil di foreground. */
export function pasangHandlerNotifikasi(): void {
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
 * Mengambil token Expo Push. Mengembalikan null bila izin belum diberikan,
 * project id tidak tersedia, atau pengambilan gagal. Pemanggil tidak perlu
 * membedakan penyebabnya karena semuanya berarti notifikasi belum aktif.
 */
export async function ambilTokenPush(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const projectId = ambilProjectId();
  if (!projectId) return null;

  try {
    const hasil = await Notifications.getExpoPushTokenAsync({ projectId });
    return hasil.data;
  } catch {
    return null;
  }
}

/**
 * Menyimpan token pada dokumen pengguna. Butuh aturan Firestore yang
 * mengizinkan pemilik mengubah field `pushTokens`; aturan itu belum diterapkan.
 */
export async function simpanTokenPerangkat(
  db: Firestore,
  userId: string,
  token: string,
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      pushTokens: arrayUnion(token),
    });
    return true;
  } catch {
    return false;
  }
}

/** Menghapus token saat pengguna keluar atau mematikan notifikasi. */
export async function hapusTokenPerangkat(
  db: Firestore,
  userId: string,
  token: string,
): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      pushTokens: arrayRemove(token),
    });
    return true;
  } catch {
    return false;
  }
}
