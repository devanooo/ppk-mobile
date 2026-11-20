import { Text, View } from 'react-native';

import type { StatusSesi } from '@/types';

type GayaBadge = { label: string; wadah: string; teks: string };

/** Tone tambahan untuk badge di luar status sesi, tanpa menambah kosakata baru. */
type BadgeTone = 'warning' | 'success' | 'neutral' | 'danger';

// `success` di atas `successSurface` hanya 3.89:1 dan `textSecondary` di atas
// `backgroundSelected` 4.15:1 pada mode terang, keduanya di bawah 4.5:1 yang
// diminta design.md bagian 6. Label karena itu memakai token teks; statusnya
// tetap terbaca dari kata, bukan warna saja (design.md bagian 6).
const GAYA: Record<StatusSesi, GayaBadge> = {
  'belum-dibuka': { label: 'Belum dibuka', wadah: 'bg-warningSurface', teks: 'text-warning' },
  dibuka: { label: 'Dibuka', wadah: 'bg-successSurface', teks: 'text-text' },
  // Ditutup bukan error, jadi memakai permukaan netral, bukan danger.
  ditutup: { label: 'Ditutup', wadah: 'bg-backgroundSelected', teks: 'text-text' },
};

/**
 * Peta tone untuk badge di luar `StatusSesi`. `danger` memakai teks danger
 * karena kontrasnya pada `dangerSurface` sekitar 4.7:1 di mode terang dan
 * 4.9:1 di mode gelap, jadi masih lolos 4.5:1.
 */
const GAYA_TONE: Record<BadgeTone, { wadah: string; teks: string }> = {
  warning: { wadah: 'bg-warningSurface', teks: 'text-warning' },
  success: { wadah: 'bg-successSurface', teks: 'text-text' },
  neutral: { wadah: 'bg-backgroundSelected', teks: 'text-text' },
  danger: { wadah: 'bg-dangerSurface', teks: 'text-danger' },
};

type PropsStatus = { status: StatusSesi; label?: undefined; tone?: undefined };
type PropsCustom = { status?: undefined; label: string; tone: BadgeTone };

type StatusBadgeProps = (PropsStatus | PropsCustom) & { className?: string };

export function StatusBadge({ className = '', ...props }: StatusBadgeProps) {
  const gaya: GayaBadge =
    props.status === undefined
      ? { label: props.label, ...GAYA_TONE[props.tone] }
      : GAYA[props.status];

  return (
    <View
      className={`self-start rounded-pill px-twoHalf py-one ${gaya.wadah} ${className}`}
    >
      <Text className={`text-caption ${gaya.teks}`}>{gaya.label}</Text>
    </View>
  );
}

export { GAYA_TONE };
export type { BadgeTone, StatusBadgeProps };
