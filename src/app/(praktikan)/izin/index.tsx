import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { DaftarIzinPraktikan, type StatusDaftar } from '@/features/izin/daftar-izin-praktikan';
import { urutkanIzin } from '@/features/izin/format-izin';
import type { Izin } from '@/features/izin/types';
import { useIzinPraktikan } from '@/features/izin/use-izin-praktikan';
import { useSesiPraktikan } from '@/features/izin/use-sesi-praktikan';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { db } from '@/lib/firebase';
import { klasifikasiUlangIzin } from '@/lib/izin';
import { useSession } from '@/store/session-store';

/** Sesi dan izin punya status sendiri; layar hanya butuh satu yang terburuk. */
function gabungStatus(a: StatusDaftar, b: StatusDaftar): StatusDaftar {
  if (a === 'gagal' || b === 'gagal') return 'gagal';
  if (a === 'memuat' || b === 'memuat') return 'memuat';

  return 'siap';
}

export default function IzinPraktikanScreen() {
  const { user } = useSession();
  const router = useRouter();
  const [idSedangKlasifikasi, setIdSedangKlasifikasi] = useState<string>();
  const [umpanBalik, setUmpanBalik] = useState<{ jenis: 'sukses' | 'gagal'; pesan: string } | null>(
    null,
  );

  const praktikanId = user?.id;
  const { sesi, status: statusSesi, pesanGalat: galatSesi } = useSesiPraktikan(db, praktikanId);
  const sesiIds = useMemo(() => sesi.map((item) => item.id), [sesi]);
  const { izin, status: statusIzin, pesanGalat: galatIzin, terpotong } = useIzinPraktikan(
    db,
    praktikanId,
    sesiIds,
  );

  const daftar = useMemo(() => urutkanIzin(izin), [izin]);
  const sesiById = useMemo(() => new Map(sesi.map((item) => [item.id, item])), [sesi]);

  if (!user) {
    return null;
  }

  /**
   * Menutup celah T-044: pengajuan yang klasifikasinya gagal atau menggantung
   * bisa diulang tanpa membuat pengajuan baru, yang pasti ditolak duplikat.
   */
  async function klasifikasiUlang(item: Izin) {
    if (!db || !praktikanId) {
      setUmpanBalik({ jenis: 'gagal', pesan: 'Data izin belum tersedia' });
      return;
    }

    const kunci = `${item.sesiId}:${item.id}`;
    setIdSedangKlasifikasi(kunci);
    setUmpanBalik(null);

    const hasil = await klasifikasiUlangIzin({
      db,
      sesiId: item.sesiId,
      praktikanId: item.praktikanId,
    });

    setIdSedangKlasifikasi(undefined);
    setUmpanBalik({
      jenis: hasil.ok ? 'sukses' : 'gagal',
      pesan: hasil.ok ? 'Alasan berhasil diklasifikasikan ulang' : hasil.pesan,
    });
  }

  return (
    <DaftarIzinPraktikan
      daftarIzin={daftar}
      idSedangKlasifikasi={idSedangKlasifikasi}
      namaPraktikan={user.nama}
      onAjukan={() => router.push('/(praktikan)/izin/ajukan')}
      onKlasifikasiUlang={klasifikasiUlang}
      pesanGalat={statusSesi === 'gagal' ? galatSesi : galatIzin}
      profil={<MenuProfilPraktikan />}
      sesiById={sesiById}
      status={gabungStatus(statusSesi, statusIzin)}
      terpotong={terpotong}
      umpanBalik={umpanBalik}
    />
  );
}
