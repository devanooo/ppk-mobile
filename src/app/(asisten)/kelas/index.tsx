
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import {
  AppButton,
  Card,
  EmptyState,
  Screen,
  TextField,
} from '@/components/ui';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import { db } from '@/lib/firebase';
import { userConverter } from '@/lib/konversi';
import {
  buatKelas,
  ubahKelas,
  tambahPeserta,
  hapusPeserta,
  hapusKelas,
  type Kelas,
} from '@/lib/kelas';
import type { UserFirestore } from '@/types/firestore';
import { useSession } from '@/store/session-store';

type Praktikan = UserFirestore & {
  id: string;
};

export default function KelasAsistenScreen() {
  const { user } = useSession();

  const [formTerbuka, setFormTerbuka] = useState(false);
  const [kelasDiedit, setKelasDiedit] = useState<Kelas | null>(null);
  const [kelasDikelola, setKelasDikelola] = useState<Kelas | null>(null);
  const [kelasAkanDihapus, setKelasAkanDihapus] = useState<Kelas | null>(null);
  const [pesertaTerpilih, setPesertaTerpilih] = useState<string[]>([]);
  const [nama, setNama] = useState('');
  const [lab, setLab] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);
  const [menghapus, setMenghapus] = useState(false);

  const [hasilHapus, setHasilHapus] = useState<{
    judul: string;
    deskripsi: string;
  } | null>(null);

  const [daftarPraktikan, setDaftarPraktikan] = useState<Praktikan[]>([]);
  const [statusPraktikan, setStatusPraktikan] = useState<
    'memuat' | 'siap' | 'gagal'
  >('memuat');

  const asistenId = user?.peran === 'asisten' ? user.id : undefined;
  const hasil = useKelasAsisten(db, asistenId);
  const namaAsisten = user?.nama?.trim() || 'Asisten';

  useEffect(() => {
    if (!asistenId) return;

    const rujukan = query(
      collection(db, 'users').withConverter(userConverter),
      where('peran', '==', 'praktikan'),
    );

    return onSnapshot(
      rujukan,
      (snapshot) => {
        const data = snapshot.docs.map((dokumen) => ({
          id: dokumen.id,
          ...dokumen.data(),
        }));

        setDaftarPraktikan(data);
        setStatusPraktikan('siap');
      },
      () => {
        setStatusPraktikan('gagal');
      },
    );
  }, [asistenId]);

  function bukaFormTambah() {
    setKelasDiedit(null);
    setNama('');
    setLab('');
    setKelasDikelola(null);
    setFormTerbuka(true);
  }

  function bukaFormEdit(item: Kelas) {
    setKelasDiedit(item);
    setNama(item.nama);
    setLab(item.lab);
    setKelasDikelola(null);
    setFormTerbuka(true);
  }

  function tutupForm() {
    setFormTerbuka(false);
    setKelasDiedit(null);
    setNama('');
    setLab('');
  }

  function bukaKelolaPeserta(item: Kelas) {
    if (kelasDikelola?.id === item.id) {
      setKelasDikelola(null);
      setPesertaTerpilih([]);
      return;
    }

    tutupForm();
    setKelasDikelola(item);
    setPesertaTerpilih([...item.pesertaIds]);
  }

  function pilihPeserta(praktikanId: string) {
    setPesertaTerpilih((sebelumnya) =>
      sebelumnya.includes(praktikanId)
        ? sebelumnya.filter((id) => id !== praktikanId)
        : [...sebelumnya, praktikanId],
    );
  }

  function bukaKelolaSesi(item: Kelas) {
    router.push({
      pathname: '/(asisten)/kelas/[id]',
      params: { id: item.id },
    });
  }

  async function simpanKelas() {
    if (!asistenId) {
      Alert.alert('Gagal', 'Identitas asisten belum tersedia.');
      return;
    }

    if (!nama.trim() || !lab.trim()) {
      Alert.alert('Data belum lengkap', 'Nama kelas dan lab wajib diisi.');
      return;
    }

    setMenyimpan(true);

    try {
      const hasilSimpan = kelasDiedit
        ? await ubahKelas({
            db,
            kelasId: kelasDiedit.id,
            asistenId,
            nama,
            lab,
          })
        : await buatKelas({
            db,
            nama,
            lab,
            asistenId,
          });

      if (!hasilSimpan.ok) {
        Alert.alert('Gagal menyimpan kelas', hasilSimpan.pesan);
        return;
      }

      tutupForm();
      Alert.alert('Berhasil', hasilSimpan.pesan);
    } finally {
      setMenyimpan(false);
    }
  }

  async function prosesHapusKelas() {
    if (!kelasAkanDihapus) return;

    if (!asistenId) {
      setKelasAkanDihapus(null);
      setHasilHapus({
        judul: 'Gagal',
        deskripsi: 'Identitas asisten belum tersedia.',
      });
      return;
    }

    const item = kelasAkanDihapus;
    setMenghapus(true);

    try {
      const hasilHapusKelas = await hapusKelas({
        db,
        kelasId: item.id,
        asistenId,
      });

      setKelasAkanDihapus(null);

      if (!hasilHapusKelas.ok) {
        setHasilHapus({
          judul: 'Tidak dapat menghapus kelas',
          deskripsi: hasilHapusKelas.pesan,
        });
        return;
      }

      if (kelasDikelola?.id === item.id) {
        setKelasDikelola(null);
        setPesertaTerpilih([]);
      }

      setHasilHapus({
        judul: 'Berhasil',
        deskripsi: hasilHapusKelas.pesan,
      });
    } catch {
      setKelasAkanDihapus(null);
      setHasilHapus({
        judul: 'Gagal menghapus kelas',
        deskripsi: 'Terjadi kesalahan. Silakan coba lagi.',
      });
    } finally {
      setMenghapus(false);
    }
  }

  async function simpanPeserta() {
    if (!kelasDikelola) {
      Alert.alert('Gagal', 'Data kelas belum tersedia.');
      return;
    }

    const pesertaLama = kelasDikelola.pesertaIds;

    const pesertaDitambahkan = pesertaTerpilih.filter(
      (id) => !pesertaLama.includes(id),
    );

    const pesertaDihapus = pesertaLama.filter(
      (id) => !pesertaTerpilih.includes(id),
    );

    setMenyimpan(true);

    try {
      for (const praktikanId of pesertaDitambahkan) {
        const hasilTambah = await tambahPeserta({
          db,
          kelasId: kelasDikelola.id,
          praktikanId,
        });

        if (!hasilTambah.ok) {
          Alert.alert('Gagal menambahkan peserta', hasilTambah.pesan);
          return;
        }
      }

      for (const praktikanId of pesertaDihapus) {
        const hasilHapusPeserta = await hapusPeserta({
          db,
          kelasId: kelasDikelola.id,
          praktikanId,
        });

        if (!hasilHapusPeserta.ok) {
          Alert.alert('Gagal menghapus peserta', hasilHapusPeserta.pesan);
          return;
        }
      }

      setKelasDikelola(null);
      setPesertaTerpilih([]);
      Alert.alert('Berhasil', 'Daftar peserta kelas berhasil diperbarui.');
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={hasil.kelas}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-twoHalf px-three pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="gap-three pt-three">
              <View className="flex-row items-start justify-between gap-three">
                <View className="flex-1">
                  <Text className="text-small text-textSecondary">
                    Halo, {namaAsisten}
                  </Text>

                  <Text className="mt-one text-title font-semibold text-text">
                    Kelas
                  </Text>

                  <Text className="mt-one text-small text-textSecondary">
                    {hasil.kelas.length} kelas yang kamu ampu
                  </Text>
                </View>

                {user ? <MenuProfilAsisten /> : null}
              </View>

              <AppButton
                label={formTerbuka ? 'Tutup Form' : 'Tambah Kelas'}
                onPress={() => {
                  if (formTerbuka) {
                    tutupForm();
                  } else {
                    bukaFormTambah();
                  }
                }}
              />

              {formTerbuka ? (
                <View className="gap-three rounded-lg border border-border bg-backgroundElement p-three">
                  <Text className="text-subtitle font-semibold text-text">
                    {kelasDiedit ? 'Edit Kelas' : 'Tambah Kelas'}
                  </Text>

                  <TextField
                    label="Nama Kelas"
                    value={nama}
                    onChangeText={setNama}
                    placeholder="Contoh: Informatika D1"
                    autoCapitalize="words"
                  />

                  <TextField
                    label="Nama Lab"
                    value={lab}
                    onChangeText={setLab}
                    placeholder="Contoh: Lab Komputer 1"
                    autoCapitalize="words"
                  />

                  <View className="flex-row gap-two">
                    <View className="flex-1">
                      <AppButton
                        label="Batal"
                        variant="secondary"
                        disabled={menyimpan}
                        onPress={tutupForm}
                      />
                    </View>

                    <View className="flex-1">
                      <AppButton
                        label={menyimpan ? 'Menyimpan...' : 'Simpan'}
                        disabled={menyimpan || !nama.trim() || !lab.trim()}
                        onPress={simpanKelas}
                      />
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              judul={
                hasil.status === 'memuat'
                  ? 'Memuat kelas...'
                  : hasil.status === 'gagal'
                    ? 'Data kelas belum tersedia'
                    : 'Belum ada kelas'
              }
              deskripsi={
                hasil.pesanGalat ??
                (hasil.status === 'memuat'
                  ? 'Sedang mengambil data kelas.'
                  : 'Kelas yang kamu ampu akan muncul di sini.')
              }
            />
          }
          renderItem={({ item }) => (
            <Card
              accessibilityLabel={`${item.nama}, ${item.lab}, ${item.pesertaIds.length} peserta`}
            >
              <Text className="text-subtitle font-semibold text-text">
                {item.nama}
              </Text>

              <Text className="mt-one text-small text-textSecondary">
                {item.lab}
              </Text>

              <Text className="mt-two text-small text-textSecondary">
                {item.pesertaIds.length} peserta
              </Text>

              <View className="mt-three gap-two">
                <AppButton
                  label="Edit Kelas"
                  variant="secondary"
                  disabled={menghapus}
                  onPress={() => bukaFormEdit(item)}
                />

                <AppButton
                  label="Kelola Peserta"
                  variant="secondary"
                  disabled={menghapus}
                  onPress={() => bukaKelolaPeserta(item)}
                />

                <AppButton
                  label="Kelola Sesi"
                  variant="secondary"
                  disabled={menghapus}
                  onPress={() => bukaKelolaSesi(item)}
                />

                <AppButton
                  label={menghapus ? 'Menghapus...' : 'Hapus Kelas'}
                  variant="danger"
                  disabled={menghapus || menyimpan}
                  onPress={() => setKelasAkanDihapus(item)}
                />
              </View>

              {kelasDikelola?.id === item.id ? (
                <View className="mt-three gap-three border-t border-border pt-three">
                  <View>
                    <Text className="text-subtitle font-semibold text-text">
                      Kelola Peserta
                    </Text>

                    <Text className="mt-one text-small text-textSecondary">
                      Pilih praktikan yang terdaftar di kelas ini.
                    </Text>
                  </View>

                  {statusPraktikan === 'memuat' ? (
                    <Text className="text-small text-textSecondary">
                      Memuat daftar praktikan...
                    </Text>
                  ) : statusPraktikan === 'gagal' ? (
                    <Text className="text-small text-textSecondary">
                      Daftar praktikan gagal dimuat.
                    </Text>
                  ) : daftarPraktikan.length === 0 ? (
                    <Text className="text-small text-textSecondary">
                      Belum ada praktikan terdaftar.
                    </Text>
                  ) : (
                    daftarPraktikan.map((praktikan) => {
                      const terpilih = pesertaTerpilih.includes(praktikan.id);

                      return (
                        <Pressable
                          key={praktikan.id}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: terpilih }}
                          disabled={menyimpan}
                          onPress={() => pilihPeserta(praktikan.id)}
                          className="flex-row items-center gap-three rounded-md border border-border p-three"
                        >
                          <View
                            className={`h-5 w-5 items-center justify-center rounded border ${
                              terpilih
                                ? 'border-primary bg-primary'
                                : 'border-border bg-background'
                            }`}
                          >
                            {terpilih ? (
                              <Text className="text-small font-bold text-white">
                                ✓
                              </Text>
                            ) : null}
                          </View>

                          <View className="flex-1">
                            <Text className="text-body font-medium text-text">
                              {praktikan.nama}
                            </Text>

                            <Text className="text-small text-textSecondary">
                              {praktikan.nomorInduk}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })
                  )}

                  <Text className="text-small text-textSecondary">
                    {pesertaTerpilih.length} peserta dipilih
                  </Text>

                  <AppButton
                    label={menyimpan ? 'Menyimpan...' : 'Simpan Peserta'}
                    disabled={menyimpan || statusPraktikan !== 'siap'}
                    onPress={simpanPeserta}
                  />
                </View>
              ) : null}
            </Card>
          )}
        />

        <BottomSheet
          visible={kelasAkanDihapus !== null}
          onClose={() => {
            if (!menghapus) setKelasAkanDihapus(null);
          }}
          judul="Hapus Kelas?"
          deskripsi={
            kelasAkanDihapus
              ? `Apakah kamu yakin ingin menghapus kelas ${kelasAkanDihapus.nama}? Kelas yang sudah memiliki sesi tidak dapat dihapus.`
              : ''
          }
          labelBatal="Batal"
          labelKonfirmasi={menghapus ? 'Menghapus...' : 'Hapus'}
          onKonfirmasi={() => void prosesHapusKelas()}
          bahaya
        />

        <BottomSheet
          visible={hasilHapus !== null}
          onClose={() => setHasilHapus(null)}
          judul={hasilHapus?.judul ?? ''}
          deskripsi={hasilHapus?.deskripsi ?? ''}
          labelBatal="Tutup"
          labelKonfirmasi="Mengerti"
          onKonfirmasi={() => setHasilHapus(null)}
        />
      </View>
    </Screen>
  );
}
