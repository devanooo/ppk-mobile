import { ScrollView, Text, View } from 'react-native';

import { Card, EmptyState, HomeButton, Screen, StatusBadge } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { formatJam } from '@/store/session-logic';
import type { Sesi } from '@/types';

import { labelJadwal, rentangJam } from './format-sesi';

type DetailSesiScreenProps = { sesi: Sesi | null; namaAsisten?: string; onKembali: () => void };

export function DetailSesiScreen({ sesi, namaAsisten, onKembali }: DetailSesiScreenProps) {
  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
        <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
          <View className="pt-two">
            <HomeButton onPress={onKembali} />
          </View>

          {sesi ? (
            <DetailSesi namaAsisten={namaAsisten} sesi={sesi} />
          ) : (
            <EmptyState
              judul="Sesi tidak ditemukan"
              deskripsi="Jadwal sesi ini mungkin sudah berubah."
            />
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function DetailSesi({ sesi, namaAsisten }: { sesi: Sesi; namaAsisten?: string }) {
  return (
    <View className="pt-three">
      <View className="flex-row items-start justify-between gap-two">
        <Text
          accessibilityRole="header"
          className="flex-1 text-title font-semibold text-text"
        >
          {sesi.namaPraktikum}
        </Text>
        <StatusBadge status={sesi.status} />
      </View>

      <Text className="mt-one text-small text-textSecondary">Kelas {sesi.kelas} · {sesi.lab}</Text>

      <Card className="mt-four">
        <BarisInfo label="Jadwal" nilai={labelJadwal(sesi)} />
        <BarisInfo garis label="Waktu" nilai={rentangJam(sesi)} />
        {namaAsisten ? <BarisInfo garis label="Asisten" nilai={namaAsisten} /> : null}
        {sesi.dibukaPada ? (
          <BarisInfo garis label="Dibuka" nilai={`pukul ${formatJam(sesi.dibukaPada)}`} />
        ) : null}
        {sesi.ditutupPada ? (
          <BarisInfo garis label="Ditutup" nilai={`pukul ${formatJam(sesi.ditutupPada)}`} />
        ) : null}
      </Card>
    </View>
  );
}

function BarisInfo({ label, nilai, garis = false }: { label: string; nilai: string; garis?: boolean }) {
  return (
    <View
      className={`flex-row items-start justify-between gap-three py-two ${
        garis ? 'border-t border-border' : ''
      }`}
    >
      <Text className="text-small text-textSecondary">{label}</Text>
      <Text className="flex-1 text-right text-body text-text">{nilai}</Text>
    </View>
  );
}

export type { DetailSesiScreenProps };
