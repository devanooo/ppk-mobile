
import { KehadiranScreen } from '@/features/praktikan/kehadiran-screen';
import { useRiwayatKehadiran } from '@/features/praktikan/use-riwayat-kehadiran';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';
import { useRouter } from 'expo-router';

export default function KehadiranPraktikanRoute() {
  const router = useRouter();
  const { user } = useSession();

  const hasil = useRiwayatKehadiran(
    db,
    user?.peran === 'praktikan' ? user.id : undefined,
  );

  if (!user) return null;

  return (
    <KehadiranScreen
      profil={<MenuProfilPraktikan />}
      praktikum={hasil.praktikum}
      riwayat={hasil.riwayat}
      status={hasil.status}
      pesanGalat={hasil.pesanGalat}
      onBukaRiwayat={(id) => {
        router.push({
          pathname: '/(praktikan)/riwayat/[id]',
          params: { id },
        });
      }}
    />
  );
}


