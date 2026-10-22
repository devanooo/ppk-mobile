import { Text, View } from 'react-native';

import type { StatusSesi } from '@/types';

type GayaBadge = { label: string; wadah: string; teks: string };

const GAYA: Record<StatusSesi, GayaBadge> = {
  'belum-dibuka': { label: 'Belum dibuka', wadah: 'bg-warningSurface', teks: 'text-warning' },
  dibuka: { label: 'Dibuka', wadah: 'bg-successSurface', teks: 'text-success' },
  // Ditutup bukan error, jadi memakai permukaan netral, bukan danger.
  ditutup: { label: 'Ditutup', wadah: 'bg-backgroundSelected', teks: 'text-textSecondary' },
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
