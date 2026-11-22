import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import { AppButton, Banner, SearchBar } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { HasilAksi } from '@/lib/kelas';

import { AvatarInisial } from './avatar-inisial';
import type { Praktikan } from './use-praktikan';
import type { UmpanBalik } from './umpan-balik';

type ModalTambahPesertaProps = {
  visible: boolean;
  kandidat: Praktikan[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  onTutup: () => void;
  onSimpan: (ids: string[]) => Promise<HasilAksi>;
};

export function ModalTambahPeserta({
  visible,
  ...props
}: ModalTambahPesertaProps) {
  if (!visible) return null;

  return <ModalTambahPesertaTerbuka {...props} />;
}

function ModalTambahPesertaTerbuka({
  kandidat,
  status,
  pesanGalat,
  onTutup,
  onSimpan,
}: Omit<ModalTambahPesertaProps, 'visible'>) {
  const tema = useTheme();
  const [cari, setCari] = useState('');
  const [terpilih, setTerpilih] = useState<Set<string>>(() => new Set());
  const [banner, setBanner] = useState<UmpanBalik | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

  const kandidatTersaring = useMemo(() => {
    const kunci = cari.trim().toLowerCase();

    if (!kunci) return kandidat;

    return kandidat.filter(
      (praktikan) =>
        praktikan.nama.toLowerCase().includes(kunci) ||
        praktikan.nomorInduk.includes(kunci),
    );
  }, [cari, kandidat]);

  const alasanNonaktif =
    status === 'memuat'
      ? 'Daftar mahasiswa sedang dimuat.'
      : status === 'gagal'
        ? 'Daftar mahasiswa gagal dimuat.'
        : terpilih.size === 0
          ? 'Pilih minimal satu mahasiswa.'
          : undefined;

  function tutup() {
    if (!menyimpan) onTutup();
  }

  function ubahPilihan(id: string) {
    setTerpilih((sebelumnya) => {
      const berikut = new Set(sebelumnya);

      if (berikut.has(id)) {
        berikut.delete(id);
      } else {
        berikut.add(id);
      }

      return berikut;
    });
  }

  async function simpan() {
    if (terpilih.size === 0 || status !== 'siap') return;

    setBanner(null);
    setMenyimpan(true);

    try {
      const hasil = await onSimpan(Array.from(terpilih));

      if (hasil.ok) {
        onTutup();
        return;
      }

      setBanner({ jenis: 'gagal', pesan: hasil.pesan });
    } catch {
      setBanner({
        jenis: 'gagal',
        pesan: 'Peserta gagal ditambahkan. Periksa koneksi lalu coba lagi.',
      });
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={tutup}
      statusBarTranslucent
      transparent
      visible
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center px-three">
          <Pressable
            accessibilityLabel="Tutup modal tambah peserta"
            accessibilityRole="button"
            className="absolute inset-0 bg-overlay/40"
            onPress={tutup}
          />

          <View
            accessibilityViewIsModal
            onAccessibilityEscape={tutup}
            className="max-h-sheetMax w-full rounded-xl bg-backgroundElement p-four"
            style={{ maxWidth: MaxContentWidth }}
          >
            <View className="flex-row items-start justify-between gap-two">
              <View className="flex-1">
                <Text
                  accessibilityRole="header"
                  className="text-subtitle font-semibold text-text"
                >
                  Tambah Peserta
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  Pilih mahasiswa yang akan ditambahkan ke kelas ini.
                </Text>
              </View>

              <Pressable
                accessibilityLabel="Tutup modal tambah peserta"
                accessibilityRole="button"
                accessibilityState={{ disabled: menyimpan }}
                disabled={menyimpan}
                onPress={tutup}
                className="h-touch w-touch items-center justify-center rounded-pill active:opacity-60"
              >
                <SymbolView
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  size={20}
                  tintColor={tema.textSecondary}
                />
              </Pressable>
            </View>

            <SearchBar
              accessibilityLabel="Cari mahasiswa"
              className="mt-four"
              onUbah={setCari}
              placeholder="Cari nama atau NIM"
              nilai={cari}
            />

            {banner ? (
              <Banner
                className="mt-three"
                jenis={banner.jenis}
                pesan={banner.pesan}
                onTutup={() => setBanner(null)}
              />
            ) : null}

            <Text className="mt-four text-small font-medium text-text">
              Hasil Pencarian
            </Text>

            <IsiHasil
              kandidat={kandidat}
              kandidatTersaring={kandidatTersaring}
              onPilih={ubahPilihan}
              pesanGalat={pesanGalat}
              status={status}
              terpilih={terpilih}
            />

            <Text className="mt-four text-small text-textSecondary">
              {terpilih.size} mahasiswa dipilih
            </Text>

            <View className="mt-two">
              <AppButton
                disabled={
                  menyimpan || status !== 'siap' || terpilih.size === 0
                }
                disabledReason={alasanNonaktif}
                fullWidth
                label={menyimpan ? 'Menyimpan...' : 'Selesai'}
                loading={menyimpan}
                onPress={() => {
                  void simpan();
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function IsiHasil({
  kandidat,
  kandidatTersaring,
  onPilih,
  pesanGalat,
  status,
  terpilih,
}: {
  kandidat: Praktikan[];
  kandidatTersaring: Praktikan[];
  onPilih: (id: string) => void;
  pesanGalat?: string;
  status: 'memuat' | 'siap' | 'gagal';
  terpilih: Set<string>;
}) {
  const tema = useTheme();

  if (status === 'memuat') {
    return (
      <View className="items-center gap-two py-five">
        <ActivityIndicator color={tema.primary} />
        <Text className="text-small text-textSecondary">
          Memuat daftar mahasiswa...
        </Text>
      </View>
    );
  }

  if (status === 'gagal') {
    return (
      <Text className="mt-three text-small text-textSecondary">
        {pesanGalat ?? 'Daftar mahasiswa gagal dimuat.'}
      </Text>
    );
  }

  if (kandidat.length === 0) {
    return (
      <Text className="mt-three text-small text-textSecondary">
        Semua mahasiswa sudah tergabung di kelas ini.
      </Text>
    );
  }

  if (kandidatTersaring.length === 0) {
    return (
      <Text className="mt-three text-small text-textSecondary">
        Tidak ada mahasiswa yang cocok dengan pencarian.
      </Text>
    );
  }

  return (
    <FlatList
      className="mt-two shrink"
      contentContainerClassName="pb-two"
      data={kandidatTersaring}
      ItemSeparatorComponent={Pemisah}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const aktif = terpilih.has(item.id);

        return (
          <View
            className={`flex-row items-center gap-three rounded-md px-two py-twoHalf ${
              aktif ? 'bg-backgroundSelected' : ''
            }`}
          >
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
              accessibilityLabel={`${aktif ? 'Batalkan pilihan' : 'Pilih'} ${item.nama}`}
              accessibilityRole="button"
              accessibilityState={{ selected: aktif }}
              onPress={() => onPilih(item.id)}
              className={`h-touch w-touch items-center justify-center rounded-pill active:opacity-60 ${
                aktif
                  ? 'bg-primary'
                  : 'border border-primary bg-transparent'
              }`}
            >
              <SymbolView
                name={
                  aktif
                    ? { ios: 'checkmark', android: 'check', web: 'check' }
                    : { ios: 'plus', android: 'add', web: 'add' }
                }
                size={18}
                tintColor={aktif ? tema.primaryText : tema.primary}
              />
            </Pressable>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

function Pemisah() {
  return <View className="h-half bg-border" />;
}

export type { ModalTambahPesertaProps };