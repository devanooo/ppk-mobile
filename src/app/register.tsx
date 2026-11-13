
import { useRouter } from 'expo-router';

import { RegisterScreen } from '@/features/auth/register-screen';

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <RegisterScreen
      onBerhasil={() => router.replace('/')}
      onKembali={() => router.replace('/')}
    />
  );
}
