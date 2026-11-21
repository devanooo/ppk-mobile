import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import { AppHeader, Card, EmptyState, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import { useSesiAsisten } from '@/features/asisten/use-sesi-asisten';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function RekapIndexScreen() {
  const { user } = useSession();
  const asistenId = user?.peran === 'asisten' ? user.id : undefined;

  const { kelas, status, pesanGalat } = useKelasAsisten(db, asistenId);
  const { sesi } = useSesiAsisten(db, asistenId);

  const jumlahSesi = useMemo(() => {
    const peta = new Map<string, number>();

    for (const item of sesi) {
      peta.set(item.kelasId, (peta.get(item.kelasId) ?? 0) + 1);
    }

    return peta;
  }, [sesi]);

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={kelas}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="pt-three">
              <AppHeader aksi={<MenuProfilAsisten />} peran="asisten" />

              <Text
                accessibilityRole="header"
                className="mt-four text-title font-bold text-text"
              >
                Rekap
              </Text>

              <Text className="mt-two text-small text-textSecondary">
                Pilih kelas untuk melihat ringkasan kehadiran.
              </Text>
            </View>
          }
          ListEmptyComponent={
            status === 'memuat' ? (
              <EmptyState
                judul="Memuat kelas"
                deskripsi="Sedang mengambil data kelas."
              />
            ) : status === 'gagal' ? (
              <EmptyState
                judul="Kelas gagal dimuat"
                deskripsi={pesanGalat ?? 'Periksa koneksi lalu coba lagi.'}
              />
            ) : (
              <EmptyState
                judul="Belum ada kelas"
                deskripsi="Kelas yang kamu ampu akan muncul di sini."
              />
            )
          }
          renderItem={({ item }) => (
            <Card
              accessibilityLabel={`Buka rekap kelas ${item.nama}, ${item.lab}`}
              onPress={() =>
                router.push({
                  pathname: '/(asisten)/rekap/kelas/[kelasId]',
                  params: { kelasId: item.id },
                })
              }
              tone="muted"
            >
              <Text className="text-body font-bold text-text">{item.nama}</Text>

              <Text className="mt-one text-small text-textSecondary">
                {item.lab}
              </Text>

              <Text className="mt-two text-small text-textSecondary">
                {jumlahSesi.get(item.id) ?? 0} sesi · {item.pesertaIds.length}{' '}
                peserta
              </Text>
            </Card>
          )}
        />
      </View>
    </Screen>
  );
}
