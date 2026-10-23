import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { FlatList, Text, View } from 'react-native';

import { Card, EmptyState, Screen, StatusBadge, teksKosong } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Sesi } from '@/types';

import { labelJadwal, rentangJam, urutkanSesi } from './format-sesi';

type JadwalScreenProps = {
  sesi: Sesi[];
  namaPraktikan?: string;
  onBukaSesi: (sesiId: string) => void;
  profil?: ReactNode;
};

export function JadwalScreen({ sesi, namaPraktikan, onBukaSesi, profil }: JadwalScreenProps) {
  const theme = useTheme();
  const jadwal = urutkanSesi(sesi);

  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center" style={{ maxWidth: MaxContentWidth }}>
        <FlatList
          data={jadwal}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <JudulJadwal jumlah={jadwal.length} namaPraktikan={namaPraktikan} profil={profil} />
          }
          ListEmptyComponent={
            <EmptyState
              ikon={
                <SymbolView
                  name={{ ios: 'calendar', android: 'calendar_today' }}
                  size={32}
                  tintColor={theme.textSecondary}
                />
              }
              judul={teksKosong.jadwal.judul}
              deskripsi={teksKosong.jadwal.deskripsi}
            />
          }
          renderItem={({ item }) => (
            <KartuJadwal onPress={() => onBukaSesi(item.id)} sesi={item} />
          )}
        />
      </View>
    </Screen>
  );
}

function JudulJadwal({
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
          Jadwal
        </Text>
        {jumlah > 0 ? (
          <Text className="mt-one text-small text-textSecondary">{jumlah} sesi praktikum</Text>
        ) : null}
      </View>
      {profil}
    </View>
  );
}

function KartuJadwal({ sesi, onPress }: { sesi: Sesi; onPress: () => void }) {
  return (
    <Card
      accessibilityLabel={`Buka detail ${sesi.namaPraktikum}, ${labelStatus(sesi.status)}, ${labelJadwal(sesi)}, pukul ${rentangJam(sesi)}, kelas ${sesi.kelas}, ${sesi.lab}`}
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between gap-two">
        <Text className="flex-1 text-subtitle font-semibold text-text">{sesi.namaPraktikum}</Text>
        <StatusBadge className="shrink-0" status={sesi.status} />
      </View>

      <Text className="mt-one text-small text-textSecondary">
        Kelas {sesi.kelas} · {sesi.lab}
      </Text>

      <View className="mt-three flex-row flex-wrap items-center justify-between gap-two">
        <Text className="text-body text-text">{labelJadwal(sesi)}</Text>
        <Text className="ml-auto shrink-0 text-body font-semibold text-text">
          {rentangJam(sesi)}
        </Text>
      </View>
    </Card>
  );
}

function labelStatus(status: Sesi['status']): string {
  if (status === 'belum-dibuka') return 'Belum dibuka';
  if (status === 'dibuka') return 'Dibuka';
  return 'Ditutup';
}

export type { JadwalScreenProps };
