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
        contentContainerClassName="grow justify-center px-three py-five"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full self-center" style={{ maxWidth: MaxContentWidth }}>
          <Text className="text-subtitle font-semibold text-text">PraktikumKU</Text>

          <Text accessibilityRole="header" className="mt-four text-display font-semibold text-text">
            Presensi praktikum, lebih mudah.
          </Text>
          <Text className="mt-three text-body text-textSecondary">
            Lihat jadwal, kelola sesi, dan catat kehadiran dalam satu aplikasi.
          </Text>

          <AppButton
            accessibilityLabel="Masuk ke akun PraktikumKU"
            className="mt-five"
            label="Masuk"
            onPress={onMasuk}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

export type { LandingScreenProps };
