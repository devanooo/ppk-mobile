import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton, Banner, Card, Screen, TextField } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import type { LabTerpilih } from '@/features/maps/pemilihan-lab';
import { useTheme } from '@/hooks/use-theme';

import { HeaderAsisten } from './header-asisten';
import type { UmpanBalik } from './umpan-balik';

type TambahKelasScreenProps = {
  banner: UmpanBalik | null;
  labTerpilih: LabTerpilih | null;
  labelLab: string;
  menyimpan: boolean;
  onBatal: () => void;
  onPilihDiMaps: () => void;
  onSimpan: (nama: string) => Promise<void>;
  onTutupBanner: () => void;
};

export function TambahKelasScreen({
  banner,
  labTerpilih,
  labelLab,
  menyimpan,
  onBatal,
  onPilihDiMaps,
  onSimpan,
  onTutupBanner,
}: TambahKelasScreenProps) {
  const tema = useTheme();
  const [nama, setNama] = useState('');

  const alasanSimpanNonaktif = !nama.trim()
    ? 'Isi nama kelas.'
    : !labTerpilih
      ? 'Pilih laboratorium di Maps.'
      : undefined;

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <HeaderAsisten />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-three pb-five pt-two"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              accessibilityLabel="Kembali ke kelas"
              accessibilityRole="button"
              disabled={menyimpan}
              onPress={onBatal}
              className="min-h-touch flex-row items-center gap-one active:opacity-60"
            >
              <SymbolView
                name={{
                  ios: 'chevron.left',
                  android: 'arrow_back',
                  web: 'arrow_back',
                }}
                size={18}
                tintColor={tema.textSecondary}
              />
              <Text className="text-small text-textSecondary">
                Kembali ke kelas
              </Text>
            </Pressable>

            <Text
              accessibilityRole="header"
              className="mt-two text-title font-semibold text-text"
            >
              Tambah Kelas
            </Text>

            {banner ? (
              <Banner
                className="mt-four"
                jenis={banner.jenis}
                pesan={banner.pesan}
                onTutup={onTutupBanner}
              />
            ) : null}

            <View className="mt-four">
              <TextField
                autoCapitalize="words"
                inputTone="muted"
                label="Nama Kelas"
                onChangeText={setNama}
                placeholder="Contoh: Informatika D1"
                value={nama}
              />
            </View>

            <View className="mt-four">
              <Text className="mb-two text-small font-medium text-text">
                Laboratorium
              </Text>

              <Card tone="muted">
                <View className="flex-row items-center justify-between gap-two">
                  <Text className="flex-1 text-body font-semibold text-text">
                    {labelLab}
                  </Text>

                  <Pressable
                    accessibilityLabel="Pilih laboratorium di Maps"
                    accessibilityRole="button"
                    disabled={menyimpan}
                    onPress={onPilihDiMaps}
                    className="min-h-touch items-center justify-center rounded-pill border border-border bg-backgroundElement px-three active:opacity-60"
                  >
                    <Text className="text-small font-medium text-text">
                      Pilih di Maps
                    </Text>
                  </Pressable>
                </View>

                {labTerpilih ? (
                  <View className="mt-three border-t border-border pt-three">
                    <Text className="text-small text-textSecondary">
                      Koordinat: {labTerpilih.latitude.toFixed(6)},{' '}
                      {labTerpilih.longitude.toFixed(6)}
                    </Text>
                    <Text className="mt-one text-small text-textSecondary">
                      Radius: {labTerpilih.radiusMeters} meter
                    </Text>
                  </View>
                ) : null}
              </Card>
            </View>

            <View className="mt-five flex-row gap-two">
              <View className="flex-1">
                <AppButton
                  disabled={menyimpan}
                  fullWidth
                  label="Batal"
                  onPress={onBatal}
                  size="sm"
                  variant="secondary"
                />
              </View>

              <View className="flex-1">
                <AppButton
                  disabled={menyimpan || Boolean(alasanSimpanNonaktif)}
                  disabledReason={alasanSimpanNonaktif}
                  fullWidth
                  label="Simpan Kelas"
                  loading={menyimpan}
                  onPress={() => {
                    void onSimpan(nama);
                  }}
                  size="sm"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Screen>
  );
}