import { useRouter } from 'expo-router';
import { useState } from 'react';

import { BottomSheet, ProfileMenu } from '@/components/ui';
import { berandaUntuk } from '@/features/auth/beranda';
import { useSession } from '@/store/session-store';

type Lembar = 'keluar' | 'peran' | null;

export function MenuProfilAsisten() {
  const { user, logout, gantiPeranDemo } = useSession();
  const router = useRouter();
  const [lembar, setLembar] = useState<Lembar>(null);

  if (!user || user.peran !== 'asisten') {
    return null;
  }

  const labelGantiPeran = 'Beralih ke Praktikan (Demo)';

  function bukaLembar(nilai: Lembar) {
    setTimeout(() => setLembar(nilai), 0);
  }

  function keluar() {
    setLembar(null);
    logout();
    router.replace('/');
  }

  function beralihPeran() {
    const penggunaBaru = gantiPeranDemo();

    setLembar(null);

    if (penggunaBaru) {
      router.replace(berandaUntuk(penggunaBaru.peran));
    }
  }

  return (
    <>
      <ProfileMenu
        user={user}
        labelGantiPeran={labelGantiPeran}
        onHome={() => router.replace(berandaUntuk(user.peran))}
        onLogout={() => bukaLembar('keluar')}
        onSwitchRole={() => bukaLembar('peran')}
      />

      <BottomSheet
        visible={lembar === 'keluar'}
        onClose={() => setLembar(null)}
        judul="Keluar akun?"
        deskripsi="Kamu akan kembali ke halaman awal. Sesi dan presensi tetap tersimpan selama aplikasi berjalan."
        labelKonfirmasi="Keluar"
        onKonfirmasi={keluar}
        bahaya
      />

      <BottomSheet
        visible={lembar === 'peran'}
        onClose={() => setLembar(null)}
        judul="Beralih ke Praktikan?"
        deskripsi="Identitas aktif akan berganti ke akun demo Praktikan. Sesi dan presensi tetap tersimpan."
        labelKonfirmasi="Beralih"
        onKonfirmasi={beralihPeran}
      />
    </>
  );
}
