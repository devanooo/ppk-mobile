import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  IconButton,
  Screen,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSesiAsisten } from '@/features/asisten/use-sesi-asisten';
import { formatTanggal } from '@/features/praktikan/format-sesi';
import { useTheme } from '@/hooks/use-theme';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function RekapKelasScreen() {
  const { kelasId } = useLocalSearchParams<{ kelasId: string }>();
  const { user } = useSession();
  const theme = useTheme();

  const { sesi, status, pesanGalat } = useSesiAsisten(
    db,
    user?.peran === 'asisten' ? user.id : undefined,
  );

  const daftar = useMemo(
    () =>
      sesi
        .filter((item) => item.kelasId === kelasId)
        .sort((a, b) =>
          `${b.tanggal}T${b.jamMulai}`.localeCompare(
            `${a.tanggal}T${a.jamMulai}`,
          ),
        ),
    [sesi, kelasId],
  );

  const info = daftar[0];

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={daftar}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="pt-three">
              <View className="flex-row items-center justify-between gap-two">
                <IconButton
                  ikon={
                    <SymbolView
                      name={{ ios: 'arrow.left', android: 'arrow_back' }}
                      size={20}
                      tintColor={theme.primary}
                    />
                  }
                  label="Kembali ke daftar kelas"
                  onPress={() => router.back()}
                  variant="filled"
                />

                <MenuProfilAsisten />
              </View>

              <Text
                accessibilityRole="header"
                className="mt-four text-title font-bold text-text"
              >
                {info?.namaKelas ?? 'Sesi kelas'}
              </Text>

              <Text className="mt-two text-small text-textSecondary">
                {info?.lab ?? 'Pilih sesi untuk melihat kehadiran.'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            status === 'memuat' ? (
              <EmptyState
                judul="Memuat sesi"
                deskripsi="Sedang mengambil data sesi kelas ini."
              />
            ) : status === 'gagal' ? (
              <EmptyState
                judul="Sesi gagal dimuat"
                deskripsi={pesanGalat ?? 'Periksa koneksi lalu coba lagi.'}
              />
            ) : (
              <EmptyState
                judul="Belum ada sesi"
                deskripsi="Sesi untuk kelas ini akan muncul di sini."
              />
            )
          }
          renderItem={({ item }) => (
            <Card
              accessibilityLabel={`Buka ringkasan kehadiran ${item.namaKelas}, ${formatTanggal(item.tanggal)}`}
              onPress={() =>
                router.push({
                  pathname: '/(asisten)/rekap/sesi/[sesiId]',
                  params: { sesiId: item.id },
                })
              }
              tone="muted"
            >
              <View className="flex-row items-start justify-between gap-two">
                <View className="flex-1">
                  <Text className="text-body font-bold text-text">
                    {item.hari}, {formatTanggal(item.tanggal)}
                  </Text>

                  <Text className="mt-one text-small text-textSecondary">
                    {item.jamMulai}–{item.jamSelesai}
                  </Text>
                </View>

                <StatusBadge className="shrink-0" status={item.status} />
              </View>

              <Text className="mt-two text-small text-textSecondary">
                {item.pesertaIds.length} peserta terdaftar
              </Text>
            </Card>
          )}
        />
      </View>
    </Screen>
  );
}
