import { useRouter } from 'expo-router';

import { JadwalScreen } from '@/features/praktikan/jadwal-screen';
import { useSession } from '@/store/session-store';

export default function JadwalPraktikanRoute() {
  const router = useRouter();
  const { user, sesiUntuk } = useSession();

  if (!user) {
    return null;
  }

  return (
    <JadwalScreen
      sesi={sesiUntuk(user)}
      onBukaSesi={(id) =>
        router.push({ pathname: '/(praktikan)/jadwal/[id]', params: { id } })
      }
    />
  );
}
