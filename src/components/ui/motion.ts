import { useEffect, useLayoutEffect, useState } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';

/** Mengikuti setelan reduce motion perangkat; motion hanya bila diizinkan (design.md baris 618). */
export function useReduceMotion(): boolean {
  const [kurangiGerak, setKurangiGerak] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setKurangiGerak);
    const langganan = AccessibilityInfo.addEventListener('reduceMotionChanged', setKurangiGerak);
    return () => langganan.remove();
  }, []);

  return kurangiGerak;
}

/**
 * Progres animasi 0 ke 1 saat `terbuka` menjadi benar, langsung 1 bila perangkat
 * meminta reduce motion. Dipakai bottom sheet dan dropdown profil.
 */
export function useAnimasiMuncul(terbuka: boolean, durasi: number): Animated.Value {
  const [progres] = useState(() => new Animated.Value(0));
  const kurangiGerak = useReduceMotion();

  useLayoutEffect(() => {
    if (!terbuka) return;

    if (kurangiGerak) {
      progres.setValue(1);
      return;
    }

    progres.setValue(0);
    const animasi = Animated.timing(progres, {
      toValue: 1,
      duration: durasi,
      useNativeDriver: true,
    });
    animasi.start();
    return () => animasi.stop();
  }, [terbuka, durasi, kurangiGerak, progres]);

  return progres;
}
