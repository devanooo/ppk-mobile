
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

import { userConverter } from '@/lib/konversi';
import type { UserFirestore } from '@/types/firestore';

import { pesanDariGalat } from './izin-aturan';

export type PresensiDetail = {
  praktikanId: string;
  nama: string;
  nomorInduk: string;
  waktu: Date;
};

export type HasilMuatPresensi =
  | { ok: true; data: PresensiDetail[] }
  | { ok: false; pesan: string };

export type HasilMuatPresensiSaya =
  | { ok: true; data: Date | null }
  | { ok: false; pesan: string };

export type HasilAksiPresensi = {
  ok: boolean;
  pesan: string;
};

function ubahWaktu(waktu: unknown): Date {
  if (
    waktu &&
    typeof (waktu as Timestamp).toDate === 'function'
  ) {
    return (waktu as Timestamp).toDate();
  }

  return new Date(0);
}

/** Mendengarkan daftar presensi dalam satu sesi untuk rekap asisten. */
export function dengarkanPresensiSesi(
  db: Firestore,
  sesiId: string,
  onData: (hasil: HasilMuatPresensi) => void,
): () => void {
  return onSnapshot(
    collection(db, 'sesi', sesiId, 'presensi'),
    async (snapshot) => {
      try {
        const daftar = await Promise.all(
          snapshot.docs.map(async (dokumen) => {
            const pengguna = await getDoc(
              doc(db, 'users', dokumen.id).withConverter(userConverter),
            );

            const data = pengguna.data() as UserFirestore | undefined;
            const presensi = dokumen.data();

            return {
              praktikanId: dokumen.id,
              nama: data?.nama ?? 'Praktikan',
              nomorInduk: data?.nomorInduk ?? '-',
              waktu: ubahWaktu(presensi.waktu),
            };
          }),
        );

        daftar.sort((a, b) => a.waktu.getTime() - b.waktu.getTime());

        onData({ ok: true, data: daftar });
      } catch (galat) {
        onData({ ok: false, pesan: pesanDariGalat(galat) });
      }
    },
    (galat) => {
      onData({ ok: false, pesan: pesanDariGalat(galat) });
    },
  );
}

/** Mendengarkan presensi milik satu praktikan pada satu sesi. */
export function dengarkanPresensiSaya(
  db: Firestore,
  sesiId: string,
  praktikanId: string,
  onData: (hasil: HasilMuatPresensiSaya) => void,
): () => void {
  return onSnapshot(
    doc(db, 'sesi', sesiId, 'presensi', praktikanId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData({ ok: true, data: null });
        return;
      }

      onData({
        ok: true,
        data: ubahWaktu(snapshot.data().waktu),
      });
    },
    (galat) => {
      onData({ ok: false, pesan: pesanDariGalat(galat) });
    },
  );
}

/** Mencatat presensi praktikan satu kali untuk satu sesi. */
export async function catatPresensi({
  db,
  sesiId,
  praktikanId,
}: {
  db: Firestore;
  sesiId: string;
  praktikanId: string;
}): Promise<HasilAksiPresensi> {
  try {
    await runTransaction(db, async (transaksi) => {
      const rujukanSesi = doc(db, 'sesi', sesiId);
      const rujukanPresensi = doc(
        db,
        'sesi',
        sesiId,
        'presensi',
        praktikanId,
      );

      const dokumenSesi = await transaksi.get(rujukanSesi);

      if (!dokumenSesi.exists()) {
        throw new Error('SESI_TIDAK_DITEMUKAN');
      }

      const sesi = dokumenSesi.data();

      const dokumenPresensi = await transaksi.get(rujukanPresensi);

      if (dokumenPresensi.exists()) {
        throw new Error('PRESENSI_SUDAH_ADA');
      }

      if (sesi.status !== 'dibuka') {
        throw new Error('SESI_TIDAK_DIBUKA');
      }

      const rujukanKelas = doc(db, 'kelas', sesi.kelasId);
      const dokumenKelas = await transaksi.get(rujukanKelas);

      if (!dokumenKelas.exists()) {
        throw new Error('KELAS_TIDAK_DITEMUKAN');
      }

      const kelas = dokumenKelas.data();
      const pesertaIds = Array.isArray(kelas.pesertaIds)
        ? kelas.pesertaIds
        : [];

      if (!pesertaIds.includes(praktikanId)) {
        throw new Error('BUKAN_PESERTA_KELAS');
      }

      transaksi.set(rujukanPresensi, {
        praktikanId,
        waktu: serverTimestamp(),
      });
    });

    return {
      ok: true,
      pesan: 'Presensi berhasil dicatat',
    };
  } catch (galat) {
    if (galat instanceof Error) {
      switch (galat.message) {
        case 'SESI_TIDAK_DITEMUKAN':
          return { ok: false, pesan: 'Sesi tidak ditemukan' };

        case 'PRESENSI_SUDAH_ADA':
          return {
            ok: false,
            pesan: 'Presensi sudah tercatat pada sesi ini',
          };

        case 'SESI_TIDAK_DIBUKA':
          return {
            ok: false,
            pesan: 'Sesi belum dibuka atau sudah ditutup',
          };

        case 'KELAS_TIDAK_DITEMUKAN':
          return { ok: false, pesan: 'Kelas tidak ditemukan' };

        case 'BUKAN_PESERTA_KELAS':
          return {
            ok: false,
            pesan: 'Kamu tidak terdaftar pada sesi ini',
          };
      }
    }

    return {
      ok: false,
      pesan: pesanDariGalat(galat),
    };
  }
}
