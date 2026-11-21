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
  jamValid,
  maskJam,
} from './format-edit-sesi';

type FieldJamProps = {
  label: string;
  /** Jam `HH:MM` 24 jam, atau kosong bila belum lengkap. */
  nilai: string;
  onChange: (jam: string) => void;
  /** Membuka pemilih jam di komponen induk. */
  onBuka: () => void;
  /** Menandai pemilih jam sedang terbuka. */
  aktif: boolean;
  error?: string;
  disabled?: boolean;
};

export function FieldJam({
  label,
  nilai,
  onChange,
  onBuka,
  aktif,
  error,
  disabled = false,
}: FieldJamProps) {
  const tema = useTheme();
  const [teks, setTeks] = useState(nilai);
  const [fokus, setFokus] = useState(false);

  const garis = error
    ? 'border border-danger'
    : aktif || fokus
      ? 'border border-primary'
      : 'border-0';

  const pesanGalat =
    error && teks.length > 0 && !nilai
      ? 'Gunakan format 24 jam, mis. 08:00.'
      : error;

  function ubahTeks(masukan: string) {
    const bermasker = maskJam(masukan);

    setTeks(bermasker);
    onChange(jamValid(bermasker) ? bermasker : '');
  }

  return (
    <View>
      <Text className="mb-two text-small font-medium text-text">{label}</Text>

      {Platform.OS === 'web' ? (
        <View>
          <TextInput
            accessibilityLabel={label}
            accessibilityHint={pesanGalat ?? 'Gunakan format 24 jam, mis. 08:00'}
            autoComplete="off"
            inputMode="numeric"
            maxLength={5}
            onBlur={() => setFokus(false)}
            onChangeText={ubahTeks}
            onFocus={() => setFokus(true)}
            placeholder="Pilih waktu"
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
                ios: 'clock',
                android: 'schedule',
                web: 'schedule',
              }}
              size={20}
              tintColor={tema.textSecondary}
            />
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityLabel={`${label}, ${nilai || 'belum diisi'}`}
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
            {nilai || 'Pilih waktu'}
          </Text>

          <SymbolView
            name={{
              ios: 'clock',
              android: 'schedule',
              web: 'schedule',
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
