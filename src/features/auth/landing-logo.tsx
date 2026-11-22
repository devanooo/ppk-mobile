import { Image } from 'expo-image';
import { View } from 'react-native';

/**
 * Mark pada file logo hanya menempati sekitar 56% lebar kanvas karena ada
 * margin transparan bawaan, jadi gambarnya diperbesar sedikit agar terlihat
 * wajar di dalam badge tanpa menembus tepi.
 */
export function LandingLogo() {
  return (
    <View className="h-touch w-touch items-center justify-center self-center overflow-hidden rounded-authCard bg-loginBackground">
      <Image
        accessibilityLabel="Logo PraktikumKU"
        contentFit="contain"
        source={require('@/assets/images/logo-praktikumku.png')}
        style={{ height: '110%', width: '110%' }}
      />
    </View>
  );
}
