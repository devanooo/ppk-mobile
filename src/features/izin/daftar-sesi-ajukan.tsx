import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Card, EmptyState, IconButton, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { SesiPraktikan } from '@/lib/izin-sesi';

import { PemilihSesi } from './pemilih-sesi';
import type { StatusMuat } from './use-sesi-praktikan';

type DaftarSesiAjukanProps = {
  daftarSesi: SesiPraktikan[];
  status: StatusMuat;
  pesanGalat?: string;
  onPilihSesi: (sesiId: string) => void;
  onKembali: () => void;
  profil?: ReactNode;
};

export function DaftarSesiAjukan({
  daftarSesi,
  status,
  pesanGalat,
  onPilihSesi,
  onKembali,
  profil,
}: DaftarSesiAjukanProps) {
  const theme = useTheme();

  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
        <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
          <View className="flex-row items-center justify-between gap-two pt-two">
            <IconButton
              ikon={
                <SymbolView
                  name={{
                    ios: 'arrow.left',
                    android: 'arrow_back',
                    web: 'arrow_back',
                  }}
                  size={20}
                  tintColor={theme.primary}
                />
              }
              label="Kembali"
              onPress={onKembali}
              variant="filled"
            />
            {profil}
          </View>

          <Text accessibilityRole="header" className="mt-three text-title font-semibold text-text">
            Ajukan izin
          </Text>
          <Text className="mt-one text-small text-textSecondary">
            Pilih sesi yang ingin diajukan izinnya.
          </Text>

          {daftarSesi.length > 0 ? (
            <PemilihSesi className="mt-four" daftarSesi={daftarSesi} onPilih={onPilihSesi} />
          ) : (
            <Card className="mt-four">
              {status === 'memuat' ? (
                <EmptyState judul="Memuat sesi..." deskripsi="Daftar sesi sedang diambil." />
              ) : status === 'gagal' ? (
                <EmptyState
                  judul="Sesi gagal dimuat"
                  deskripsi={pesanGalat ?? 'Tidak dapat memuat daftar sesi.'}
                />
              ) : (
                <EmptyState
                  judul="Belum ada sesi"
                  deskripsi="Izin hanya dapat diajukan untuk sesi dari kelas yang kamu ikuti."
                />
              )}
            </Card>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
