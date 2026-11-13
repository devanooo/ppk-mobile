import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { BottomSheet, ProfileMenu } from '@/components/ui';
import { berandaUntuk } from '@/features/auth/beranda';
import { useSession } from '@/store/session-store';

export function MenuProfilPraktikan() {
  const { user, logout } = useSession();
  const router = useRouter();
  const [lembarTerbuka, setLembarTerbuka] = useState(false);

  if (!user || user.peran !== 'praktikan') return null;

  async function keluar() {
    const hasil = await logout();

    if (!hasil.ok) {
      Alert.alert('Gagal keluar', hasil.pesan);
      return;
    }

    setLembarTerbuka(false);
    router.replace('/');
  }

  return (
    <>
      <ProfileMenu
        user={user}
        onHome={() => router.replace(berandaUntuk(user.peran))}
        onLogout={() => setLembarTerbuka(true)}
      />

      <BottomSheet
        visible={lembarTerbuka}
        onClose={() => setLembarTerbuka(false)}
        judul="Keluar akun?"
        deskripsi="Kamu akan kembali ke halaman awal. Data sesi dan presensi tidak dihapus oleh proses logout."
        labelKonfirmasi="Keluar"
        onKonfirmasi={keluar}
        bahaya
      />
    </>
  );
}
