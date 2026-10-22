import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

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
};

export function EmptyState({ judul, deskripsi, ikon, className = '' }: EmptyStateProps) {
  return (
    <View className={`items-center justify-center px-four py-five ${className}`}>
      {ikon ? <View className="mb-three">{ikon}</View> : null}

      <Text className="text-center text-subtitle font-semibold text-text">{judul}</Text>

      {deskripsi ? (
        <Text className="mt-two text-center text-small text-textSecondary">{deskripsi}</Text>
      ) : null}
    </View>
  );
}

export { teksKosong };
export type { EmptyStateProps };
