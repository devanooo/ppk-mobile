import type { ReactNode } from 'react';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  BottomSheet,
  Card,
  EmptyState,
  Screen,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useRuangBawahKonten } from '@/hooks/use-tab-bar-layout';
import type { HasilAksi, Kelas } from '@/lib/kelas';

import type { UmpanBalik } from './umpan-balik';

type KelasAsistenScreenProps = {
  namaAsisten: string;
  kelas: Kelas[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  profil?: ReactNode;
  banner?: UmpanBalik | null;
  onTutupBanner: () => void;
  onBukaTambah: () => void;
  onHapus: (kelas: Kelas) => Promise<HasilAksi>;
  onEdit: (kelas: Kelas) => void;
  onKelolaPeserta: (kelas: Kelas) => void;
  onKelolaSesi: (kelas: Kelas) => void;
  menghapus: boolean;
};

const JUMLAH_AWAL = 2;

export function KelasAsistenScreen({
  namaAsisten,
  kelas,
  status,
  pesanGalat,
  profil,
  banner,
  onTutupBanner,
  onBukaTambah,
  onHapus,
  onEdit,
  onKelolaPeserta,
  onKelolaSesi,
  menghapus,
}: KelasAsistenScreenProps) {
  const ruangBawah = useRuangBawahKonten();
  const [tampilSemua, setTampilSemua] = useState(false);
  const [kelasAkanDihapus, setKelasAkanDihapus] = useState<Kelas | null>(null);

  const kelasTampil = tampilSemua ? kelas : kelas.slice(0, JUMLAH_AWAL);
  const sisaKelas = Math.max(0, kelas.length - JUMLAH_AWAL);

  async function prosesHapus() {
    if (!kelasAkanDihapus || menghapus) return;

    await onHapus(kelasAkanDihapus);
    setKelasAkanDihapus(null);
  }

  return (
    <Screen edges={['top', 'left', 'right']} padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={kelasTampil}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-twoHalf px-three"
          contentContainerStyle={{ paddingBottom: ruangBawah }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-three pt-three">
              <View className="flex-row items-start justify-between gap-three">
                <View className="flex-1">
                  <Text className="text-small text-textSecondary">
                    Halo, {namaAsisten}
                  </Text>

                  <Text
                    accessibilityRole="header"
                    className="mt-one text-title font-semibold text-primary"
                  >
                    Kelas
                  </Text>

                  <Text className="mt-one text-small text-textSecondary">
                    {kelas.length} kelas yang kamu ampu
                  </Text>
                </View>

                {profil}
              </View>

              {banner ? (
                <Banner
                  jenis={banner.jenis}
                  pesan={banner.pesan}
                  onTutup={onTutupBanner}
                />
              ) : null}

              <AppButton
                accessibilityLabel="Tambah kelas baru"
                fullWidth
                label="+ Tambah Kelas"
                onPress={onBukaTambah}
              />
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              deskripsi={
                hasilPesanKosong(status, pesanGalat) ??
                'Kelas yang kamu ampu akan muncul di sini.'
              }
              judul={hasilJudulKosong(status)}
            />
          }
          ListFooterComponent={
            sisaKelas > 0 && !tampilSemua ? (
              <Pressable
                accessibilityLabel={`Lihat ${sisaKelas} kelas lainnya`}
                accessibilityRole="button"
                onPress={() => setTampilSemua(true)}
                className="min-h-touch items-center justify-center px-three active:opacity-60"
              >
                <Text className="text-small font-semibold text-primary">
                  Lihat {sisaKelas} kelas lainnya
                </Text>
              </Pressable>
            ) : undefined
          }
          renderItem={({ item }) => (
            <KartuKelas
              kelas={item}
              menghapus={menghapus}
              onEdit={() => onEdit(item)}
              onHapus={() => setKelasAkanDihapus(item)}
              onKelolaPeserta={() => onKelolaPeserta(item)}
              onKelolaSesi={() => onKelolaSesi(item)}
            />
          )}
        />

        <BottomSheet
          bahaya
          deskripsi={
            kelasAkanDihapus
              ? `Apakah kamu yakin ingin menghapus kelas ${kelasAkanDihapus.nama}? Kelas yang sudah memiliki sesi tidak dapat dihapus.`
              : ''
          }
          judul="Hapus Kelas?"
          labelBatal="Batal"
          labelKonfirmasi={menghapus ? 'Menghapus...' : 'Hapus'}
          onClose={() => {
            if (!menghapus) setKelasAkanDihapus(null);
          }}
          onKonfirmasi={() => {
            void prosesHapus();
          }}
          visible={kelasAkanDihapus !== null}
        />
      </View>
    </Screen>
  );
}

function KartuKelas({
  kelas,
  menghapus,
  onEdit,
  onHapus,
  onKelolaPeserta,
  onKelolaSesi,
}: {
  kelas: Kelas;
  menghapus: boolean;
  onEdit: () => void;
  onHapus: () => void;
  onKelolaPeserta: () => void;
  onKelolaSesi: () => void;
}) {
  return (
    <Card tone="muted">
      <Text className="text-subtitle font-semibold text-text">
        {kelas.nama}
      </Text>

      <Text className="mt-one text-small text-textSecondary">
        {kelas.lab} · {kelas.pesertaIds.length} peserta
      </Text>

      <View className="mt-three flex-row gap-two">
        <AppButton
          className="flex-1"
          label="Kelola Peserta"
          onPress={onKelolaPeserta}
          size="sm"
          variant="secondary"
        />

        <AppButton
          className="flex-1"
          label="Kelola Sesi"
          onPress={onKelolaSesi}
          size="sm"
          variant="secondary"
        />
      </View>

      <View className="mt-two flex-row items-center justify-between">
        <Pressable
          accessibilityLabel={`Edit kelas ${kelas.nama}`}
          accessibilityRole="button"
          onPress={onEdit}
          className="min-h-touch justify-center pr-three active:opacity-60"
        >
          <Text className="text-small font-medium text-primary">
            Edit Kelas
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel={`Hapus kelas ${kelas.nama}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: menghapus }}
          disabled={menghapus}
          onPress={onHapus}
          className={`min-h-touch justify-center pl-three ${
            menghapus ? 'opacity-40' : 'active:opacity-60'
          }`}
        >
          <Text className="text-small font-semibold text-danger">
            {menghapus ? 'Menghapus...' : 'Hapus Kelas'}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

function hasilJudulKosong(status: 'memuat' | 'siap' | 'gagal'): string {
  if (status === 'memuat') return 'Memuat kelas...';
  if (status === 'gagal') return 'Data kelas belum tersedia';
  return 'Belum ada kelas';
}

function hasilPesanKosong(
  status: 'memuat' | 'siap' | 'gagal',
  pesanGalat?: string,
): string | undefined {
  if (status === 'gagal') return pesanGalat;

  if (status === 'memuat') {
    return 'Sedang mengambil data kelas.';
  }

  return undefined;
}

export type { KelasAsistenScreenProps };