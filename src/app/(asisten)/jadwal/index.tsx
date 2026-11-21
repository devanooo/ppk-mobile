import { router } from 'expo-router';

import { JadwalAsistenScreen } from '@/features/asisten/jadwal-screen';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSesiAsisten } from '@/features/asisten/use-sesi-asisten';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function JadwalAsistenRoute() {
  const { user } = useSession();

  const hasil = useSesiAsisten(
    db,
    user?.peran === 'asisten' ? user.id : undefined,
  );

  return (
    <JadwalAsistenScreen
      onBukaSesi={(id) =>
        router.push({
          pathname: '/(asisten)/jadwal/[id]',
          params: { id },
        })
      }
      pesanGalat={hasil.pesanGalat}
      profil={user?.peran === 'asisten' ? <MenuProfilAsisten /> : null}
      sesi={hasil.sesi}
      status={hasil.status}
    />
  );
}
