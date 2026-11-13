
import {
  onSnapshot,
  type DocumentReference,
  type Query,
  type Unsubscribe,
} from 'firebase/firestore';

/* Representasi dokumen Firestore yang sudah dibaca.
ID dokumen dipisahkan dari isi datanya.
 */
export interface DokumenDenganId<T> {
  id: string;
  data: T;
}

/* Listener untuk satu dokumen Firestore.
 * Mengembalikan data ketika dokumen berubah.
 * Mengembalikan null jika dokumen tidak ditemukan.
 */
export function dengarkanDokumen<T>(
  referensi: DocumentReference<T>,
  onData: (data: T | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    referensi,
    (snapshot) => {
      onData(snapshot.exists() ? snapshot.data() : null);
    },
    onError,
  );
}

/*Listener untuk kumpulan dokumen Firestore.
 * Setiap perubahan dokumen dalam query akan
 * menghasilkan data terbaru.
 */
export function dengarkanKoleksi<T>(
  referensi: Query<T>,
  onData: (dokumen: DokumenDenganId<T>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    referensi,
    (snapshot) => {
      const hasil: DokumenDenganId<T>[] = snapshot.docs.map(
        (dokumen) => ({
          id: dokumen.id,
          data: dokumen.data(),
        }),
      );

      onData(hasil);
    },
    onError,
  );
}
