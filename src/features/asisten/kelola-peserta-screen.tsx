import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  AppButton,
  Banner,
  Card,
  EmptyState,
  Screen,
  SearchBar,
  BottomSheet,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { HeaderAsisten } from '@/features/asisten/header-asisten';
import { useTheme } from '@/hooks/use-theme';
import type { HasilAksi, Kelas } from '@/lib/kelas';

import { AvatarInisial } from './avatar-inisial';
import { ModalTambahPeserta } from './modal-tambah-peserta';
import type { Praktikan } from './use-praktikan';
import type { UmpanBalik } from './umpan-balik';

type KelolaPesertaScreenProps = {
  kelas: Kelas;
  peserta: Praktikan[];
  kandidat: Praktikan[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  banner?: UmpanBalik | null;
  menghapusId: string | null;
  onTutupBanner: () => void;
  onKembali: () => void;
  onTambah: (ids: string[]) => Promise<HasilAksi>;
  onHapus: (praktikan: Praktikan) => Promise<HasilAksi>;
};

export function KelolaPesertaScreen({
  kelas,
  peserta,
  kandidat,
  status,
  pesanGalat,
  banner,
  menghapusId,
  onTutupBanner,
  onKembali,
  onTambah,
  onHapus,
}: KelolaPesertaScreenProps) {
  const tema = useTheme();
  const [cari, setCari] = useState('');
  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [pesertaAkanDihapus, setPesertaAkanDihapus] =
  useState<Praktikan | null>(null);

  const pesertaTersaring = useMemo(() => {
    const kunci = cari.trim().toLowerCase();

    if (!kunci) return peserta;

    return peserta.filter(
      (praktikan) =>
        praktikan.nama.toLowerCase().includes(kunci) ||
        praktikan.nomorInduk.includes(kunci),
    );
  }, [cari, peserta]);

  async function konfirmasiHapus() {
    if (!pesertaAkanDihapus || menghapusId !== null) return;

    await onHapus(pesertaAkanDihapus);
    setPesertaAkanDihapus(null);
  }
  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <HeaderAsisten />

        <FlatList
          contentContainerClassName="gap-two px-three pb-five"
          data={pesertaTersaring}
          ItemSeparatorComponent={Pemisah}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="gap-three pt-two">
              <Pressable
                accessibilityLabel="Kembali ke kelas"
                accessibilityRole="button"
                onPress={onKembali}
                className="min-h-touch flex-row items-center gap-one active:opacity-60"
              >
                <SymbolView
                  name={{
                    ios: 'chevron.left',
                    android: 'arrow_back',
                    web: 'arrow_back',
                  }}
                  size={18}
                  tintColor={tema.textSecondary}
                />

                <Text className="text-small text-textSecondary">
                  Kembali ke kelas
                </Text>
              </Pressable>

              <View>
                <Text
                  accessibilityRole="header"
                  className="text-title font-semibold text-text"
                >
                  Kelola Peserta
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  {kelas.nama}
                </Text>
              </View>

              <Card tone="muted">
                <Text className="text-caption text-textSecondary">Kelas</Text>

                <Text className="mt-one text-body font-semibold text-text">
                  {kelas.nama}
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  {kelas.lab}
                </Text>
              </Card>

              {banner ? (
                <Banner
                  jenis={banner.jenis}
                  pesan={banner.pesan}
                  onTutup={onTutupBanner}
                />
              ) : null}

              <AppButton
                disabled={status !== 'siap'}
                disabledReason={
                  status === 'memuat'
                    ? 'Daftar mahasiswa sedang dimuat.'
                    : status === 'gagal'
                      ? 'Daftar mahasiswa gagal dimuat.'
                      : undefined
                }
                fullWidth
                label="+ Tambah Peserta"
                onPress={() => setModalTerbuka(true)}
              />

              <SearchBar
                accessibilityLabel="Cari peserta kelas"
                onUbah={setCari}
                placeholder="Cari nama atau NIM"
                nilai={cari}
              />

              <View className="flex-row items-center justify-between gap-two">
                <Text
                  accessibilityRole="header"
                  className="text-subtitle font-semibold text-text"
                >
                  Daftar Peserta
                </Text>

                <Text className="text-small text-textSecondary">
                  {peserta.length} peserta
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              className="pt-four"
              deskripsi={pesanKosong(status, peserta.length, cari, pesanGalat)}
              judul={judulKosong(status, peserta.length, cari)}
              tone={status === 'gagal' ? 'gagal' : 'kosong'}
            />
          }
          renderItem={({ item }) => (
            <View className="flex-row items-center gap-three py-three">
              <AvatarInisial nama={item.nama} />

              <View className="flex-1">
                <Text className="text-body font-medium text-text">
                  {item.nama}
                </Text>

                <Text className="text-small text-textSecondary">
                  {item.nomorInduk}
                </Text>
              </View>

              <Pressable
                accessibilityLabel={`Hapus ${item.nama} dari kelas`}
                accessibilityRole="button"
                accessibilityState={{
                  busy: menghapusId === item.id,
                  disabled: menghapusId !== null,
                }}
                disabled={menghapusId !== null}
                onPress={() => setPesertaAkanDihapus(item)}
                className="h-touch w-touch items-center justify-center rounded-pill active:opacity-60"
              >
                {menghapusId === item.id ? (
                  <ActivityIndicator color={tema.danger} size="small" />
                ) : (
                  <SymbolView
                    name={{
                      ios: 'trash',
                      android: 'delete_outline',
                      web: 'delete_outline',
                    }}
                    size={20}
                    tintColor={tema.danger}
                  />
                )}
              </Pressable>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />

        <BottomSheet
          bahaya
          deskripsi={
            pesertaAkanDihapus
              ? `Keluarkan ${pesertaAkanDihapus.nama} dari kelas ${kelas.nama}?`
              : ''
          }
          judul="Hapus Peserta?"
          labelBatal="Batal"
          labelKonfirmasi={menghapusId !== null ? 'Menghapus...' : 'Hapus'}
          onClose={() => {
            if (menghapusId === null) setPesertaAkanDihapus(null);
          }}
          onKonfirmasi={() => {
            void konfirmasiHapus();
          }}
          visible={pesertaAkanDihapus !== null}
        />

        <ModalTambahPeserta
          kandidat={kandidat}
          onSimpan={onTambah}
          onTutup={() => setModalTerbuka(false)}
          pesanGalat={pesanGalat}
          status={status}
          visible={modalTerbuka}
        />
      </View>
    </Screen>
  );
}

function Pemisah() {
  return <View className="h-half bg-border" />;
}

function judulKosong(
  status: 'memuat' | 'siap' | 'gagal',
  jumlahPeserta: number,
  cari: string,
): string {
  if (status === 'memuat') return 'Memuat peserta...';
  if (status === 'gagal') return 'Daftar peserta belum tersedia';
  if (jumlahPeserta === 0) return 'Belum ada peserta';
  if (cari.trim()) return 'Tidak ada peserta yang cocok';
  return 'Belum ada peserta';
}

function pesanKosong(
  status: 'memuat' | 'siap' | 'gagal',
  jumlahPeserta: number,
  cari: string,
  pesanGalat?: string,
): string | undefined {
  if (status === 'memuat') {
    return 'Sedang mengambil daftar mahasiswa.';
  }

  if (status === 'gagal') {
    return pesanGalat ?? 'Terjadi kesalahan saat memuat daftar mahasiswa.';
  }

  if (jumlahPeserta === 0) {
    return 'Tambahkan mahasiswa lewat tombol Tambah Peserta.';
  }

  if (cari.trim()) {
    return 'Coba kata kunci lain.';
  }

  return undefined;
}

export type { KelolaPesertaScreenProps };
