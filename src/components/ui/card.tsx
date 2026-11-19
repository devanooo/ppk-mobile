import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

/** `muted` memakai permukaan lavender tanpa border, sesuai referensi blok info. */
type CardTone = 'default' | 'muted';

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: CardTone;
} & (
  | { onPress: () => void; accessibilityLabel: string }
  | { onPress?: undefined; accessibilityLabel?: string }
);

/**
 * Kartu tidak memakai shadow. `muted` memakai token `backgroundSelected` karena
 * itulah satu-satunya permukaan bertinta yang mengikuti mode terang dan gelap;
 * token `surfaceMuted` belum ada.
 */
const KULIT: Record<CardTone, string> = {
  default: 'rounded-lg border border-border bg-backgroundElement p-three',
  muted: 'rounded-lg bg-backgroundSelected p-three',
};

export function Card({
  children,
  onPress,
  accessibilityLabel,
  className = '',
  tone = 'default',
}: CardProps) {
  if (!onPress) {
    return <View className={`${KULIT[tone]} ${className}`}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      className={`${KULIT[tone]} ${className} active:scale-95`}
    >
      {children}
    </Pressable>
  );
}

export type { CardProps, CardTone };
