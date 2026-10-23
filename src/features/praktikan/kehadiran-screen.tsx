import type { ReactNode } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Card, EmptyState, Screen, teksKosong } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { formatJam } from '@/store/session-logic';
import type { Sesi } from '@/types';

import { labelJadwal, rentangJam } from './format-sesi';

type RiwayatKehadiran = { sesi: Sesi; waktu: string };

type KehadiranScreenProps = { riwayat: RiwayatKehadiran[]; profil?: ReactNode };

export function KehadiranScreen({ riwayat, profil }: KehadiranScreenProps) {
  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center" style={{ maxWidth: MaxContentWidth }}>
        <FlatList
          data={riwayat}
          keyExtractor={(item) => `${item.sesi.id}-${item.waktu}`}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="flex-row items-start justify-between gap-three pt-three">
              <View className="flex-1">
                <Text accessibilityRole="header" className="text-title font-semibold text-text">
                  Kehadiran
                </Text>
                <Text className="mt-one text-small text-textSecondary">Catatan presensi kamu.</Text>
              </View>
              {profil}
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              judul={teksKosong.riwayat.judul}
              deskripsi={teksKosong.riwayat.deskripsi}
            />
          }
          renderItem={({ item }) => (
            <Card>
              <Text className="text-body font-semibold text-text">{item.sesi.namaPraktikum}</Text>
              <Text className="mt-one text-small text-textSecondary">
                {labelJadwal(item.sesi)} · {rentangJam(item.sesi)}
              </Text>
              <Text className="mt-two text-small text-text">
                Hadir pukul {formatJam(item.waktu)}
              </Text>
            </Card>
          )}
        />
      </View>
    </Screen>
  );
}

export type { KehadiranScreenProps, RiwayatKehadiran };
