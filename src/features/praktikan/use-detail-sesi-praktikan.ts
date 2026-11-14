
import { useEffect, useState } from 'react';
import {
  doc,
  onSnapshot,
  type Firestore,
} from 'firebase/firestore';

import {
  dengarkanPresensiSaya,
  type HasilMuatPresensiSaya,
} from '@/lib/presensi';
import {
  dengarkanSesiById,
  type SesiFirestore,
} from '@/lib/sesi';
import { pesanDariGalat } from '@/lib/izin-aturan';

export type DetailSesiPraktikan = SesiFirestore & {
  namaKelas: string;
  lab: string;
};

type StatusMuat = 'memuat' | 'siap' | 'gagal';

type HasilDetailSesi = {
  sesi: DetailSesiPraktikan | null;
  waktuHadir?: Date;
  status: StatusMuat;
  pesanGalat?: string;
};

export function useDetailSesiPraktikan(
  db: Firestore,
  sesiId: string,
  praktikanId: string,
): HasilDetailSesi {
  const [sesi, setSesi] = useState<DetailSesiPraktikan | null>(null);
  const [waktuHadir, setWaktuHadir] = useState<Date | undefined>();
  const [status, setStatus] = useState<StatusMuat>('memuat');
  const [pesanGalat, setPesanGalat] = useState<string>();

  useEffect(() => {
    let berhenti = false;
    let berhentiKelas: (() => void) | undefined;
    let berhentiPresensi: (() => void) | undefined;

    let sesiSiap = false;
    let kelasSiap = false;
    let presensiSiap = false;

    let dataSesi: SesiFirestore | null = null;
    let namaKelas = '';
    let lab = '';

    function perbaruiStatus() {
      if (berhenti) return;

      if (!sesiSiap || !kelasSiap || !presensiSiap) {
        return;
      }

      if (!dataSesi) {
        setSesi(null);
        setStatus('siap');
        return;
      }

      setSesi({
        ...dataSesi,
        namaKelas,
        lab,
      });
      setStatus('siap');
      setPesanGalat(undefined);
    }

    function gagal(pesan: string) {
      if (berhenti) return;
      setStatus('gagal');
      setPesanGalat(pesan);
    }

    const berhentiSesi = dengarkanSesiById(
      db,
      sesiId,
      (hasil) => {
        if (berhenti) return;

        if (!hasil.ok) {
          gagal(hasil.pesan);
          return;
        }

        sesiSiap = true;
        dataSesi = hasil.data;

        berhentiKelas?.();
        berhentiPresensi?.();
        berhentiKelas = undefined;
        berhentiPresensi = undefined;

        kelasSiap = false;
        presensiSiap = false;
        namaKelas = '';
        lab = '';
        setWaktuHadir(undefined);

        if (!dataSesi) {
          kelasSiap = true;
          presensiSiap = true;
          perbaruiStatus();
          return;
        }

        berhentiKelas = onSnapshot(
          doc(db, 'kelas', dataSesi.kelasId),
          (snapshot) => {
            if (berhenti) return;

            if (!snapshot.exists()) {
              gagal('Data kelas tidak ditemukan');
              return;
            }

            const dataKelas = snapshot.data();
            namaKelas = String(dataKelas.nama ?? '');
            lab = String(dataKelas.lab ?? '');
            kelasSiap = true;
            perbaruiStatus();
          },
          (galat) => gagal(pesanDariGalat(galat)),
        );

        berhentiPresensi = dengarkanPresensiSaya(
          db,
          sesiId,
          praktikanId,
          (hasilPresensi: HasilMuatPresensiSaya) => {
            if (berhenti) return;

            if (!hasilPresensi.ok) {
              gagal(hasilPresensi.pesan);
              return;
            }

            setWaktuHadir(hasilPresensi.data ?? undefined);
            presensiSiap = true;
            perbaruiStatus();
          },
        );
      },
    );

    return () => {
      berhenti = true;
      berhentiSesi();
      berhentiKelas?.();
      berhentiPresensi?.();
    };
  }, [db, sesiId, praktikanId]);

  return {
    sesi,
    waktuHadir,
    status,
    pesanGalat,
  };
}
