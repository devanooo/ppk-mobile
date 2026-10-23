import { useRouter } from 'expo-router';
import { useState } from 'react';

import { BottomSheet, ProfileMenu } from '@/components/ui';
import { berandaUntuk } from '@/features/auth/beranda';
import { useSession } from '@/store/session-store';

type Lembar = 'keluar' | 'asisten' | null;

export function MenuProfilPraktikan() {
  const { user, logout } = useSession();
  const router = useRouter();
  const [lembar, setLembar] = useState<Lembar>(null);

  if (!user) return null;

  function bukaLembar(nilai: Lembar) {
    setTimeout(() => setLembar(nilai), 0);
  }

  function keluar() {
    setLembar(null);
    logout();
  }

  return (
    <>
      <ProfileMenu
        user={user}
        onHome={() => router.replace(berandaUntuk(user.peran))}
        onLogout={() => bukaLembar('keluar')}
        onSwitchRole={() => bukaLembar('asisten')}
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
        visible={lembar === 'asisten'}
        onClose={() => setLembar(null)}
        judul="Halaman asisten belum tersedia"
        deskripsi="Ganti peran ke asisten belum dapat dipakai di build ini. Kamu tetap masuk sebagai praktikan."
        labelKonfirmasi="Mengerti"
        onKonfirmasi={() => setLembar(null)}
      />
    </>
  );
}
