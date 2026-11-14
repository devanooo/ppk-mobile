import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Firestore,
} from 'firebase/firestore';

import { kelasConverter } from '@/lib/konversi';
import type { KelasFirestore } from '@/types/firestore';
import { pesanDariGalat } from './izin-aturan';

export type Kelas = {
  id: string;
  nama: string;
  lab: string;
  asistenId: string;
  pesertaIds: string[];
  dibuatPada: Date;
};

export type HasilMuat<T> =
  | { ok: true; data: T }
  | { ok: false; pesan: string };

export type HasilAksi = {
  ok: boolean;
  pesan: string;
};

function keKelas(id: string, data: KelasFirestore): Kelas {
  return {
    id,
    nama: data.nama,
    lab: data.lab,
    asistenId: data.asistenId,
    pesertaIds: data.pesertaIds,
    dibuatPada: data.dibuatPada?.toDate() ?? new Date(0),
  };
}

function validasiKelas(nama: string, lab: string): HasilAksi {
  if (!nama.trim()) {
    return { ok: false, pesan: 'Nama kelas belum diisi' };
  }

  if (!lab.trim()) {
    return { ok: false, pesan: 'Lab belum dipilih' };
  }

  return { ok: true, pesan: 'Data kelas valid' };
}

function pesanGalatKelas(galat: unknown): string {
  return pesanDariGalat(galat, 'Operasi kelas gagal dilakukan');
}

/** Mendengarkan kelas yang dimiliki satu asisten. */
export function dengarkanKelasAsisten(
  db: Firestore,
  asistenId: string,
  onData: (hasil: HasilMuat<Kelas[]>) => void,
): () => void {
  const koleksi = collection(db, 'kelas').withConverter(kelasConverter);

  const rujukan = query(
    koleksi,
    where('asistenId', '==', asistenId),
  );

  return onSnapshot(
    rujukan,
    (snapshot) => {
      const data = snapshot.docs.map((dokumen) =>
        keKelas(dokumen.id, dokumen.data()),
      );

      onData({ ok: true, data });
    },
    (galat) => {
      onData({ ok: false, pesan: pesanGalatKelas(galat) });
    },
  );
}

/** Membuat kelas baru. */
export async function buatKelas({
  db,
  nama,
  lab,
  asistenId,
}: {
  db: Firestore;
  nama: string;
  lab: string;
  asistenId: string;
}): Promise<HasilAksi> {
  const validasi = validasiKelas(nama, lab);

  if (!validasi.ok) return validasi;

  try {
    const koleksi = collection(db, 'kelas').withConverter(kelasConverter);

    await addDoc(koleksi, {
      nama: nama.trim(),
      lab: lab.trim(),
      asistenId,
      pesertaIds: [],
      dibuatPada: serverTimestamp(),
    });

    return { ok: true, pesan: 'Kelas berhasil dibuat' };
  } catch (galat) {
    return { ok: false, pesan: pesanGalatKelas(galat) };
  }
}

/** Mengubah nama dan lab kelas milik asisten. */
export async function ubahKelas({
  db,
  kelasId,
  asistenId,
  nama,
  lab,
}: {
  db: Firestore;
  kelasId: string;
  asistenId: string;
  nama: string;
  lab: string;
}): Promise<HasilAksi> {
  const validasi = validasiKelas(nama, lab);

  if (!validasi.ok) return validasi;

  try {
    const rujukan = doc(db, 'kelas', kelasId).withConverter(kelasConverter);
    const hasilKelas = await getDoc(rujukan);

    if (
      !hasilKelas.exists() ||
      hasilKelas.data().asistenId !== asistenId
    ) {
      return {
        ok: false,
        pesan: 'Kamu tidak memiliki akses ke kelas ini',
      };
    }

    await updateDoc(rujukan, {
      nama: nama.trim(),
      lab: lab.trim(),
    });

    return { ok: true, pesan: 'Kelas berhasil diperbarui' };
  } catch (galat) {
    return { ok: false, pesan: pesanGalatKelas(galat) };
  }
}

/** Menambahkan praktikan ke kelas. */
export async function tambahPeserta({
  db,
  kelasId,
  praktikanId,
}: {
  db: Firestore;
  kelasId: string;
  praktikanId: string;
}): Promise<HasilAksi> {
  try {
    await updateDoc(doc(db, 'kelas', kelasId), {
      pesertaIds: arrayUnion(praktikanId),
    });

    return { ok: true, pesan: 'Peserta berhasil ditambahkan' };
  } catch (galat) {
    return { ok: false, pesan: pesanGalatKelas(galat) };
  }
}

/** Menghapus praktikan dari kelas. */
export async function hapusPeserta({
  db,
  kelasId,
  praktikanId,
}: {
  db: Firestore;
  kelasId: string;
  praktikanId: string;
}): Promise<HasilAksi> {
  try {
    await updateDoc(doc(db, 'kelas', kelasId), {
      pesertaIds: arrayRemove(praktikanId),
    });

    return { ok: true, pesan: 'Peserta berhasil dihapus' };
  } catch (galat) {
    return { ok: false, pesan: pesanGalatKelas(galat) };
  }
}

/** Menghapus kelas hanya jika belum memiliki sesi. */
export async function hapusKelas({
  db,
  kelasId,
  asistenId,
}: {
  db: Firestore;
  kelasId: string;
  asistenId: string;
}): Promise<HasilAksi> {
  try {
    const rujukanKelas = doc(db, 'kelas', kelasId).withConverter(kelasConverter);
    const hasilKelas = await getDoc(rujukanKelas);

    if (
      !hasilKelas.exists() ||
      hasilKelas.data().asistenId !== asistenId
    ) {
      return {
        ok: false,
        pesan: 'Kamu tidak memiliki akses ke kelas ini',
      };
    }

    const rujukanSesi = query(
      collection(db, 'sesi'),
      where('kelasId', '==', kelasId),
      where('asistenId', '==', asistenId),
      limit(1),
    );

    const hasilSesi = await getDocs(rujukanSesi);

    if (!hasilSesi.empty) {
      return {
        ok: false,
        pesan: 'Kelas tidak dapat dihapus karena sudah memiliki sesi',
      };
    }

    await deleteDoc(rujukanKelas);

    return { ok: true, pesan: 'Kelas berhasil dihapus' };
  } catch (galat) {
    return { ok: false, pesan: pesanGalatKelas(galat) };
  }
}
