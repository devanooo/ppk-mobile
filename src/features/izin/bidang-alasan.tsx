import { Text, TextInput, View, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { PANJANG_ALASAN, validasiAlasan } from '@/lib/izin-aturan';

type BidangAlasanProps = {
  nilai: string;
  onChange: (nilai: string) => void;
  /** Diisi hanya setelah pengguna mencoba mengirim, bukan saat mengetik. */
  tampilkanGalat?: boolean;
  className?: string;
};

/**
 * TextField bersama tidak punya multiline, penghitung karakter, atau state
 * error, dan `src/components/ui/**` beku untuk P2. Input ini memakai token yang
 * sama supaya tampilannya tetap seragam.
 */
export function BidangAlasan({
  nilai,
  onChange,
  tampilkanGalat = false,
  className = '',
}: BidangAlasanProps) {
  const skema = useColorScheme();
  const warnaSekunder = (skema === 'dark' ? Colors.dark : Colors.light).textSecondary;
  const hasil = validasiAlasan(nilai);
  const galat = tampilkanGalat && !hasil.ok ? hasil.pesan : undefined;
  const sisa = PANJANG_ALASAN.maksimum - nilai.length;

  return (
    <View className={className}>
      <Text className="mb-two text-caption text-textSecondary">Alasan izin</Text>

      <TextInput
        accessibilityLabel="Alasan izin"
        accessibilityHint={`Isi ${PANJANG_ALASAN.minimum} sampai ${PANJANG_ALASAN.maksimum} karakter`}
        multiline
        maxLength={PANJANG_ALASAN.maksimum}
        onChangeText={onChange}
        placeholder="Tulis alasan ketidakhadiranmu"
        placeholderTextColor={warnaSekunder}
        textAlignVertical="top"
        value={nilai}
        className={`min-h-six rounded-md border bg-backgroundElement px-twoHalf py-two text-body text-text ${
          galat ? 'border-danger' : 'border-border'
        }`}
      />

      <View className="mt-two flex-row items-start justify-between gap-two">
        <View className="flex-1">
          {galat ? (
            <Text className="text-caption text-danger">{galat}</Text>
          ) : (
            <Text className="text-caption text-textSecondary">
              Minimal {PANJANG_ALASAN.minimum} karakter.
            </Text>
          )}
        </View>

        <Text className="shrink-0 text-caption text-textSecondary">
          {nilai.length}/{PANJANG_ALASAN.maksimum}
          {sisa === 0 ? ' (batas tercapai)' : ''}
        </Text>
      </View>
    </View>
  );
}
