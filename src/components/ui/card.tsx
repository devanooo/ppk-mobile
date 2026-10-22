import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type CardProps = { children: ReactNode; className?: string } & (
  | { onPress: () => void; accessibilityLabel: string }
  | { onPress?: undefined; accessibilityLabel?: string }
);

const KULIT = 'rounded-lg border border-border bg-backgroundElement p-three';

export function Card({ children, onPress, accessibilityLabel, className = '' }: CardProps) {
  if (!onPress) {
    return <View className={`${KULIT} ${className}`}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      className={`${KULIT} ${className} active:scale-95`}
    >
      {children}
    </Pressable>
  );
}

export type { CardProps };
