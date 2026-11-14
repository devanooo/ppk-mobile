import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { DaftarIzinPraktikan, type StatusDaftar } from '@/features/izin/daftar-izin-praktikan';
import { urutkanIzin } from '@/features/izin/format-izin';
import { useIzinPraktikan } from '@/features/izin/use-izin-praktikan';
import { useSesiPraktikan } from '@/features/izin/use-sesi-praktikan';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { db } from '@/lib/firebase';
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

  return (
    <DaftarIzinPraktikan
      daftarIzin={daftar}
      namaPraktikan={user.nama}
      onAjukan={() => router.push('/(praktikan)/izin/ajukan')}
      pesanGalat={statusSesi === 'gagal' ? galatSesi : galatIzin}
      profil={<MenuProfilPraktikan />}
      sesiById={sesiById}
      status={gabungStatus(statusSesi, statusIzin)}
      terpotong={terpotong}
    />
  );
}
