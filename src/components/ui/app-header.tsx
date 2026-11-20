import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import type { Peran } from '@/types';

const LABEL_PERAN: Record<Peran, string> = {
  praktikan: 'Praktikan',
  asisten: 'Asisten',
};

type AppHeaderProps = {
  peran: Peran;
  /** Slot aksi kanan, mis. tombol menu profil. */
  aksi?: ReactNode;
  className?: string;
};

/**
 * Header aplikasi: wordmark dan pill peran, mengikuti referensi layar asisten.
 * Lonceng notifikasi belum dirender karena belum ada tujuan navigasinya.
 */
export function AppHeader({ peran, aksi, className = '' }: AppHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between gap-three ${className}`}>
      <Text className="text-subtitle font-bold text-text">PraktikumKU</Text>

      <View className="flex-row items-center gap-two">
        <View className="rounded-pill bg-backgroundSelected px-twoHalf py-one">
          <Text className="text-caption font-semibold text-text">{LABEL_PERAN[peran]}</Text>
        </View>

        {aksi}
      </View>
    </View>
  );
}

export type { AppHeaderProps };
