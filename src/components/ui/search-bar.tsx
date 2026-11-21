import { SymbolView } from 'expo-symbols';
import { Pressable, TextInput, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

type SearchBarProps = {
  nilai: string;
  onUbah: (nilai: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  className?: string;
};

/**
 * Kolom pencarian dengan ikon dan tombol hapus. Dipakai untuk mencari peserta
 * praktikum. Tinggi mengikuti target sentuh 44dp dan memakai token permukaan.
 */
export function SearchBar({
  nilai,
  onUbah,
  placeholder = 'Cari',
  accessibilityLabel,
  className = '',
}: SearchBarProps) {
  const skema = useColorScheme();
  const palet = skema === 'dark' ? Colors.dark : Colors.light;

  return (
    <View
      className={`min-h-touch flex-row items-center gap-two rounded-pill border border-border bg-backgroundElement px-three ${className}`}
    >
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search' }}
        size={18}
        tintColor={palet.textSecondary}
      />

      <TextInput
        accessibilityLabel={accessibilityLabel ?? placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 py-two text-body text-text"
        onChangeText={onUbah}
        placeholder={placeholder}
        placeholderTextColor={palet.textSecondary}
        returnKeyType="search"
        value={nilai}
      />

      {nilai ? (
        <Pressable
          accessibilityLabel="Hapus pencarian"
          accessibilityRole="button"
          onPress={() => onUbah('')}
          className="h-touch w-touch items-center justify-center active:opacity-60"
        >
          <SymbolView
            name={{ ios: 'xmark.circle.fill', android: 'cancel' }}
            size={18}
            tintColor={palet.textSecondary}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

export type { SearchBarProps };
