import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';

import {
  dengarkanSesiPraktikan,
  type SesiFirestore,
} from '@/lib/sesi';
import { pesanDariGalat } from '@/lib/izin-aturan';

import type { JadwalPraktikan } from './use-jadwal-praktikan';

export type RiwayatKehadiran = {
  sesi: JadwalPraktikan;
  waktu: Date;
};

type HasilRiwayat = {
  riwayat: RiwayatKehadiran[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
};

type DataKelas = {
  nama: string;
  lab: string;
};

const HASIL_MEMUAT: HasilRiwayat = {
  riwayat: [],
  status: 'memuat',
};

const HASIL_GAGAL: HasilRiwayat = {
  riwayat: [],
  status: 'gagal',
  pesanGalat: 'Data praktikan belum tersedia.',
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

export function useRiwayatKehadiran(
  db: Firestore | null,
  praktikanId: string | undefined,
): HasilRiwayat {
  const [hasil, setHasil] = useState<HasilRiwayat>(
    HASIL_MEMUAT,
  );

  useEffect(() => {
    if (!db || !praktikanId) {
      return;
    }

    let berhenti = false;
    let kelasSiap = false;
    let sesiSiap = false;
    let gagal = false;

    let daftarKelas = new Map<string, DataKelas>();
    let daftarSesi: SesiFirestore[] = [];

    const waktuPresensi = new Map<string, Date | null>();
    const presensiSiap = new Set<string>();
    const listenerPresensi = new Map<string, () => void>();

    function perbaruiRiwayat() {
      if (berhenti || gagal || !kelasSiap || !sesiSiap) {
        return;
      }

      const semuaPresensiSiap = daftarSesi.every((sesi) =>
        presensiSiap.has(sesi.id),
      );

      if (!semuaPresensiSiap) return;

      const riwayat: RiwayatKehadiran[] = [];

      for (const sesi of daftarSesi) {
        const waktu = waktuPresensi.get(sesi.id);
        const kelas = daftarKelas.get(sesi.kelasId);

        if (!waktu || !kelas) continue;

        riwayat.push({
          sesi: {
            ...sesi,
            namaKelas: kelas.nama,
            lab: kelas.lab,
          },
          waktu,
        });
      }

      riwayat.sort(
        (a, b) => b.waktu.getTime() - a.waktu.getTime(),
      );

      setHasil({
        riwayat,
        status: 'siap',
      });
    }

    function tampilkanGalat(pesan: string) {
      if (berhenti) return;

      gagal = true;

      setHasil({
        riwayat: [],
        status: 'gagal',
        pesanGalat: pesan,
      });
    }

    const berhentiKelas = onSnapshot(
      query(
        collection(db, 'kelas'),
        where('pesertaIds', 'array-contains', praktikanId),
      ),
      (snapshot) => {
        if (berhenti) return;

        daftarKelas = new Map(
          snapshot.docs.map((dokumen) => {
            const data = dokumen.data();

            return [
              dokumen.id,
              {
                nama: String(data.nama ?? ''),
                lab: String(data.lab ?? ''),
              },
            ];
          }),
        );

        kelasSiap = true;
        perbaruiRiwayat();
      },
      (galat) => tampilkanGalat(pesanDariGalat(galat)),
    );

    const berhentiSesi = dengarkanSesiPraktikan(
      db,
      praktikanId,
      (hasilSesi) => {
        if (berhenti) return;

        if (!hasilSesi.ok) {
          tampilkanGalat(hasilSesi.pesan);
          return;
        }

        daftarSesi = hasilSesi.data;
        sesiSiap = true;

        const idSesiAktif = new Set(
          daftarSesi.map((sesi) => sesi.id),
        );

        for (const [sesiId, hentikan] of listenerPresensi) {
          if (!idSesiAktif.has(sesiId)) {
            hentikan();
            listenerPresensi.delete(sesiId);
            waktuPresensi.delete(sesiId);
            presensiSiap.delete(sesiId);
          }
        }

        for (const sesi of daftarSesi) {
          if (listenerPresensi.has(sesi.id)) continue;

          const hentikan = onSnapshot(
            doc(
              db,
              'sesi',
              sesi.id,
              'presensi',
              praktikanId,
            ),
            (snapshot) => {
              if (berhenti) return;

              if (!snapshot.exists()) {
                waktuPresensi.set(sesi.id, null);
              } else {
                waktuPresensi.set(
                  sesi.id,
                  ubahWaktu(snapshot.data().waktu),
                );
              }

              presensiSiap.add(sesi.id);
              perbaruiRiwayat();
            },
            (galat) => tampilkanGalat(pesanDariGalat(galat)),
          );

          listenerPresensi.set(sesi.id, hentikan);
        }

        perbaruiRiwayat();
      },
    );

    return () => {
      berhenti = true;
      berhentiKelas();
      berhentiSesi();

      for (const hentikan of listenerPresensi.values()) {
        hentikan();
      }

      listenerPresensi.clear();
      waktuPresensi.clear();
      presensiSiap.clear();
    };
  }, [db, praktikanId]);

  if (!db || !praktikanId) {
    return HASIL_GAGAL;
  }

  return hasil;
}
