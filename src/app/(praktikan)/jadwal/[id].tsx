import { useLocalSearchParams, useRouter } from 'expo-router';

import { users } from '@/data/dummy';
import { DetailSesiScreen } from '@/features/praktikan/detail-sesi-screen';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { useSession } from '@/store/session-store';

export default function DetailSesiPraktikanRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { catatPresensi, presensiSaya, sesiById, user } = useSession();

  if (!user) {
    return null;
  }

  const sesi = sesiById(id);
  const asisten = sesi ? users.find((pengguna) => pengguna.id === sesi.asistenId) : undefined;
  const waktuHadir = presensiSaya(user.id).find((item) => item.sesiId === id)?.waktu;

  function kembali() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(praktikan)/jadwal');
  }

  return (
    <DetailSesiScreen
      namaAsisten={asisten?.nama}
      onCatatKehadiran={() => catatPresensi(id, user.id)}
      onKembali={kembali}
      praktikan={user}
      profil={<MenuProfilPraktikan />}
      sesi={sesi ?? null}
      waktuHadir={waktuHadir}
    />
  );
}
