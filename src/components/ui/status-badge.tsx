import { Text, View } from 'react-native';

import type { StatusSesi } from '@/types';

type GayaBadge = { label: string; wadah: string; teks: string };

// `success` di atas `successSurface` hanya 3.89:1 dan `textSecondary` di atas
// `backgroundSelected` 4.15:1 pada mode terang, keduanya di bawah 4.5:1 yang
// diminta design.md baris 617. Label karena itu memakai token teks; statusnya
// tetap terbaca dari kata, bukan warna saja (design.md baris 615).
const GAYA: Record<StatusSesi, GayaBadge> = {
  'belum-dibuka': { label: 'Belum dibuka', wadah: 'bg-warningSurface', teks: 'text-warning' },
  dibuka: { label: 'Dibuka', wadah: 'bg-successSurface', teks: 'text-text' },
  // Ditutup bukan error, jadi memakai permukaan netral, bukan danger.
  ditutup: { label: 'Ditutup', wadah: 'bg-backgroundSelected', teks: 'text-text' },
};

type StatusBadgeProps = {
  status: StatusSesi;
  className?: string;
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const gaya = GAYA[status];

  return (
    <View
      className={`self-start rounded-pill px-twoHalf py-one ${gaya.wadah} ${className}`}
    >
      <Text className={`text-caption ${gaya.teks}`}>{gaya.label}</Text>
    </View>
  );
}

export type { StatusBadgeProps };
