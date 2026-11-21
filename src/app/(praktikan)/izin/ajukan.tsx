import { useRouter } from 'expo-router';

import { DaftarSesiAjukan } from '@/features/izin/daftar-sesi-ajukan';
import { useSesiPraktikan } from '@/features/izin/use-sesi-praktikan';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function AjukanIzinScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { sesi, status, pesanGalat } = useSesiPraktikan(db, user?.id);

  if (!user) {
    return null;
  }

  function kembali() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(praktikan)/izin');
  }

  return (
    <DaftarSesiAjukan
      daftarSesi={sesi}
      onPilihSesi={(id) =>
        router.push({
          pathname: '/(praktikan)/izin/ajukan/[id]',
          params: { id },
        })
      }
      onKembali={kembali}
      pesanGalat={pesanGalat}
      profil={<MenuProfilPraktikan />}
      status={status}
    />
  );
}
