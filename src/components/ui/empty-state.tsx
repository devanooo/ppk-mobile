import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { AppButton } from './app-button';

/** Teks kondisi kosong, disalin persis dari PRD bagian 10. */
const teksKosong = {
  jadwal: {
    judul: 'Belum ada jadwal',
    deskripsi: 'Sesi praktikum akan muncul di sini.',
  },
  rekap: {
    judul: 'Belum ada yang presensi',
    deskripsi: 'Peserta yang sudah presensi akan muncul di sini.',
  },
  tabRekap: {
    judul: 'Belum ada data rekap',
  },
  riwayat: {
    judul: 'Belum ada catatan kehadiran',
    deskripsi: 'Presensi yang kamu lakukan akan tercatat di sini.',
  },
} as const;

type EmptyStateProps = {
  judul: string;
  deskripsi?: string;
  ikon?: ReactNode;
  className?: string;
  /** `gagal` menandai state error dan memakai permukaan ikon danger. */
  tone?: 'kosong' | 'gagal';
  /** Aksi lanjutan, mis. tombol "Coba lagi" pada state gagal. */
  aksi?: { label: string; onPress: () => void };
  accessibilityLabel?: string;
};

export function EmptyState({
  judul,
  deskripsi,
  ikon,
  className = '',
  tone = 'kosong',
  aksi,
  accessibilityLabel,
}: EmptyStateProps) {
  const gagal = tone === 'gagal';

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion={gagal ? 'polite' : undefined}
      className={`items-center justify-center px-four py-five ${className}`}
    >
      {ikon ? (
        <View
          className={`mb-three${gagal ? ' rounded-pill bg-dangerSurface p-three' : ''}`}
        >
          {ikon}
        </View>
      ) : null}

      <Text className="text-center text-subtitle font-semibold text-text">{judul}</Text>

      {deskripsi ? (
        <Text className="mt-two text-center text-small text-textSecondary">{deskripsi}</Text>
      ) : null}

      {aksi ? (
        <AppButton
          className="mt-three w-full"
          label={aksi.label}
          onPress={aksi.onPress}
        />
      ) : null}
    </View>
  );
}

export { teksKosong };
export type { EmptyStateProps };
