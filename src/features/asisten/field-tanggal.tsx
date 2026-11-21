import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import {
  dariInputTanggal,
  keInputTanggal,
  maskTanggal,
  tanggalPanjang,
} from './format-edit-sesi';

type FieldTanggalProps = {
  /** Tanggal ISO lokal `YYYY-MM-DD`, atau kosong bila belum lengkap. */
  nilai: string;
  onChange: (tanggal: string) => void;
  /** Membuka pemilih tanggal di komponen induk. */
  onBuka: () => void;
  /** Menandai pemilih tanggal sedang terbuka. */
  aktif: boolean;
  error?: string;
  disabled?: boolean;
};

export function FieldTanggal({
  nilai,
  onChange,
  onBuka,
  aktif,
  error,
  disabled = false,
}: FieldTanggalProps) {
  const tema = useTheme();
  const [teks, setTeks] = useState(keInputTanggal(nilai));
  const [fokus, setFokus] = useState(false);

  const garis = error
    ? 'border border-danger'
    : aktif || fokus
      ? 'border border-primary'
      : 'border-0';

  const pesanGalat =
    error && teks.length > 0 && !nilai ? 'Tanggal tidak valid.' : error;

  function ubahTeks(masukan: string) {
    const bermasker = maskTanggal(masukan);

    setTeks(bermasker);
    onChange(dariInputTanggal(bermasker) ?? '');
  }

  return (
    <View>
      <Text className="mb-two text-small font-medium text-text">
        Tanggal Praktikum
      </Text>

      {Platform.OS === 'web' ? (
        <View>
          <TextInput
            accessibilityLabel="Tanggal praktikum"
            accessibilityHint={pesanGalat ?? 'Gunakan format hari/bulan/tahun'}
            autoComplete="off"
            inputMode="numeric"
            maxLength={10}
            onBlur={() => setFokus(false)}
            onChangeText={ubahTeks}
            onFocus={() => setFokus(true)}
            placeholder="Pilih tanggal praktikum"
            placeholderTextColor={tema.textSecondary}
            value={teks}
            className={`min-h-field rounded-md bg-background pl-twoHalf pr-five text-body text-text ${garis}`}
          />

          <View
            pointerEvents="none"
            className="absolute inset-y-0 right-twoHalf items-center justify-center"
          >
            <SymbolView
              name={{
                ios: 'calendar',
                android: 'calendar_today',
                web: 'calendar_today',
              }}
              size={20}
              tintColor={tema.textSecondary}
            />
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityLabel={`Tanggal praktikum, ${
            nilai ? tanggalPanjang(nilai) : 'belum dipilih'
          }`}
          accessibilityRole="button"
          accessibilityState={{ disabled, expanded: aktif }}
          disabled={disabled}
          onPress={onBuka}
          className={`min-h-field flex-row items-center justify-between gap-two rounded-md bg-background px-twoHalf ${garis} ${
            disabled ? 'opacity-40' : ''
          }`}
        >
          <Text
            className={
              nilai
                ? 'flex-1 text-body text-text'
                : 'flex-1 text-body text-textSecondary'
            }
          >
            {nilai ? tanggalPanjang(nilai) : 'Pilih tanggal praktikum'}
          </Text>

          <SymbolView
            name={{
              ios: 'calendar',
              android: 'calendar_today',
              web: 'calendar_today',
            }}
            size={20}
            tintColor={tema.textSecondary}
          />
        </Pressable>
      )}

      {pesanGalat ? (
        <Text accessibilityRole="alert" className="mt-one text-caption text-danger">
          {pesanGalat}
        </Text>
      ) : null}
    </View>
  );
}
