import { KehadiranScreen, type RiwayatKehadiran } from '@/features/praktikan/kehadiran-screen';
import { useSession } from '@/store/session-store';

export default function KehadiranPraktikanRoute() {
  const { user, presensiSaya, sesiById } = useSession();

  if (!user) {
    return null;
  }

  const riwayat: RiwayatKehadiran[] = presensiSaya(user.id)
    .flatMap((presensi) => {
      const sesi = sesiById(presensi.sesiId);

      return sesi ? [{ sesi, waktu: presensi.waktu }] : [];
    })
    .sort((a, b) => b.waktu.localeCompare(a.waktu));

  return <KehadiranScreen riwayat={riwayat} />;
}
