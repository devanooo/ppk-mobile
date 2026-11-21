import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** Header asisten yang sama dengan layar Jadwal, tanpa menu profil. */
export function HeaderAsisten() {
  const tema = useTheme();

  return (
    <View className="flex-row items-center justify-between gap-two px-three pt-three">
      <Text
        className="flex-1 text-subtitle font-bold text-primary"
        numberOfLines={1}
      >
        PraktikumKU
      </Text>

      <View className="flex-row items-center gap-two">
        <View
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          className="h-touch w-touch items-center justify-center"
        >
          <SymbolView
            name={{
              ios: 'bell',
              android: 'notifications_none',
              web: 'notifications_none',
            }}
            size={22}
            tintColor={tema.primary}
          />
        </View>

        <View className="rounded-pill bg-backgroundSelected px-two py-one">
          <Text className="text-caption font-medium text-primary">
            Asisten
          </Text>
        </View>
      </View>
    </View>
  );
}
