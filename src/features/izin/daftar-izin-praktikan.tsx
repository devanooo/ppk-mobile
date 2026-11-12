import type { ReactNode } from 'react';
import { FlatList, Text, View } from 'react-native';

import { AppButton, Banner, Card, EmptyState, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { KartuIzin } from '@/features/izin/kartu-izin';
import type { Izin } from '@/features/izin/types';
import type { SesiPraktikan } from '@/lib/izin-sesi';

export type StatusDaftar = 'memuat' | 'siap' | 'gagal';

type DaftarIzinPraktikanProps = {
  namaPraktikan: string;
  daftarIzin: Izin[];
  sesiById: Map<string, SesiPraktikan>;
  /** Digabung dari status sesi dan status izin oleh pemanggil. */
  status: StatusDaftar;
  pesanGalat?: string;
  onAjukan: () => void;
  profil?: ReactNode;
};

function pesanBantuan(jumlah: number, status: StatusDaftar): string {
  if (jumlah > 0) return `${jumlah} pengajuan izin`;

  return status === 'gagal'
    ? 'Tidak dapat memuat daftar izin.'
    : 'Pengajuan izin dan keputusannya akan muncul di sini.';
}

export function DaftarIzinPraktikan({
  namaPraktikan,
  daftarIzin,
  sesiById,
  status,
  pesanGalat,
  onAjukan,
  profil,
}: DaftarIzinPraktikanProps) {
  const sedangMemuat = status === 'memuat';
  const gagal = status === 'gagal';

  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center" style={{ maxWidth: MaxContentWidth }}>
        <FlatList
          contentContainerClassName="px-three pb-five"
          data={daftarIzin}
          // ID dokumen izin = uid praktikan, jadi tidak unik lintas sesi.
          keyExtractor={(item) => `${item.sesiId}:${item.id}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View className="flex-row items-start justify-between gap-three pt-three">
                <View className="flex-1">
                  <Text className="text-small text-textSecondary">Halo, {namaPraktikan}</Text>
                  <Text
                    accessibilityRole="header"
                    className="mt-one text-title font-semibold text-text"
                  >
                    Izin
                  </Text>
                  <Text className="mt-one text-small text-textSecondary">
                    {pesanBantuan(daftarIzin.length, status)}
                  </Text>
                </View>
                {profil}
              </View>

              <AppButton className="mt-four" label="Ajukan izin" onPress={onAjukan} />

              {pesanGalat ? (
                <Banner className="mt-three" jenis="gagal" pesan={pesanGalat} />
              ) : null}

              {sedangMemuat ? (
                <Text className="mt-four text-small text-textSecondary">
                  Memuat pengajuan izin...
                </Text>
              ) : null}
            </>
          }
          ListEmptyComponent={
            sedangMemuat ? undefined : (
              <Card className="mt-four">
                <EmptyState
                  judul={gagal ? 'Daftar izin gagal dimuat' : 'Belum ada pengajuan izin'}
                  deskripsi={
                    gagal
                      ? (pesanGalat ?? 'Coba muat ulang halaman ini.')
                      : 'Pengajuan izin yang kamu kirim akan tercatat di sini.'
                  }
                />
              </Card>
            )
          }
          ItemSeparatorComponent={() => <View className="h-twoHalf" />}
          renderItem={({ item }) => <KartuIzin izin={item} sesi={sesiById.get(item.sesiId)} />}
        />
      </View>
    </Screen>
  );
}
