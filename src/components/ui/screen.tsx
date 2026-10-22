import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

type ScreenProps = {
  children: ReactNode;
  className?: string;
  edges?: Edge[];
  padded?: boolean;
};

/**
 * SafeAreaView pihak ketiga tidak dibaca NativeWind, jadi layout-nya lewat
 * style; kelas dari token dipasang di View dalam.
 */
export function Screen({ children, className = '', edges, padded = true }: ScreenProps) {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={edges} style={{ flex: 1 }}>
        <View className={`flex-1 ${padded ? 'px-three' : ''} ${className}`}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

export type { ScreenProps };
