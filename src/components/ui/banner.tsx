import { Pressable, Text, View } from 'react-native';

const JENIS = {
  sukses: { label: 'Berhasil', wadah: 'bg-successSurface' },
  gagal: { label: 'Gagal', wadah: 'bg-dangerSurface' },
} as const;

type BannerProps = {
  jenis: 'sukses' | 'gagal';
  pesan: string;
  onTutup?: () => void;
  className?: string;
};

export function Banner({ jenis, pesan, onTutup, className = '' }: BannerProps) {
  const gaya = JENIS[jenis];

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className={`flex-row items-start rounded-md px-three py-twoHalf ${gaya.wadah} ${className}`}
    >
      <View className="flex-1">
        <Text className="text-caption font-semibold text-text">{gaya.label}</Text>
        <Text className="mt-half text-small text-text">{pesan}</Text>
      </View>

      {onTutup ? (
        <Pressable
          accessibilityLabel="Tutup pemberitahuan"
          accessibilityRole="button"
          onPress={onTutup}
          className="ml-two min-h-touch min-w-touch items-center justify-center active:scale-95"
        >
          <Text className="text-small text-textSecondary">Tutup</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export type { BannerProps };
