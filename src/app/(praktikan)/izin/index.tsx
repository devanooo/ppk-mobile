import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

import { AppButton, Banner, Card, EmptyState, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { KartuIzin } from '@/features/izin/kartu-izin';
import { urutkanIzin } from '@/features/izin/format-izin';
import { useIzinPraktikan } from '@/features/izin/use-izin-praktikan';
import { useSesiPraktikan } from '@/features/izin/use-sesi-praktikan';
import { ambilDbSementara } from '@/lib/db-sementara';
import { useSession } from '@/store/session-store';

/**
 * TODO(p1): ganti `ambilDbSementara()` dengan `db` dari `@/lib/firebase`
 * begitu T-016 merge, lalu hapus `src/lib/db-sementara.ts`.
 */
const db = ambilDbSementara();

export default function IzinPraktikanScreen() {
  const { user } = useSession();
  const router = useRouter();

  const praktikanId = user?.id;
  const { sesi, status: statusSesi, pesanGalat: galatSesi } = useSesiPraktikan(db, praktikanId);
  const sesiIds = useMemo(() => sesi.map((item) => item.id), [sesi]);
  const { izin, status, pesanGalat } = useIzinPraktikan(db, praktikanId, sesiIds);

  const daftar = useMemo(() => urutkanIzin(izin), [izin]);
  const sesiById = useMemo(
    () => new Map(sesi.map((item) => [item.id, item])),
    [sesi],
  );

  if (!user) {
    return null;
  }

  const galat = statusSesi === 'gagal' ? (galatSesi ?? 'Data sesi gagal dimuat') : pesanGalat;

  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center" style={{ maxWidth: MaxContentWidth }}>
        <FlatList
          contentContainerClassName="px-three pb-five"
          data={daftar}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View className="flex-row items-start justify-between gap-three pt-three">
                <View className="flex-1">
                  <Text className="text-small text-textSecondary">Halo, {user.nama}</Text>
                  <Text
                    accessibilityRole="header"
                    className="mt-one text-title font-semibold text-text"
                  >
                    Izin
                  </Text>
                  <Text className="mt-one text-small text-textSecondary">
                    {daftar.length > 0
                      ? `${daftar.length} pengajuan izin`
                      : 'Pengajuan izin dan keputusannya akan muncul di sini.'}
                  </Text>
                </View>
                <MenuProfilPraktikan />
              </View>

              <AppButton
                className="mt-four"
                label="Ajukan izin"
                onPress={() => router.push('/(praktikan)/izin/ajukan')}
              />

              {galat ? (
                <Banner className="mt-three" jenis="gagal" pesan={galat} />
              ) : null}

              {status === 'memuat' || statusSesi === 'memuat' ? (
                <Text className="mt-four text-small text-textSecondary">Memuat pengajuan izin...</Text>
              ) : null}
            </>
          }
          ListEmptyComponent={
            status === 'memuat' || statusSesi === 'memuat' ? undefined : (
              <Card className="mt-four">
                <EmptyState
                  judul="Belum ada pengajuan izin"
                  deskripsi="Pengajuan izin yang kamu kirim akan tercatat di sini."
                />
              </Card>
            )
          }
          ItemSeparatorComponent={() => <View className="h-twoHalf" />}
          renderItem={({ item }) => (
            <KartuIzin
              izin={item}
              sesi={sesiById.get(item.sesiId)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
