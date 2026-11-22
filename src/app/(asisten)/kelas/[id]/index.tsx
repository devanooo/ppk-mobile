import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';

import {
  Banner,
  Card,
  EmptyState,
  Screen,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { HeaderAsisten } from '@/features/asisten/header-asisten';
import { KartuSesi } from '@/features/asisten/kartu-sesi';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import {
  useSesiAsisten,
  type SesiAsisten,
} from '@/features/asisten/use-sesi-asisten';
import { useTheme } from '@/hooks/use-theme';
import { db } from '@/lib/firebase';
import { hapusSesi } from '@/lib/sesi';
import { useSession } from '@/store/session-store';

export default function KelolaSesiRoute() {
  const { id, pesan: pesanParam, jenis: jenisParam } = useLocalSearchParams<{
    id: string;
    pesan?: string;
    jenis?: 'sukses' | 'gagal';
  }>();
  const kelasId = Array.isArray(id) ? id[0] : id;
  const pesanAwal = Array.isArray(pesanParam) ? pesanParam[0] : pesanParam;
  const jenisAwal = Array.isArray(jenisParam) ? jenisParam[0] : jenisParam;
  const { user } = useSession();
  const tema = useTheme();

  const asistenId =
    user?.peran === 'asisten' ? user.id : undefined;

  const hasilKelas = useKelasAsisten(db, asistenId);
  const hasilSesi = useSesiAsisten(db, asistenId);

  const kelas = hasilKelas.kelas.find(
    (item) => item.id === kelasId,
  );

  const daftarSesi = hasilSesi.sesi.filter(
    (item) => item.kelasId === kelasId,
  );

  const [menghapus, setMenghapus] = useState(false);
  const [pesan, setPesan] = useState(pesanAwal ?? '');
  const jenisPesan: 'sukses' | 'gagal' = jenisAwal ?? 'sukses';

  function kembali() {
    router.replace('/(asisten)/kelas');
  }

  function bukaTambah() {
    setPesan('');
    router.push({
      pathname: '/(asisten)/kelas/[id]/tambah',
      params: { id: kelasId },
    });
  }

  function bukaEdit(item: SesiAsisten) {
    setPesan('');
    router.push({
      pathname: '/(asisten)/kelas/[id]/edit/[sesiId]',
      params: { id: kelasId, sesiId: item.id },
    });
  }

  function konfirmasiHapusSesi(item: SesiAsisten) {
    if (!asistenId) return;

    Alert.alert(
      'Hapus Sesi',
      'Yakin ingin menghapus sesi ini? Sesi hanya dapat dihapus jika belum dibuka dan belum memiliki data presensi atau pengajuan izin.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            void prosesHapusSesi(item);
          },
        },
      ],
    );
  }

  async function prosesHapusSesi(item: SesiAsisten) {
    if (!asistenId) return;

    setMenghapus(true);

    try {
      const hasil = await hapusSesi({
        db,
        sesiId: item.id,
        asistenId,
      });

      if (!hasil.ok) {
        Alert.alert('Gagal menghapus sesi', hasil.pesan);
        return;
      }

      Alert.alert('Berhasil', hasil.pesan);
    } catch {
      Alert.alert(
        'Gagal',
        'Terjadi kesalahan saat menghapus sesi. Silakan coba lagi.',
      );
    } finally {
      setMenghapus(false);
    }
  }

  if (!asistenId) {
    return (
      <Screen>
        <EmptyState
          judul="Akun asisten belum aktif"
          deskripsi="Gunakan akun asisten untuk mengelola sesi kelas."
        />
      </Screen>
    );
  }

  if (hasilKelas.status === 'memuat') {
    return (
      <Screen>
        <EmptyState
          judul="Memuat kelas"
          deskripsi="Sedang mengambil informasi kelas."
        />
      </Screen>
    );
  }

  if (!kelas) {
    return (
      <Screen>
        <View
          className="w-full flex-1 self-center justify-center px-three"
          style={{ maxWidth: MaxContentWidth }}
        >
          <Card>
            <EmptyState
              judul="Kelas tidak ditemukan"
              deskripsi="Kelas mungkin sudah dihapus atau kamu tidak memiliki akses."
            />
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundClassName="bg-backgroundElement" padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <HeaderAsisten />

        <FlatList
          data={daftarSesi}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-three pt-two">
              <Pressable
                accessibilityLabel="Kembali ke kelas"
                accessibilityRole="button"
                onPress={kembali}
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

              <Text
                accessibilityRole="header"
                className="text-title font-semibold text-text"
              >
                Kelola Sesi
              </Text>

              <Card tone="muted">
                <Text className="text-body font-semibold text-text">
                  {kelas.nama}
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  Laboratorium kelas: {kelas.lab}
                </Text>
              </Card>

              {pesan ? (
                <Banner
                  jenis={jenisPesan}
                  pesan={pesan}
                  onTutup={() => setPesan('')}
                />
              ) : null}

              <Pressable
                accessibilityLabel="Tambah sesi"
                accessibilityRole="button"
                onPress={bukaTambah}
                className="min-h-button flex-row items-center justify-center gap-two rounded-pill bg-primary active:scale-95"
              >
                <SymbolView
                  name={{
                    ios: 'plus',
                    android: 'add',
                    web: 'add',
                  }}
                  size={22}
                  tintColor={tema.primaryText}
                />

                <Text className="text-body font-semibold text-primaryText">
                  Tambah Sesi
                </Text>
              </Pressable>
            </View>
          }
          ListEmptyComponent={
            hasilSesi.status === 'memuat' ? (
              <EmptyState
                judul="Memuat sesi"
                deskripsi="Sedang mengambil daftar sesi kelas."
              />
            ) : hasilSesi.status === 'gagal' ? (
              <EmptyState
                judul="Sesi gagal dimuat"
                deskripsi={
                  hasilSesi.pesanGalat ??
                  'Terjadi kesalahan saat mengambil sesi.'
                }
              />
            ) : (
              <EmptyState
                judul="Belum ada sesi"
                deskripsi="Sesi praktikum yang dibuat untuk kelas ini akan muncul di sini."
              />
            )
          }
          ListFooterComponent={
            daftarSesi.length > 0 ? (
              <Text className="mt-two text-small text-textSecondary">
                Sesi yang sudah dibuka tidak dapat diedit atau dihapus.
              </Text>
            ) : undefined
          }
          renderItem={({ item }) => (
            <KartuSesi
              lab={item.lab}
              menghapus={menghapus}
              onEdit={() => bukaEdit(item)}
              onHapus={() => konfirmasiHapusSesi(item)}
              sesi={item}
            />
          )}
        />
      </View>
    </Screen>
  );
}