import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import type { Peran } from '@/types';

const LABEL_PERAN: Record<Peran, string> = {
  praktikan: 'Praktikan',
  asisten: 'Asisten',
};

type AppHeaderProps = {
  peran: Peran;
  /** Slot ikon notifikasi; layar pemanggil menentukan apakah ikon ditampilkan. */
  notifikasi?: ReactNode;
  /** Slot aksi kanan, mis. tombol menu profil. */
  aksi?: ReactNode;
  className?: string;
};

/**
 * Header aplikasi: wordmark, slot notifikasi opsional, dan pill peran.
 */
export function AppHeader({
  peran,
  notifikasi,
  aksi,
  className = '',
}: AppHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between gap-three ${className}`}>
      <Text
        className="flex-1 text-subtitle font-bold text-text"
        numberOfLines={1}
      >
        PraktikumKU
      </Text>

      <View className="flex-row items-center gap-two">
        {notifikasi}

        <View className="rounded-pill bg-backgroundSelected px-twoHalf py-one">
          <Text className="text-caption font-semibold text-text">{LABEL_PERAN[peran]}</Text>
        </View>

        {aksi}
      </View>
    </View>
  );
}

export type { AppHeaderProps };
