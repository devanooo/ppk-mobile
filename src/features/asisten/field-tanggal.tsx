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

import { keTanggal } from '@/features/praktikan/format-sesi';
import { useTheme } from '@/hooks/use-theme';

import {
  dariInputTanggal,
  hariDariTanggal,
  keInputTanggal,
  maskTanggal,
  tanggalPanjang,
} from './format-edit-sesi';

type FieldTanggalProps = {
  /** Tanggal ISO lokal `YYYY-MM-DD`, atau kosong bila belum lengkap. */
  nilai: string;
  onChange: (tanggal: string) => void;
  error?: string;
  disabled?: boolean;
};

export function FieldTanggal({
  nilai,
  onChange,
  error,
  disabled = false,
}: FieldTanggalProps) {
  const tema = useTheme();
  const [teks, setTeks] = useState(keInputTanggal(nilai));
  const [pemilih, setPemilih] = useState(false);

  const hari = hariDariTanggal(nilai);

  function ubahTeks(masukan: string) {
    const bermasker = maskTanggal(masukan);

    setTeks(bermasker);
    onChange(dariInputTanggal(bermasker) ?? '');
  }

  return (
    <View>
      <Text className="mb-two text-caption text-textSecondary">
        Tanggal Praktikum
      </Text>

      {Platform.OS === 'web' ? (
        <TextInput
          accessibilityLabel="Tanggal praktikum"
          accessibilityHint={error ?? 'Gunakan format hari/bulan/tahun'}
          autoComplete="off"
          inputMode="numeric"
          maxLength={10}
          onChangeText={ubahTeks}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={tema.textSecondary}
          value={teks}
          className={`min-h-field rounded-md border bg-backgroundElement px-twoHalf text-body text-text ${
            error ? 'border-danger' : 'border-border'
          }`}
        />
      ) : (
        <Pressable
          accessibilityLabel={`Tanggal praktikum, ${
            nilai ? tanggalPanjang(nilai) : 'belum dipilih'
          }`}
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

      {error ? (
        <Text accessibilityRole="alert" className="mt-one text-caption text-danger">
          {error}
        </Text>
      ) : hari ? (
        <Text className="mt-one text-caption text-textSecondary">{hari}</Text>
      ) : null}

      {pemilih && Platform.OS !== 'web' ? (
        <View className="mt-two">
          <DateTimePicker
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            mode="date"
            onChange={(peristiwa, waktu) => {
              if (Platform.OS !== 'ios') setPemilih(false);

              if (peristiwa.type === 'set' && waktu) {
                const tahun = waktu.getFullYear();
                const bulan = String(waktu.getMonth() + 1).padStart(2, '0');
                const hariTerpilih = String(waktu.getDate()).padStart(2, '0');

                onChange(`${tahun}-${bulan}-${hariTerpilih}`);
              }
            }}
            value={keTanggal(nilai) ?? new Date()}
          />

          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityLabel="Tutup pemilih tanggal"
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
