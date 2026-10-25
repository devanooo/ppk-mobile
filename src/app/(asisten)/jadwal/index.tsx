import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  Screen,
  StatusBadge,
  teksKosong,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import {
  labelJadwal,
  rentangJam,
  urutkanSesi,
} from '@/features/praktikan/format-sesi';
import { useSession } from '@/store/session-store';
import type { Sesi } from '@/types';

export default function JadwalAsistenScreen() {
  const { user, sesiUntuk } = useSession();

  const jadwal = useMemo(() => {
    if (!user || user.peran !== 'asisten') {
      return [];
    }

    return urutkanSesi(sesiUntuk(user));
  }, [user, sesiUntuk]);

  const namaAsisten = user?.nama?.trim() || 'Asisten';

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={jadwal}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="flex-row items-start justify-between gap-three pt-three">
              <View className="flex-1">
                <Text className="text-small text-textSecondary">
                  Halo, {namaAsisten}
                </Text>

                <Text
                  accessibilityRole="header"
                  className="mt-one text-title font-semibold text-text"
                >
                  Jadwal
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  {jadwal.length > 0
                    ? `${jadwal.length} sesi praktikum`
                    : 'Lihat sesi praktikum yang menjadi tanggung jawabmu.'}
                </Text>
              </View>

              {user ? <MenuProfilAsisten /> : null}
            </View>
          }
          ListEmptyComponent={
           <EmptyState
              judul={
                user?.peran === 'asisten'
                ? teksKosong.jadwal.judul
                : 'Akun asisten belum aktif'
              }
              deskripsi={
                user?.peran === 'asisten'
                  ? teksKosong.jadwal.deskripsi
                  : 'Gunakan akun asisten untuk melihat jadwal.'
              }
            />
          }
          renderItem={({ item }) => <KartuJadwal sesi={item} />}
        />
      </View>
    </Screen>
  );
}

function KartuJadwal({ sesi }: { sesi: Sesi }) {
  return (
    <Card
      onPress={() =>
        router.push({
          pathname: '/(asisten)/jadwal/[id]',
          params: { id: sesi.id },
        })
      }
      accessibilityLabel={`Buka detail ${sesi.namaPraktikum}, ${labelStatus(sesi.status)}, ${labelJadwal(sesi)}, pukul ${rentangJam(sesi)}, kelas ${sesi.kelas}, ${sesi.lab}`}
    >
      <View className="flex-row items-start justify-between gap-two">
        <Text className="flex-1 text-subtitle font-semibold text-text">
          {sesi.namaPraktikum}
        </Text>

        <StatusBadge className="shrink-0" status={sesi.status} />
      </View>

      <Text className="mt-one text-small text-textSecondary">
        Kelas {sesi.kelas} · {sesi.lab}
      </Text>

      <View className="mt-three flex-row flex-wrap items-center justify-between gap-two">
        <Text className="text-body text-text">
          {labelJadwal(sesi)}
        </Text>

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
