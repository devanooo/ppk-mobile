
import {
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
} from 'firebase/firestore';

import type {
  UserFirestore,
  KelasFirestore,
  SesiFirestore,
  PresensiFirestore,
  IzinFirestore,
} from '@/types/firestore';

/**
 * Membuat converter Firestore generik.
 *
 * Converter ini mempertahankan struktur dokumen dan
 * Timestamp Firestore tanpa mengubahnya menjadi Date.
 */
function buatKonverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>) {
      return data;
    },

    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options?: SnapshotOptions,
    ): T {
      return snapshot.data(options) as T;
    },
  } as FirestoreDataConverter<T>;
}

// Converter collection users
export const userConverter =
  buatKonverter<UserFirestore>();

// Converter collection kelas
export const kelasConverter =
  buatKonverter<KelasFirestore>();

// Converter collection sesi
export const sesiConverter =
  buatKonverter<SesiFirestore>();

// Converter subcollection presensi
export const presensiConverter =
  buatKonverter<PresensiFirestore>();

// Converter subcollection izin
export const izinConverter =
  buatKonverter<IzinFirestore>();
