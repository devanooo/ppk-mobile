
import { useRouter } from 'expo-router';

import { JadwalScreen } from '@/features/praktikan/jadwal-screen';
import { useJadwalPraktikan } from '@/features/praktikan/use-jadwal-praktikan';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function JadwalPraktikanRoute() {
  const router = useRouter();
  const { user } = useSession();

  const hasil = useJadwalPraktikan(
    db,
    user?.peran === 'praktikan' ? user.id : undefined,
  );

  if (!user) {
    return null;
  }

  return (
    <JadwalScreen
      namaPraktikan={user.nama}
      profil={<MenuProfilPraktikan />}
      sesi={hasil.jadwal}
      status={hasil.status}
      pesanGalat={hasil.pesanGalat}
      onBukaSesi={(id) =>
        router.push({
          pathname: '/(praktikan)/jadwal/[id]',
          params: { id },
        })
      }
    />
  );
}
