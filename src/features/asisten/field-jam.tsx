import DateTimePicker from '@react-native-community/datetimepicker';
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
  dariTanggalJam,
  jamValid,
  keTanggalJam,
  maskJam,
} from './format-edit-sesi';

type FieldJamProps = {
  label: string;
  /** Jam `HH:MM` 24 jam, atau kosong bila belum lengkap. */
  nilai: string;
  onChange: (jam: string) => void;
  error?: string;
  disabled?: boolean;
};

export function FieldJam({
  label,
  nilai,
  onChange,
  error,
  disabled = false,
}: FieldJamProps) {
  const tema = useTheme();
  const [teks, setTeks] = useState(nilai);
  const [pemilih, setPemilih] = useState(false);

  function ubahTeks(masukan: string) {
    const bermasker = maskJam(masukan);

    setTeks(bermasker);
    onChange(jamValid(bermasker) ? bermasker : '');
  }

  return (
    <View>
      <Text className="mb-two text-caption text-textSecondary">{label}</Text>

      {Platform.OS === 'web' ? (
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={error ?? 'Gunakan format 24 jam, mis. 08:00'}
          autoComplete="off"
          inputMode="numeric"
          maxLength={5}
          onChangeText={ubahTeks}
          placeholder="Pilih waktu"
          placeholderTextColor={tema.textSecondary}
          value={teks}
          className={`min-h-field rounded-md border bg-backgroundElement px-twoHalf text-body text-text ${
            error ? 'border-danger' : 'border-border'
          }`}
        />
      ) : (
        <Pressable
          accessibilityLabel={`${label}, ${nilai || 'belum diisi'}`}
          accessibilityRole="button"
          disabled={disabled}
          onPress={() => setPemilih((terbuka) => !terbuka)}
          className={`min-h-field flex-row items-center justify-between gap-two rounded-md border bg-backgroundElement px-twoHalf ${
            error ? 'border-danger' : 'border-border'
          } ${disabled ? 'opacity-40' : ''}`}
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

      {error ? (
        <Text accessibilityRole="alert" className="mt-one text-caption text-danger">
          {error}
        </Text>
      ) : null}

      {pemilih && Platform.OS !== 'web' ? (
        <View className="mt-two">
          <DateTimePicker
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour
            mode="time"
            onChange={(peristiwa, waktu) => {
              if (Platform.OS !== 'ios') setPemilih(false);

              if (peristiwa.type === 'set' && waktu) {
                onChange(dariTanggalJam(waktu));
              }
            }}
            value={keTanggalJam(nilai)}
          />

          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityLabel={`Tutup pemilih ${label.toLowerCase()}`}
              accessibilityRole="button"
              onPress={() => setPemilih(false)}
              className="min-h-touch items-end justify-center active:opacity-60"
            >
              <Text className="text-body text-primary">Selesai</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
