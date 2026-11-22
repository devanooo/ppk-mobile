import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

import { LandingHero } from './landing-hero';
import { LandingLogo } from './landing-logo';

const INK = Colors.light.loginInk;
const MID = Colors.light.landingMid;
const AKSEN = Colors.light.landingAccent;
const PUTIH = Colors.light.loginBackground;

type LandingScreenProps = {
  onMasuk: () => void;
  onDaftar: () => void;
};

export function LandingScreen({ onMasuk, onDaftar }: LandingScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-landingCanvas">
      <ScrollView contentContainerClassName="grow" showsVerticalScrollIndicator={false}>
        <View className="bg-landingCanvas" style={{ paddingTop: insets.top + Spacing.three }}>
          <LandingLogo />
          <LandingHero className="mt-four" />
        </View>

        <View
          className="flex-1 rounded-t-xl bg-landingSurface px-four pt-five"
          style={{ paddingBottom: insets.bottom + Spacing.five }}
        >
          <View className="w-full self-center" style={{ maxWidth: MaxContentWidth }}>
            <Text
              accessibilityRole="header"
              className="text-center text-display font-bold"
              style={{ color: INK }}
            >
              Praktikum
              <Text style={{ color: AKSEN }}>KU</Text>
            </Text>

            <Text className="mt-two text-center text-body" style={{ color: MID }}>
              Lebih dari Sekadar Praktikum, Ini Tentang Perjalanan dan Dedikasi
            </Text>

            <Pressable
              accessibilityLabel="Masuk ke akun PraktikumKU"
              accessibilityRole="button"
              className="mt-five min-h-button w-full flex-row items-center justify-center rounded-pill bg-loginInk px-four active:scale-95"
              onPress={onMasuk}
            >
              <Text className="text-authButton font-semibold" style={{ color: PUTIH }}>
                Masuk
              </Text>
              <View className="absolute right-four">
                <SymbolView
                  name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                  size={20}
                  tintColor={PUTIH}
                />
              </View>
            </Pressable>

            <Pressable
              accessibilityLabel="Daftar akun PraktikumKU"
              accessibilityRole="button"
              className="mt-two min-h-button w-full flex-row items-center justify-center rounded-pill border bg-landingSurface px-four active:scale-95"
              onPress={onDaftar}
              style={{ borderColor: INK }}
            >
              <Text className="text-authButton font-semibold" style={{ color: INK }}>
                Daftar
              </Text>
              <View className="absolute right-four">
                <SymbolView
                  name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
                  size={20}
                  tintColor={INK}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export type { LandingScreenProps };
