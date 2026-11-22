import { Text, View } from 'react-native';

// TODO(logo): ganti placeholder dengan aset resmi PraktikumKU saat tersedia.
export function LandingLogo() {
  return (
    <View className="h-touch w-touch items-center justify-center self-center rounded-authCard bg-loginBackground">
      <Text accessibilityElementsHidden className="text-subtitle font-bold text-loginInk">
        P
      </Text>
    </View>
  );
}
