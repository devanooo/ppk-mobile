
import { KehadiranScreen } from '@/features/praktikan/kehadiran-screen';
import { useRiwayatKehadiran } from '@/features/praktikan/use-riwayat-kehadiran';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function KehadiranPraktikanRoute() {
  const { user } = useSession();

  const hasil = useRiwayatKehadiran(
    db,
    user?.peran === 'praktikan' ? user.id : undefined,
  );

  if (!user) return null;

  return (
    <KehadiranScreen
      namaPraktikan={user.nama}
      profil={<MenuProfilPraktikan />}
      riwayat={hasil.riwayat}
      status={hasil.status}
      pesanGalat={hasil.pesanGalat}
    />
  );
}
