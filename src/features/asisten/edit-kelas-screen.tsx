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
import { HeaderAsisten } from '@/features/asisten/header-asisten';
import type { LabTerpilih } from '@/features/maps/pemilihan-lab';
import { useTheme } from '@/hooks/use-theme';
import type { HasilAksi, Kelas } from '@/lib/kelas';

import type { UmpanBalik } from './umpan-balik';

type EditKelasScreenProps = {
  kelas: Kelas;
  labAwal: LabTerpilih | null;
  labTerpilih: LabTerpilih | null;
  statusLaboratorium: 'memuat' | 'siap' | 'gagal';
  pesanGalatLaboratorium?: string;
  banner?: UmpanBalik | null;
  menyimpan: boolean;
  onTutupBanner: () => void;
  onPilihDiMaps: () => void;
  onBatal: () => void;
  onSimpan: (nama: string) => Promise<HasilAksi>;
};

export function EditKelasScreen({
  kelas,
  labAwal,
  labTerpilih,
  statusLaboratorium,
  pesanGalatLaboratorium,
  banner,
  menyimpan,
  onTutupBanner,
  onPilihDiMaps,
  onBatal,
  onSimpan,
}: EditKelasScreenProps) {
  const tema = useTheme();
  const [nama, setNama] = useState(kelas.nama);

  const labTampil = labTerpilih ?? labAwal;
  const namaLab = labTerpilih?.nama ?? kelas.lab;
  const koordinat = teksKoordinat(
    labTampil,
    statusLaboratorium,
    pesanGalatLaboratorium,
  );
  const radius = teksRadius(
    labTampil,
    statusLaboratorium,
    pesanGalatLaboratorium,
  );

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
              Edit Kelas
            </Text>

            <Text className="mt-one text-small text-textSecondary">
              Perbarui nama dan laboratorium kelas.
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
                    {namaLab}
                  </Text>

                  <Pressable
                    accessibilityLabel="Pilih laboratorium di Maps"
                    accessibilityRole="button"
                    accessibilityState={{ disabled: menyimpan }}
                    disabled={menyimpan}
                    onPress={onPilihDiMaps}
                    className="min-h-touch flex-row items-center justify-center rounded-pill border border-border bg-backgroundElement px-three active:opacity-60"
                  >
                    <Text className="text-small font-medium text-text">
                      Pilih di Maps
                    </Text>
                  </Pressable>
                </View>

                <View className="mt-three border-t border-border pt-three">
                  <Text className="text-small text-textSecondary">
                    Koordinat: {koordinat}
                  </Text>

                  <Text className="mt-one text-small text-textSecondary">
                    Radius: {radius}
                  </Text>
                </View>

                <Text className="mt-two text-caption text-textSecondary">
                  {labTerpilih
                    ? 'Pilihan baru disimpan saat kamu menekan Simpan Perubahan.'
                    : 'Pilih di Maps untuk mengganti laboratorium kelas.'}
                </Text>
              </Card>
            </View>

            <View className="mt-five flex-row gap-two">
              <View className="w-24">
                <AppButton
                  disabled={menyimpan}
                  label="Batal"
                  onPress={onBatal}
                  size="sm"
                  variant="secondary"
                />
              </View>

              <View className="flex-1">
                <AppButton
                  disabled={menyimpan || !nama.trim()}
                  disabledReason="Nama kelas wajib diisi."
                  label="Simpan Perubahan"
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

function teksKoordinat(
  lab: LabTerpilih | null,
  status: 'memuat' | 'siap' | 'gagal',
  pesanGalat?: string,
): string {
  if (lab) {
    return `${lab.latitude.toFixed(6)}, ${lab.longitude.toFixed(6)}`;
  }

  if (status === 'memuat') return 'Memuat konfigurasi laboratorium...';

  if (status === 'gagal') {
    return pesanGalat ?? 'Konfigurasi laboratorium gagal dimuat.';
  }

  return 'Belum tersedia';
}

function teksRadius(
  lab: LabTerpilih | null,
  status: 'memuat' | 'siap' | 'gagal',
  pesanGalat?: string,
): string {
  if (lab) return `${lab.radiusMeters} meter`;

  if (status === 'memuat') return 'Memuat...';

  if (status === 'gagal') {
    return pesanGalat ?? 'Gagal dimuat';
  }

  return 'Belum tersedia';
}

export type { EditKelasScreenProps };
