import { Pressable, Text } from 'react-native';

type HomeButtonProps = {
  onPress: () => void;
};

export function HomeButton({ onPress }: HomeButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Kembali ke beranda"
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-touch flex-row items-center pl-one pr-two active:scale-95"
    >
      <Text className="text-body text-primary">‹</Text>
      <Text className="ml-one text-body text-primary">Beranda</Text>
    </Pressable>
  );
}

export type { HomeButtonProps };
