import { ScrollView, Text, View } from 'react-native';

import { AppButton, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';

type LandingScreenProps = {
  onMasuk: () => void;
};

export function LandingScreen({ onMasuk }: LandingScreenProps) {
  return (
    <Screen padded={false}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-three pb-three pt-three"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full self-center" style={{ maxWidth: MaxContentWidth }}>
          <Text className="text-subtitle font-semibold text-text">PraktikumKU</Text>
        </View>

        <View
          className="my-auto w-full self-center py-four"
          style={{ maxWidth: MaxContentWidth }}
        >
          <Text accessibilityRole="header" className="text-display font-semibold text-text">
            Presensi praktikum, lebih mudah.
          </Text>
          <Text className="mt-three text-body text-textSecondary">
            Lihat jadwal, kelola sesi, dan catat kehadiran dalam satu aplikasi.
          </Text>
        </View>

        <View className="w-full self-center" style={{ maxWidth: MaxContentWidth }}>
          <AppButton
            accessibilityLabel="Masuk ke akun PraktikumKU"
            label="Masuk"
            onPress={onMasuk}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

export type { LandingScreenProps };
