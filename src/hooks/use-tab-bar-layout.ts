import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RUANG_BAWAH_KONTEN } from '@/components/ui/floating-tab-bar';
import { useTheme } from '@/hooks/use-theme';

/**
 * Menentukan apakah bar tab tampil dan menyiapkan gaya scene.
 *
 * Bar hanya muncul di layar utama tab: segmen `(peran)/nama-tab` terdiri dari
 * dua bagian, sedangkan layar detail dan pemindai QR punya segmen lebih banyak.
 *
 * Scene sengaja memakai tinggi penuh tanpa `paddingBottom`. Kalau ruang bar
 * disisakan di sini, scroller berhenti di atas bar dan tidak pernah terlihat di
 * belakang pill, sehingga bar terbaca sebagai panel yang menutupi konten.
 * Ruang untuk bar dipasang sebagai padding isi scroller lewat
 * `RUANG_BAWAH_KONTEN`.
 *
 * `backgroundColor` tetap dipasang supaya area overscroll tidak menampilkan
 * latar abu bawaan `DefaultTheme` navigator.
 */
export function useTabBarLayout() {
  const segments = useSegments();
  const theme = useTheme();

  return {
    layarUtama: segments.length <= 2,
    sceneStyle: { backgroundColor: theme.background },
  };
}

/**
 * Padding bawah isi scroller di layar tab.
 *
 * Layar tab memakai `Screen` tanpa `edges` bawah, sehingga scroller benar-benar
 * mencapai tepi layar dan konten bisa terlihat di sekitar pill. Karena inset
 * perangkat tidak lagi disediakan SafeAreaView, inset itu ikut ditambahkan di
 * sini supaya item terakhir tetap berhenti di atas bar.
 */
export function useRuangBawahKonten() {
  const inset = useSafeAreaInsets();

  return RUANG_BAWAH_KONTEN + inset.bottom;
}
