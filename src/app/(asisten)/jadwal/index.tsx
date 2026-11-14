import { router } from 'expo-router';
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
  useSesiAsisten,
  type SesiAsisten,
} from '@/features/asisten/use-sesi-asisten';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

export default function JadwalAsistenScreen() {
  const { user } = useSession();

  const hasil = useSesiAsisten(
    db,
    user?.peran === 'asisten' ? user.id : undefined,
  );

  const namaAsisten = user?.nama?.trim() || 'Asisten';

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={hasil.sesi}
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
                  {hasil.status === 'siap'
                    ? `${hasil.sesi.length} sesi praktikum`
                    : 'Memuat jadwal praktikum...'}
                </Text>
              </View>

              {user?.peran === 'asisten' ? (
                <MenuProfilAsisten />
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <View className="pt-three">
              {hasil.status === 'memuat' ? (
                <EmptyState
                  judul="Memuat jadwal"
                  deskripsi="Sedang mengambil data jadwal dari Firebase."
                />
              ) : hasil.status === 'gagal' ? (
                <EmptyState
                  judul="Jadwal gagal dimuat"
                  deskripsi={hasil.pesanGalat ?? 'Terjadi kesalahan saat mengambil jadwal.'}
                />
              ) : user?.peran !== 'asisten' ? (
                <EmptyState
                  judul="Akun asisten belum aktif"
                  deskripsi="Gunakan akun asisten untuk melihat jadwal."
                />
              ) : (
                <EmptyState
                  judul={teksKosong.jadwal.judul}
                  deskripsi={teksKosong.jadwal.deskripsi}
                />
              )}
            </View>
          }
          renderItem={({ item }) => (
            <KartuJadwal sesi={item} />
          )}
        />
      </View>
    </Screen>
  );
}

function KartuJadwal({ sesi }: { sesi: SesiAsisten }) {
  return (
    <Card
      onPress={() =>
        router.push({
          pathname: '/(asisten)/jadwal/[id]',
          params: { id: sesi.id },
        })
      }
      accessibilityLabel={`Buka detail sesi ${sesi.namaKelas}, status ${labelStatus(sesi.status)}, ${sesi.hari}, kelas ${sesi.namaKelas}, ${sesi.lab}`}
    >
      <View className="flex-row items-start justify-between gap-two">
        <Text className="flex-1 text-subtitle font-semibold text-text">
          {sesi.namaKelas}
        </Text>

        <StatusBadge
          className="shrink-0"
          status={sesi.status}
        />
      </View>

      <Text className="mt-one text-small text-textSecondary">
        Kelas {sesi.namaKelas} · {sesi.lab}
      </Text>

      <View className="mt-three flex-row flex-wrap items-center justify-between gap-two">
        <Text className="text-body text-text">
          {formatTanggal(sesi.hari, sesi.tanggal)}
        </Text>

        <Text className="ml-auto shrink-0 text-body font-semibold text-text">
          {sesi.jamMulai} - {sesi.jamSelesai}
        </Text>
      </View>
    </Card>
  );
}

function labelStatus(status: SesiAsisten['status']): string {
  if (status === 'belum-dibuka') return 'Belum dibuka';
  if (status === 'dibuka') return 'Dibuka';
  return 'Ditutup';
}

function formatTanggal(hari: string, tanggal: string): string {
  const [tahun, bulan, tanggalHari] = tanggal.split('-').map(Number);

  const tanggalObj = new Date(tahun, bulan - 1, tanggalHari);

  const tanggalFormat = tanggalObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `${hari}, ${tanggalFormat}`;
}
