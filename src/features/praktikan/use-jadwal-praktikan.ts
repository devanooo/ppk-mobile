import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';

import {
  dengarkanSesiPraktikan,
  type SesiFirestore,
} from '@/lib/sesi';

export type JadwalPraktikan = SesiFirestore & {
  namaKelas: string;
  lab: string;
};

type HasilJadwalPraktikan = {
  jadwal: JadwalPraktikan[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
};

type DataKelas = {
  nama: string;
  lab: string;
};

const HASIL_MEMUAT: HasilJadwalPraktikan = {
  jadwal: [],
  status: 'memuat',
};

const HASIL_GAGAL: HasilJadwalPraktikan = {
  jadwal: [],
  status: 'gagal',
  pesanGalat: 'Data praktikan belum tersedia.',
};

export function useJadwalPraktikan(
  db: Firestore | null,
  praktikanId: string | undefined,
): HasilJadwalPraktikan {
  const [hasil, setHasil] = useState<HasilJadwalPraktikan>(
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

    function perbaruiJadwal() {
      if (berhenti || gagal || !kelasSiap || !sesiSiap) {
        return;
      }

      const jadwal: JadwalPraktikan[] = [];

      for (const sesi of daftarSesi) {
        const kelas = daftarKelas.get(sesi.kelasId);

        if (!kelas) continue;

        jadwal.push({
          ...sesi,
          namaKelas: kelas.nama,
          lab: kelas.lab,
        });
      }

      setHasil({
        jadwal,
        status: 'siap',
      });
    }

    const rujukanKelas = query(
      collection(db, 'kelas'),
      where('pesertaIds', 'array-contains', praktikanId),
    );

    const berhentiKelas = onSnapshot(
      rujukanKelas,
      (snapshot) => {
        daftarKelas = new Map(
          snapshot.docs.map((dokumen) => {
            const data = dokumen.data();

            return [
              dokumen.id,
              {
                nama: data.nama as string,
                lab: data.lab as string,
              },
            ];
          }),
        );

        kelasSiap = true;
        perbaruiJadwal();
      },
      (error) => {
        gagal = true;

        if (!berhenti) {
          setHasil({
            jadwal: [],
            status: 'gagal',
            pesanGalat:
              error.message || 'Gagal memuat daftar kelas.',
          });
        }
      },
    );

    const berhentiSesi = dengarkanSesiPraktikan(
      db,
      praktikanId,
      (hasilSesi) => {
        if (!hasilSesi.ok) {
          gagal = true;

          if (!berhenti) {
            setHasil({
              jadwal: [],
              status: 'gagal',
              pesanGalat: hasilSesi.pesan,
            });
          }

          return;
        }

        daftarSesi = hasilSesi.data;
        sesiSiap = true;
        perbaruiJadwal();
      },
    );

    return () => {
      berhenti = true;
      berhentiKelas();
      berhentiSesi();
    };
  }, [db, praktikanId]);

  if (!db || !praktikanId) {
    return HASIL_GAGAL;
  }

  return hasil;
}
