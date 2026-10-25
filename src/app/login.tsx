import { useRouter } from 'expo-router';

import { berandaUntuk } from '@/features/auth/beranda';
import { LoginScreen } from '@/features/auth/login-screen';
import { useSession } from '@/store/session-store';

export default function LoginRoute() {
  const router = useRouter();
  const { login } = useSession();

  return (
    <LoginScreen
      onMasuk={login}
      onBerhasil={(user) => router.replace(berandaUntuk(user.peran))}
      onKembali={() => router.replace('/')}
    />
  );
}
