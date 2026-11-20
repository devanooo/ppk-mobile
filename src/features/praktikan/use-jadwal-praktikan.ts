
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

    let daftarKelas = new Map<string, DataKelas>();
    let daftarSesi: SesiFirestore[] = [];

    function perbaruiJadwal() {
      if (berhenti || !kelasSiap || !sesiSiap) {
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

    function tanganiGalat(pesan: string) {
      if (berhenti) return;

      setHasil((sebelumnya) => ({
        // Pertahankan data yang sudah berhasil dimuat.
        jadwal: sebelumnya.jadwal,
        status: sebelumnya.jadwal.length > 0 ? 'siap' : 'gagal',
        pesanGalat:
          sebelumnya.jadwal.length > 0 ? undefined : pesan,
      }));
    }

    // ========================================
    // LISTENER KELAS

    const rujukanKelas = query(
      collection(db, 'kelas'),
      where('pesertaIds', 'array-contains', praktikanId),
    );

    const berhentiKelas = onSnapshot(
      rujukanKelas,
      (snapshot) => {
        if (berhenti) return;

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
        tanganiGalat(
          error.message || 'Gagal memuat daftar kelas.',
        );
      },
    );

    // ========================================
    // LISTENER SESI

    const berhentiSesi = dengarkanSesiPraktikan(
      db,
      praktikanId,
      (hasilSesi) => {
        if (berhenti) return;

        if (!hasilSesi.ok) {
          tanganiGalat(hasilSesi.pesan);
          return;
        }

        daftarSesi = hasilSesi.data;
        sesiSiap = true;

        perbaruiJadwal();
      },
    );

    // ========================================
    // CLEANUP

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
