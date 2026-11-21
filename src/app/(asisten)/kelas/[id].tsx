
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  Card,
  EmptyState,
  HomeButton,
  Screen,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { tanggalPanjang } from '@/features/asisten/format-edit-sesi';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import {
  ModalSesi,
  type DataSesiForm,
} from '@/features/asisten/modal-sesi';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import {
  useSesiAsisten,
  type SesiAsisten,
} from '@/features/asisten/use-sesi-asisten';
import { db } from '@/lib/firebase';
import {
  buatSesi,
  hapusSesi,
  ubahSesi,
  type HasilAksiSesi,
} from '@/lib/sesi';
import { useSession } from '@/store/session-store';

function labelStatus(status: SesiAsisten['status']): string {
  if (status === 'belum-dibuka') return 'Belum dibuka';
  if (status === 'dibuka') return 'Dibuka';
  return 'Ditutup';
}

export default function DetailKelasAsistenScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const kelasId = Array.isArray(id) ? id[0] : id;
  const { user } = useSession();

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

  const [modalTerbuka, setModalTerbuka] = useState(false);
  const [sesiDiedit, setSesiDiedit] =
    useState<SesiAsisten | null>(null);

  const [menghapus, setMenghapus] = useState(false);
  const [pesan, setPesan] = useState('');
  const [jenisPesan, setJenisPesan] =
    useState<'sukses' | 'gagal'>('sukses');

  function kembali() {
    router.replace('/(asisten)/kelas');
  }

  function bukaTambah() {
    setPesan('');
    setSesiDiedit(null);
    setModalTerbuka(true);
  }

  function bukaEdit(item: SesiAsisten) {
    setPesan('');
    setSesiDiedit(item);
    setModalTerbuka(true);
  }

  function tutupModal() {
    setModalTerbuka(false);
    setSesiDiedit(null);
  }

  async function simpanSesi(
    data: DataSesiForm,
  ): Promise<HasilAksiSesi> {
    if (!kelas || !asistenId) {
      return {
        ok: false,
        pesan: 'Data kelas atau akun asisten belum tersedia.',
      };
    }

    const hasil = sesiDiedit
      ? await ubahSesi({
          db,
          sesiId: sesiDiedit.id,
          asistenId,
          ...data,
        })
      : await buatSesi({
          db,
          kelasId: kelas.id,
          asistenId,
          ...data,
        });

    if (hasil.ok) {
      setPesan(hasil.pesan);
      setJenisPesan('sukses');
    }

    return hasil;
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
            <AppButton
              className="mt-three"
              label="Kembali ke Daftar Kelas"
              variant="secondary"
              onPress={kembali}
            />
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <View className="flex-row items-center justify-between gap-two px-three pt-two">
          <HomeButton onPress={kembali} />
          <MenuProfilAsisten />
        </View>

        <FlatList
          data={daftarSesi}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-three px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-three pt-three">
              <View>
                <Text className="text-title font-semibold text-text">
                  {kelas.nama}
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  {kelas.lab}
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  {kelas.pesertaIds.length} peserta terdaftar
                </Text>
              </View>

              {pesan ? (
                <Banner
                  jenis={jenisPesan}
                  pesan={pesan}
                  onTutup={() => setPesan('')}
                />
              ) : null}

              <AppButton label="Tambah Sesi" onPress={bukaTambah} />

              <Text className="text-subtitle font-semibold text-text">
                Daftar Sesi
              </Text>
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
          renderItem={({ item }) => (
            <Card>
              <View className="flex-row items-start justify-between gap-two">
                <Text className="flex-1 text-subtitle font-semibold text-text">
                  {item.hari}, {tanggalPanjang(item.tanggal)}
                </Text>

                <StatusBadge status={item.status} />
              </View>

              <Text className="mt-two text-body text-text">
                {item.jamMulai} - {item.jamSelesai}
              </Text>

              <Text className="mt-one text-small text-textSecondary">
                Status: {labelStatus(item.status)}
              </Text>

              {item.status === 'belum-dibuka' ? (
                <View className="mt-three gap-two">
                  <AppButton
                    label="Edit Sesi"
                    variant="secondary"
                    disabled={menghapus}
                    onPress={() => bukaEdit(item)}
                  />

                  <AppButton
                    label={menghapus ? 'Menghapus...' : 'Hapus Sesi'}
                    variant="secondary"
                    disabled={menghapus}
                    onPress={() => konfirmasiHapusSesi(item)}
                  />
                </View>
              ) : (
                <Text className="mt-three text-small text-textSecondary">
                  Sesi yang sudah dibuka tidak dapat diedit atau dihapus.
                </Text>
              )}
            </Card>
          )}
        />

        <ModalSesi
          lab={kelas.lab}
          namaKelas={kelas.nama}
          onSimpan={simpanSesi}
          onTutup={tutupModal}
          sesi={sesiDiedit}
          visible={modalTerbuka}
        />
      </View>
    </Screen>
  );
}
