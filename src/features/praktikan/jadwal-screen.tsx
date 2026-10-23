import { SymbolView } from 'expo-symbols';
import { FlatList, Text, View } from 'react-native';

import { Card, EmptyState, Screen, StatusBadge, teksKosong } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Sesi } from '@/types';

import { labelJadwal, rentangJam, urutkanSesi } from './format-sesi';

type JadwalScreenProps = { sesi: Sesi[]; onBukaSesi: (sesiId: string) => void };

export function JadwalScreen({ sesi, onBukaSesi }: JadwalScreenProps) {
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
          ListHeaderComponent={<JudulJadwal jumlah={jadwal.length} />}
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

function JudulJadwal({ jumlah }: { jumlah: number }) {
  return (
    <View className="pt-three">
      <Text accessibilityRole="header" className="text-title font-semibold text-text">
        Jadwal
      </Text>
      <Text className="mt-one text-small text-textSecondary">
        {jumlah > 0 ? `${jumlah} sesi praktikum` : 'Sesi praktikum yang kamu ikuti.'}
      </Text>
    </View>
  );
}

function KartuJadwal({ sesi, onPress }: { sesi: Sesi; onPress: () => void }) {
  return (
    <Card
      accessibilityLabel={`Buka detail ${sesi.namaPraktikum}, ${labelJadwal(sesi)}, pukul ${rentangJam(sesi)}`}
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between gap-two">
        <Text className="flex-1 text-subtitle font-semibold text-text">{sesi.namaPraktikum}</Text>
        <StatusBadge status={sesi.status} />
      </View>

      <Text className="mt-one text-small text-textSecondary">Kelas {sesi.kelas} · {sesi.lab}</Text>

      <View className="mt-three border-t border-border pt-three">
        <Text className="text-body text-text">{labelJadwal(sesi)}</Text>
        <Text className="mt-one text-small text-textSecondary">{rentangJam(sesi)}</Text>
      </View>
    </Card>
  );
}

export type { JadwalScreenProps };
