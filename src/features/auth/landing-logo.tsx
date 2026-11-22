import { Image } from 'expo-image';
import { View } from 'react-native';

/**
 * File logo punya margin transparan bawaan sekitar 20% di tiap sisi, jadi
 * gambarnya diperbesar melewati batas badge dan dipotong agar mark-nya
 * memenuhi kotak. Tanpa ini logo tampak kecil di dalam badge.
 */
export function LandingLogo() {
  return (
    <View className="h-touch w-touch items-center justify-center self-center overflow-hidden rounded-authCard bg-loginBackground">
      <Image
        accessibilityLabel="Logo PraktikumKU"
        contentFit="contain"
        source={require('@/assets/images/Logo-PraktikumKU.png')}
        style={{ height: '150%', width: '150%' }}
      />
    </View>
  );
}
