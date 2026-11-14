
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  AppButton,
  Card,
  EmptyState,
  HomeButton,
  Screen,
  StatusBadge,
  TextField,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import {
  useSesiAsisten,
  type SesiAsisten,
} from '@/features/asisten/use-sesi-asisten';
import { db } from '@/lib/firebase';
import {
  buatSesi,
  ubahSesi,
} from '@/lib/sesi';
import { useSession } from '@/store/session-store';

function hariDariTanggal(tanggal: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return '';

  const [tahun, bulan, tanggalHari] = tanggal.split('-').map(Number);
  const tanggalObj = new Date(tahun, bulan - 1, tanggalHari);

  if (
    tanggalObj.getFullYear() !== tahun ||
    tanggalObj.getMonth() !== bulan - 1 ||
    tanggalObj.getDate() !== tanggalHari
  ) {
    return '';
  }

  const hari = tanggalObj.toLocaleDateString('id-ID', {
    weekday: 'long',
  });

  return hari.charAt(0).toUpperCase() + hari.slice(1);
}

function formatTanggal(tanggal: string): string {
  const [tahun, bulan, tanggalHari] = tanggal.split('-').map(Number);
  const tanggalObj = new Date(tahun, bulan - 1, tanggalHari);

  return tanggalObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function tanggalKeString(date: Date): string {
  const tahun = date.getFullYear();
  const bulan = String(date.getMonth() + 1).padStart(2, '0');
  const hari = String(date.getDate()).padStart(2, '0');

  return `${tahun}-${bulan}-${hari}`;
}

function stringKeTanggal(tanggal: string): Date {
  if (!tanggal) return new Date();

  const [tahun, bulan, hari] = tanggal.split('-').map(Number);

  return new Date(tahun, bulan - 1, hari, 12);
}

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

  const [formTerbuka, setFormTerbuka] = useState(false);
  const [sesiDiedit, setSesiDiedit] =
    useState<SesiAsisten | null>(null);

  const [tanggal, setTanggal] = useState('');
  const [pemilihTanggal, setPemilihTanggal] = useState(false);

  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');

  const [menyimpan, setMenyimpan] = useState(false);

  function kembali() {
    router.replace('/(asisten)/kelas');
  }

  function bersihkanForm() {
    setFormTerbuka(false);
    setSesiDiedit(null);
    setTanggal('');
    setPemilihTanggal(false);
    setJamMulai('');
    setJamSelesai('');
  }

  function bukaFormTambah() {
    setSesiDiedit(null);
    setTanggal('');
    setJamMulai('');
    setJamSelesai('');
    setFormTerbuka(true);
  }

  function bukaFormEdit(item: SesiAsisten) {
    setSesiDiedit(item);
    setTanggal(item.tanggal);
    setJamMulai(item.jamMulai);
    setJamSelesai(item.jamSelesai);
    setFormTerbuka(true);
  }

  async function simpanSesi() {
    if (!kelas || !asistenId) {
      Alert.alert(
        'Gagal',
        'Data kelas atau akun asisten belum tersedia.',
      );
      return;
    }

    const hari = hariDariTanggal(tanggal);

    if (!tanggal || !hari) {
      Alert.alert(
        'Tanggal belum dipilih',
        'Silakan pilih tanggal praktikum melalui kalender.',
      );
      return;
    }

    if (!jamMulai.trim() || !jamSelesai.trim()) {
      Alert.alert(
        'Data belum lengkap',
        'Jam mulai dan jam selesai wajib diisi.',
      );
      return;
    }

    setMenyimpan(true);

    try {
      const hasil = sesiDiedit
        ? await ubahSesi({
            db,
            sesiId: sesiDiedit.id,
            asistenId,
            hari,
            tanggal,
            jamMulai,
            jamSelesai,
          })
        : await buatSesi({
            db,
            kelasId: kelas.id,
            asistenId,
            hari,
            tanggal,
            jamMulai,
            jamSelesai,
          });

      if (!hasil.ok) {
        Alert.alert('Gagal menyimpan sesi', hasil.pesan);
        return;
      }

      bersihkanForm();
      Alert.alert('Berhasil', hasil.pesan);
    } catch {
      Alert.alert(
        'Gagal',
        'Terjadi kesalahan saat menyimpan sesi. Silakan coba lagi.',
      );
    } finally {
      setMenyimpan(false);
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

              <AppButton
                label={formTerbuka ? 'Tutup Form' : 'Tambah Sesi'}
                onPress={() => {
                  if (formTerbuka) {
                    bersihkanForm();
                  } else {
                    bukaFormTambah();
                  }
                }}
              />

              {formTerbuka ? (
                <View className="gap-three rounded-lg border border-border bg-backgroundElement p-three">
                  <Text className="text-subtitle font-semibold text-text">
                    {sesiDiedit ? 'Edit Sesi' : 'Tambah Sesi'}
                  </Text>

                  <View className="gap-one">
                    <Text className="text-small font-medium text-text">
                      Tanggal Praktikum
                    </Text>

                    <Pressable
                      accessibilityRole="button"
                      disabled={menyimpan}
                      onPress={() => setPemilihTanggal(true)}
                      className="flex-row items-center justify-between rounded-lg border border-border bg-background px-three py-three"
                    >
                      <View className="flex-1">
                        <Text
                          className={
                            tanggal
                              ? 'text-body font-medium text-text'
                              : 'text-body text-textSecondary'
                          }
                        >
                          {tanggal
                            ? formatTanggal(tanggal)
                            : 'Pilih tanggal praktikum'}
                        </Text>

                        {tanggal ? (
                          <Text className="mt-one text-small text-textSecondary">
                            {hariDariTanggal(tanggal)}
                          </Text>
                        ) : null}
                      </View>
                    </Pressable>

                    {pemilihTanggal ? (
                      <DateTimePicker
                        value={stringKeTanggal(tanggal)}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setPemilihTanggal(false);

                          if (selectedDate) {
                            setTanggal(tanggalKeString(selectedDate));
                          }
                        }}
                      />
                    ) : null}
                  </View>

                  <TextField
                    label="Jam Mulai"
                    value={jamMulai}
                    onChangeText={setJamMulai}
                    placeholder="Contoh: 08:00"
                    autoCapitalize="none"
                  />

                  <TextField
                    label="Jam Selesai"
                    value={jamSelesai}
                    onChangeText={setJamSelesai}
                    placeholder="Contoh: 10:00"
                    autoCapitalize="none"
                  />

                  <View className="flex-row gap-two">
                    <View className="flex-1">
                      <AppButton
                        label="Batal"
                        variant="secondary"
                        disabled={menyimpan}
                        onPress={bersihkanForm}
                      />
                    </View>

                    <View className="flex-1">
                      <AppButton
                        label={
                          menyimpan ? 'Menyimpan...' : 'Simpan Sesi'
                        }
                        disabled={menyimpan}
                        onPress={simpanSesi}
                      />
                    </View>
                  </View>
                </View>
              ) : null}

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
                  {item.hari}, {formatTanggal(item.tanggal)}
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
                <View className="mt-three">
                  <AppButton
                    label="Edit Sesi"
                    variant="secondary"
                    onPress={() => bukaFormEdit(item)}
                  />
                </View>
              ) : (
                <Text className="mt-three text-small text-textSecondary">
                  Sesi yang sudah dibuka tidak dapat diedit.
                </Text>
              )}
            </Card>
          )}
        />
      </View>
    </Screen>
  );
}
