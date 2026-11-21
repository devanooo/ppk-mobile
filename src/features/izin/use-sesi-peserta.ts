
import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanIzinSaya } from '@/lib/izin';
import { bacaSesiPraktikan } from '@/lib/izin-sesi';

type HasilPeserta = {
  pesertaIds: string[];
  sudahAdaIzin: boolean;
  siap: boolean;
  pesanGalat?: string;
};

const BELUM_SIAP: HasilPeserta = {
  pesertaIds: [],
  sudahAdaIzin: false,
  siap: false,
};

export function useSesiPeserta(
  db: Firestore | null,
  sesiId: string | undefined,
  praktikanId: string | undefined,
): HasilPeserta {
  const [pesertaIds, setPesertaIds] = useState<string[]>();
  const [sudahAdaIzin, setSudahAdaIzin] = useState<boolean>();
  const [pesanGalat, setPesanGalat] = useState<string>();
  
  const kunci =
    db && sesiId && praktikanId
      ? `${sesiId}:${praktikanId}`
      : undefined;

  const [kunciTerakhir, setKunciTerakhir] = useState(kunci);

  // Reset data ketika sesi atau praktikan berubah.
  if (kunci !== kunciTerakhir) {
    setKunciTerakhir(kunci);
    setPesertaIds(undefined);
    setSudahAdaIzin(undefined);
    setPesanGalat(undefined);
  }

  // Ambil daftar peserta dari dokumen kelas.
  useEffect(() => {
    if (!db || !sesiId) return;

    let dibatalkan = false;

    bacaSesiPraktikan(db, sesiId)
      .then((hasil) => {
        if (dibatalkan) return;

        if (!hasil.ok) {
          setPesertaIds([]);
          setPesanGalat(hasil.pesan);
          return;
        }

        setPesertaIds(hasil.data.pesertaIds);
      })
      .catch((galat: unknown) => {
        if (dibatalkan) return;

        setPesertaIds([]);
        setPesanGalat(
          galat instanceof Error
            ? galat.message
            : 'Gagal memuat data peserta sesi.',
        );
      });

    return () => {
      dibatalkan = true;
    };
  }, [db, sesiId]);

  // Periksa hanya dokumen izin milik praktikan.
  useEffect(() => {
    if (!db || !sesiId || !praktikanId) return;

    return dengarkanIzinSaya(
      db,
      praktikanId,
      [sesiId],
      (hasil) => {
        if (!hasil.ok) {
          setSudahAdaIzin(undefined);
          setPesanGalat(hasil.pesan);
          return;
        }

        setSudahAdaIzin(hasil.data.length > 0);
      },
    );
  }, [db, sesiId, praktikanId]);

  if (!db || !sesiId || !praktikanId) {
    return {
      ...BELUM_SIAP,
      pesanGalat: 'Data sesi atau akun praktikan belum tersedia.',
    };
  }

  const siap =
    pesertaIds !== undefined &&
    sudahAdaIzin !== undefined &&
    !pesanGalat;

  if (!siap) {
    return {
      pesertaIds: pesertaIds ?? [],
      sudahAdaIzin: sudahAdaIzin ?? false,
      siap: false,
      pesanGalat,
    };
  }

  return {
    pesertaIds,
    sudahAdaIzin,
    siap: true,
  };
}
