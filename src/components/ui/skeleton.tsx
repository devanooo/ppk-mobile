import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

import { useReduceMotion } from './motion';

type SkeletonProps = {
  baris?: number;
  className?: string;
  /** Bila diisi, pembaca layar mengumumkan placeholder sebagai proses memuat. */
  accessibilityLabel?: string;
};

const LEBAR = ['w-full', 'w-3/4', 'w-1/2'];

/**
 * Placeholder memuat untuk daftar dan kartu. Animasi dilewati sepenuhnya saat
 * perangkat meminta reduce motion, sesuai design.md baris 618.
 */
export function Skeleton({
  baris = 3,
  className = '',
  accessibilityLabel,
}: SkeletonProps) {
  const kurangiGerak = useReduceMotion();
  const [denyut] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (kurangiGerak) {
      denyut.setValue(1);
      return;
    }

    const animasi = Animated.loop(
      Animated.sequence([
        Animated.timing(denyut, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(denyut, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animasi.start();

    return () => animasi.stop();
  }, [denyut, kurangiGerak]);

  return (
    <Animated.View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'progressbar' : undefined}
      style={{ opacity: denyut }}
    >
      <View className={`gap-two ${className}`}>
        {Array.from({ length: Math.max(1, baris) }).map((_, indeks) => (
          <View
            key={indeks}
            className={`h-three rounded-sm bg-backgroundSelected ${LEBAR[indeks % LEBAR.length]}`}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export type { SkeletonProps };
