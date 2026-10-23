import { useRouter } from 'expo-router';

import { LandingScreen } from '@/features/auth/landing-screen';

export default function LandingRoute() {
  const router = useRouter();

  return <LandingScreen onMasuk={() => router.push('/login')} />;
}
