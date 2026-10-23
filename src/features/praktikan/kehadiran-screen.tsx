import type { ReactNode } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Card, EmptyState, Screen, teksKosong } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { formatJam } from '@/store/session-logic';
import type { Sesi } from '@/types';

import { labelJadwal, rentangJam } from './format-sesi';

type RiwayatKehadiran = { sesi: Sesi; waktu: string };

type KehadiranScreenProps = {
  riwayat: RiwayatKehadiran[];
  namaPraktikan?: string;
  profil?: ReactNode;
};

export function KehadiranScreen({ riwayat, namaPraktikan, profil }: KehadiranScreenProps) {
  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center" style={{ maxWidth: MaxContentWidth }}>
        <FlatList
          data={riwayat}
          keyExtractor={(item) => `${item.sesi.id}-${item.waktu}`}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <JudulKehadiran
              jumlah={riwayat.length}
              namaPraktikan={namaPraktikan}
              profil={profil}
            />
          }
          ListEmptyComponent={
            <EmptyState
              judul={teksKosong.riwayat.judul}
              deskripsi={teksKosong.riwayat.deskripsi}
            />
          }
          renderItem={({ item }) => <KartuKehadiran item={item} />}
        />
      </View>
    </Screen>
  );
}

function JudulKehadiran({
  jumlah,
  namaPraktikan,
  profil,
}: {
  jumlah: number;
  namaPraktikan?: string;
  profil?: ReactNode;
}) {
  return (
    <View className="flex-row items-start justify-between gap-three pt-three">
      <View className="flex-1">
        {namaPraktikan ? (
          <Text className="text-small text-textSecondary">Halo, {namaPraktikan}</Text>
        ) : null}
        <Text
          accessibilityRole="header"
          className={`text-title font-semibold text-text ${namaPraktikan ? 'mt-one' : ''}`}
        >
          Kehadiran
        </Text>
        <Text className="mt-one text-small text-textSecondary">
          {jumlah > 0 ? `${jumlah} catatan kehadiran` : 'Catatan presensi kamu.'}
        </Text>
      </View>
      {profil}
    </View>
  );
}

function KartuKehadiran({ item }: { item: RiwayatKehadiran }) {
  return (
    <Card>
      <Text className="text-subtitle font-semibold text-text">{item.sesi.namaPraktikum}</Text>

      <View className="mt-three flex-row flex-wrap items-center justify-between gap-two">
        <Text className="text-body text-text">{labelJadwal(item.sesi)}</Text>
        <Text className="ml-auto shrink-0 text-body font-semibold text-text">
          {rentangJam(item.sesi)}
        </Text>
      </View>

      <Text className="mt-one text-small text-textSecondary">
        Hadir pukul {formatJam(item.waktu)}
      </Text>
    </Card>
  );
}

export type { KehadiranScreenProps, RiwayatKehadiran };
