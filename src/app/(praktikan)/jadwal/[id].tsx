
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DetailSesiScreen } from '@/features/praktikan/detail-sesi-screen';
import { useDetailSesiPraktikan } from '@/features/praktikan/use-detail-sesi-praktikan';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { catatPresensi } from '@/lib/presensi';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function DetailSesiPraktikanRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();

  const sesiId = Array.isArray(id) ? id[0] : id;

  const hasil = useDetailSesiPraktikan(
    db,
    sesiId ?? '',
    user?.id ?? '',
  );

  if (!user || !sesiId) return null;

  function kembali() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(praktikan)/jadwal');
  }

  return (
    <DetailSesiScreen
      onCatatKehadiran={() =>
        catatPresensi({
          db,
          sesiId,
          praktikanId: user.id,
        })
      }
      onKembali={kembali}
      praktikan={user}
      profil={<MenuProfilPraktikan />}
      sesi={hasil.sesi}
      status={hasil.status}
      pesanGalat={hasil.pesanGalat}
      waktuHadir={hasil.waktuHadir}
    />
  );
}
