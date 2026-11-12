/**
 * Adapter sementara untuk daftar sesi milik praktikan.
 *
 * TODO(p3): hapus berkas ini dan pakai `src/lib/sesi.ts` begitu T-030 (query
 * sesi praktikan) merge. Layar memanggil `dengarkanSesiPraktikan` dari sini,
 * jadi penggantian cukup mengubah impor di satu hook, bukan di setiap layar.
 *
 * Query mengikuti kontrak bagian 8.3: sesi menyimpan `kelasId`, dan daftar
 * peserta melekat pada dokumen kelas. Karena Security Rules hanya mengizinkan
 * praktikan membaca kelas tempat ia terdaftar, pencarian dimulai dari kelas.
 */

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';

import { pesanDariGalat } from './izin-aturan';

export type HasilMuat<T> = { ok: true; data: T } | { ok: false; pesan: string };

export type SesiPraktikan = {
  id: string;
  kelasId: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  status: 'belum-dibuka' | 'dibuka' | 'ditutup';
  /** Ikut dibawa supaya pemilih sesi bisa menampilkan nama praktikum dan lab. */
  namaKelas: string;
  lab: string;
};

/**
 * Mendengarkan sesi dari semua kelas tempat `praktikanId` terdaftar, sudah
 * terurut tanggal dan jam. Mengembalikan fungsi pembersih gabungan.
 */
export function dengarkanSesiPraktikan(
  db: Firestore,
  praktikanId: string,
  onData: (hasil: HasilMuat<SesiPraktikan[]>) => void,
): () => void {
  const kelasQuery = query(collection(db, 'kelas'), where('pesertaIds', 'array-contains', praktikanId));
  const sesiPerKelas = new Map<string, Map<string, SesiPraktikan>>();
  let gagal = false;

  const kirim = () => {
    if (gagal) return;

    const semua = [...sesiPerKelas.values()].flatMap((sesi) => [...sesi.values()]);

    semua.sort((a, b) => `${a.tanggal}T${a.jamMulai}`.localeCompare(`${b.tanggal}T${b.jamMulai}`));
    onData({ ok: true, data: semua });
  };

  const pembersihSesi: (() => void)[] = [];

  const bersihkanSesi = () => {
    pembersihSesi.forEach((bersihkan) => bersihkan());
    pembersihSesi.length = 0;
    sesiPerKelas.clear();
  };

  const pembersihKelas = onSnapshot(
    kelasQuery,
    async (snapshot) => {
      bersihkanSesi();

      for (const dokumenKelas of snapshot.docs) {
        const kelasId = dokumenKelas.id;
        const dataKelas = dokumenKelas.data() as { nama?: string; lab?: string };
        const peta = new Map<string, SesiPraktikan>();

        sesiPerKelas.set(kelasId, peta);

        pembersihSesi.push(
          onSnapshot(
            query(collection(db, 'sesi'), where('kelasId', '==', kelasId)),
            (snapshotSesi) => {
              peta.clear();

              snapshotSesi.docs.forEach((dokumenSesi) => {
                const data = dokumenSesi.data() as Record<string, unknown>;

                peta.set(dokumenSesi.id, {
                  id: dokumenSesi.id,
                  kelasId,
                  hari: String(data.hari ?? ''),
                  tanggal: String(data.tanggal ?? ''),
                  jamMulai: String(data.jamMulai ?? ''),
                  jamSelesai: String(data.jamSelesai ?? ''),
                  status: (data.status as SesiPraktikan['status']) ?? 'belum-dibuka',
                  namaKelas: dataKelas.nama ?? '',
                  lab: dataKelas.lab ?? '',
                });
              });

              kirim();
            },
            (galat) => {
              gagal = true;
              onData({ ok: false, pesan: pesanDariGalat(galat) });
            },
          ),
        );
      }

      kirim();
    },
    (galat) => {
      gagal = true;
      onData({ ok: false, pesan: pesanDariGalat(galat) });
    },
  );

  return () => {
    pembersihKelas();
    bersihkanSesi();
  };
}

/**
 * Membaca satu sesi beserta kelasnya untuk layar detail. Dipakai ketika layar
 * butuh `pesertaIds` guna menentukan apakah form boleh dikirim.
 */
export async function bacaSesiPraktikan(
  db: Firestore,
  sesiId: string,
): Promise<HasilMuat<{ statusSesi: SesiPraktikan['status']; pesertaIds: string[] }>> {
  try {
    const dokumenSesi = await getDoc(doc(db, 'sesi', sesiId));

    if (!dokumenSesi.exists()) {
      return { ok: false, pesan: 'Sesi tidak ditemukan' };
    }

    const dataSesi = dokumenSesi.data() as { kelasId?: string; status?: string };
    const kelasId = dataSesi.kelasId;

    if (!kelasId) {
      return { ok: false, pesan: 'Kelas sesi ini tidak ditemukan' };
    }

    const dokumenKelas = await getDoc(doc(db, 'kelas', kelasId));
    const dataKelas = (dokumenKelas.data() ?? {}) as { pesertaIds?: string[] };

    return {
      ok: true,
      data: {
        statusSesi: (dataSesi.status as SesiPraktikan['status']) ?? 'belum-dibuka',
        pesertaIds: dataKelas.pesertaIds ?? [],
      },
    };
  } catch (galat) {
    return { ok: false, pesan: pesanDariGalat(galat) };
  }
}
