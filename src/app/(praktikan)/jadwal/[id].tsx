import { useLocalSearchParams, useRouter } from 'expo-router';

import { users } from '@/data/dummy';
import { DetailSesiScreen } from '@/features/praktikan/detail-sesi-screen';
import { useSession } from '@/store/session-store';

export default function DetailSesiPraktikanRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sesiById } = useSession();

  const sesi = sesiById(id);
  const asisten = sesi ? users.find((pengguna) => pengguna.id === sesi.asistenId) : undefined;

  function kembali() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(praktikan)/jadwal');
  }

  return (
    <DetailSesiScreen namaAsisten={asisten?.nama} onKembali={kembali} sesi={sesi ?? null} />
  );
}
