import { useLocalSearchParams, useRouter } from 'expo-router';

import { LayarPindai } from '@/features/presensi/layar-pindai';
import { useLayarPindai } from '@/features/presensi/use-layar-pindai';
import { useSession } from '@/store/session-store';

export default function PindaiRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();

  const sesiId = Array.isArray(id) ? id[0] : id;

  const layar = useLayarPindai(sesiId ?? '', user?.id ?? '');

  if (!user || !sesiId) return null;

  return (
    <LayarPindai
      {...layar}
      onKembali={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }

        router.replace('/(praktikan)/jadwal');
      }}
    />
  );
}
