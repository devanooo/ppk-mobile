import { useRouter } from 'expo-router';

import { berandaUntuk } from '@/features/auth/beranda';
import { LoginScreen } from '@/features/auth/login-screen';
import { useSession, type HasilLogin } from '@/store/session-store';

export default function LoginRoute() {
  const router = useRouter();
  const { login, logout } = useSession();

  function masuk(username: string, password: string): HasilLogin {
    const hasil = login(username, password);

    if (hasil.ok && hasil.user.peran === 'asisten') {
      logout();
      return { ok: false, pesan: 'Halaman asisten belum tersedia' };
    }

    return hasil;
  }

  return (
    <LoginScreen
      onMasuk={masuk}
      onBerhasil={(user) => router.replace(berandaUntuk(user.peran))}
      onKembali={() => router.replace('/')}
    />
  );
}
