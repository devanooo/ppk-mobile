import { Pressable, ScrollView, Text } from 'react-native';

type FilterChipsProps = {
  opsi: { nilai: string; label: string }[];
  terpilih: string;
  onPilih: (nilai: string) => void;
  className?: string;
  accessibilityLabel?: string;
};

/**
 * Deretan chip filter yang dapat digulir horizontal. Dipakai untuk status dan
 * kategori pengajuan izin. Target sentuh 44dp, status terpilih dibaca pembaca
 * layar lewat `accessibilityState`.
 */
export function FilterChips({
  opsi,
  terpilih,
  onPilih,
  className = '',
  accessibilityLabel,
}: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel={accessibilityLabel}
      contentContainerClassName={`gap-two ${className}`}
    >
      {opsi.map((item) => {
        const aktif = item.nilai === terpilih;

        return (
          <Pressable
            key={item.nilai}
            accessibilityLabel={item.label}
            accessibilityRole="button"
            accessibilityState={{ selected: aktif }}
            onPress={() => onPilih(item.nilai)}
            className={`min-h-touch justify-center rounded-pill px-three active:scale-95 ${
              aktif ? 'bg-primary' : 'border border-primary bg-transparent'
            }`}
          >
            <Text className={`text-small ${aktif ? 'text-primaryText' : 'text-primary'}`}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export type { FilterChipsProps };
