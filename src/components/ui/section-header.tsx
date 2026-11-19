import { Pressable, Text, View } from 'react-native';

type SectionHeaderProps = {
  judul: string;
  aksi?: { label: string; onPress: () => void };
  className?: string;
};

/** Judul bagian dengan aksi opsional, mis. "Semua" atau "Lihat semua". */
export function SectionHeader({
  judul,
  aksi,
  className = '',
}: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between gap-three ${className}`}>
      <Text
        accessibilityRole="header"
        className="flex-1 text-subtitle font-semibold text-text"
      >
        {judul}
      </Text>

      {aksi ? (
        <Pressable
          accessibilityLabel={aksi.label}
          accessibilityRole="button"
          onPress={aksi.onPress}
          className="min-h-touch justify-center px-two active:opacity-60"
        >
          <Text className="text-body text-primary">{aksi.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export type { SectionHeaderProps };
