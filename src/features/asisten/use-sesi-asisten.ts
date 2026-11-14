import { useEffect, useMemo, useState } from 'react';
import type { Firestore } from 'firebase/firestore';

import { dengarkanKelasAsisten, type Kelas } from '@/lib/kelas';
import { dengarkanSesiAsisten, type SesiFirestore } from '@/lib/sesi';

export type SesiAsisten = SesiFirestore & {
  namaKelas: string;
  lab: string;
  pesertaIds: string[];
};

type StatusMuat = 'memuat' | 'siap' | 'gagal';

type HasilHook = {
  sesi: SesiAsisten[];
  status: StatusMuat;
  pesanGalat?: string;
};

export function useSesiAsisten(
  db: Firestore | null,
  asistenId: string | undefined,
): HasilHook {
  const [daftarSesi, setDaftarSesi] = useState<SesiFirestore[]>([]);
  const [daftarKelas, setDaftarKelas] = useState<Kelas[]>([]);
  const [statusSesi, setStatusSesi] = useState<StatusMuat>('memuat');
  const [statusKelas, setStatusKelas] = useState<StatusMuat>('memuat');
  const [pesanGalat, setPesanGalat] = useState<string>();

  useEffect(() => {
    if (!db || !asistenId) {
      return;
    }

    let aktif = true;

    const berhentiDengarSesi = dengarkanSesiAsisten(
      db,
      asistenId,
      (hasil) => {
        if (!aktif) return;

        if (hasil.ok) {
          setDaftarSesi(hasil.data);
          setStatusSesi('siap');
        } else {
          setStatusSesi('gagal');
          setPesanGalat(hasil.pesan);
        }
      },
    );

    const berhentiDengarKelas = dengarkanKelasAsisten(
      db,
      asistenId,
      (hasil) => {
        if (!aktif) return;

        if (hasil.ok) {
          setDaftarKelas(hasil.data);
          setStatusKelas('siap');
        } else {
          setStatusKelas('gagal');
          setPesanGalat(hasil.pesan);
        }
      },
    );

    return () => {
      aktif = false;
      berhentiDengarSesi();
      berhentiDengarKelas();
    };
  }, [db, asistenId]);

  const sesi = useMemo(() => {
    const kelasById = new Map(
      daftarKelas.map((kelas) => [kelas.id, kelas]),
    );

    return daftarSesi
      .map((item): SesiAsisten | null => {
        const kelas = kelasById.get(item.kelasId);

        if (!kelas) return null;

        return {
          ...item,
          namaKelas: kelas.nama,
          lab: kelas.lab,
          pesertaIds: kelas.pesertaIds,
        };
      })
      .filter((item): item is SesiAsisten => item !== null)
      .sort((a, b) =>
        `${a.tanggal}T${a.jamMulai}`.localeCompare(
          `${b.tanggal}T${b.jamMulai}`,
        ),
      );
  }, [daftarSesi, daftarKelas]);

  if (!db || !asistenId) {
    return {
      sesi: [],
      status: 'gagal',
      pesanGalat: 'Data akun asisten belum tersedia.',
    };
  }

  if (statusSesi === 'gagal' || statusKelas === 'gagal') {
    return {
      sesi: [],
      status: 'gagal',
      pesanGalat: pesanGalat ?? 'Gagal memuat jadwal.',
    };
  }

  return {
    sesi,
    status:
      statusSesi === 'siap' && statusKelas === 'siap'
        ? 'siap'
        : 'memuat',
  };
}
