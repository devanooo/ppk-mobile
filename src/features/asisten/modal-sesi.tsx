import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  AppButton,
  Banner,
  Card,
  Screen,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  validasiWaktuSesi,
  type HasilAksiSesi,
  type SesiFirestore,
} from '@/lib/sesi';

import { FieldJam } from './field-jam';
import { FieldTanggal } from './field-tanggal';
import {
  hariDariTanggal,
  jamValid,
  tanggalValid,
} from './format-edit-sesi';

export type DataSesiForm = {
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
};

type GalatField = {
  tanggal?: string;
  jamMulai?: string;
  jamSelesai?: string;
};

type ModalSesiProps = {
  visible: boolean;
  namaKelas: string;
  lab: string;
  /** `null` berarti mode tambah sesi. */
  sesi?: SesiFirestore | null;
  onTutup: () => void;
  onSimpan: (data: DataSesiForm) => Promise<HasilAksiSesi>;
};

export function ModalSesi({
  visible,
  namaKelas,
  lab,
  sesi,
  onTutup,
  onSimpan,
}: ModalSesiProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onTutup}
      presentationStyle="fullScreen"
      visible={visible}
    >
      {visible ? (
        <IsiModalSesi
          lab={lab}
          namaKelas={namaKelas}
          onSimpan={onSimpan}
          onTutup={onTutup}
          sesi={sesi}
        />
      ) : null}
    </Modal>
  );
}

function IsiModalSesi({
  namaKelas,
  lab,
  sesi,
  onTutup,
  onSimpan,
}: Omit<ModalSesiProps, 'visible'>) {
  const tema = useTheme();
  const modeEdit = Boolean(sesi);

  const [tanggal, setTanggal] = useState(sesi?.tanggal ?? '');
  const [jamMulai, setJamMulai] = useState(sesi?.jamMulai ?? '');
  const [jamSelesai, setJamSelesai] = useState(sesi?.jamSelesai ?? '');

  const [galat, setGalat] = useState<GalatField>({});
  const [pesanGalat, setPesanGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const hari = hariDariTanggal(tanggal);

  function periksaField(): GalatField {
    const berikut: GalatField = {};

    if (!tanggal) {
      berikut.tanggal = 'Tanggal praktikum wajib diisi.';
    } else if (!tanggalValid(tanggal)) {
      berikut.tanggal = 'Tanggal tidak valid.';
    }

    if (!jamMulai) {
      berikut.jamMulai = 'Jam mulai wajib diisi.';
    } else if (!jamValid(jamMulai)) {
      berikut.jamMulai = 'Gunakan format 24 jam, mis. 08:00.';
    }

    if (!jamSelesai) {
      berikut.jamSelesai = 'Jam selesai wajib diisi.';
    } else if (!jamValid(jamSelesai)) {
      berikut.jamSelesai = 'Gunakan format 24 jam, mis. 10:40.';
    }

    if (
      !berikut.jamMulai &&
      !berikut.jamSelesai &&
      jamMulai >= jamSelesai
    ) {
      berikut.jamSelesai = 'Jam selesai harus setelah jam mulai.';
    }

    return berikut;
  }

  async function simpan() {
    setPesanGalat('');

    const galatField = periksaField();
    setGalat(galatField);

    if (Object.keys(galatField).length > 0) return;

    const validasi = validasiWaktuSesi({
      hari,
      tanggal,
      jamMulai,
      jamSelesai,
    });

    if (!validasi.ok) {
      setPesanGalat(validasi.pesan);
      return;
    }

    setMenyimpan(true);

    try {
      const hasil = await onSimpan({
        hari,
        tanggal,
        jamMulai,
        jamSelesai,
      });

      if (!hasil.ok) {
        setPesanGalat(hasil.pesan);
        setMenyimpan(false);
        return;
      }

      onTutup();
    } catch {
      setPesanGalat(
        'Perubahan gagal disimpan. Periksa koneksi lalu coba lagi.',
      );
      setMenyimpan(false);
    }
  }

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View
          className="w-full flex-1 self-center"
          style={{ maxWidth: MaxContentWidth }}
        >
          <Pressable
            accessibilityLabel="Kembali ke kelola sesi"
            accessibilityRole="button"
            onPress={onTutup}
            className="min-h-touch flex-row items-center gap-one px-three active:opacity-60"
          >
            <SymbolView
              name={{
                ios: 'chevron.left',
                android: 'arrow_back',
                web: 'arrow_back',
              }}
              size={18}
              tintColor={tema.text}
            />

            <Text className="text-small text-textSecondary">
              Kembali ke kelola sesi
            </Text>
          </Pressable>

          <ScrollView
            className="flex-1"
            contentContainerClassName="px-three pb-five"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text
              accessibilityRole="header"
              className="text-title font-semibold text-text"
            >
              {modeEdit ? 'Edit Sesi' : 'Tambah Sesi'}
            </Text>

            <Text className="mt-one text-small text-textSecondary">
              {namaKelas}
            </Text>

            {pesanGalat ? (
              <Banner
                className="mt-three"
                jenis="gagal"
                pesan={pesanGalat}
                onTutup={() => setPesanGalat('')}
              />
            ) : null}

            <View className="mt-four">
              <FieldTanggal
                disabled={menyimpan}
                error={galat.tanggal}
                onChange={setTanggal}
                nilai={tanggal}
              />
            </View>

            <View className="mt-four">
              <Text className="mb-two text-caption text-textSecondary">
                Laboratorium
              </Text>

              <Card tone="muted">
                <Text className="text-subtitle font-semibold text-text">
                  {lab}
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  Laboratorium mengikuti data kelas dan tidak dapat diubah
                  dari sini.
                </Text>
              </Card>
            </View>

            <View className="mt-four flex-row gap-two">
              <View className="flex-1">
                <FieldJam
                  disabled={menyimpan}
                  error={galat.jamMulai}
                  label="Jam Mulai"
                  onChange={setJamMulai}
                  nilai={jamMulai}
                />
              </View>

              <View className="flex-1">
                <FieldJam
                  disabled={menyimpan}
                  error={galat.jamSelesai}
                  label="Jam Selesai"
                  onChange={setJamSelesai}
                  nilai={jamSelesai}
                />
              </View>
            </View>

            <View className="mt-five flex-row gap-two">
              <View className="flex-1">
                <AppButton
                  disabled={menyimpan}
                  label="Batal"
                  onPress={onTutup}
                  variant="secondary"
                />
              </View>

              <View className="flex-1">
                <AppButton
                  disabled={menyimpan}
                  label={modeEdit ? 'Simpan Perubahan' : 'Simpan Sesi'}
                  loading={menyimpan}
                  onPress={() => {
                    void simpan();
                  }}
                />
              </View>
            </View>

            <Text className="mt-three text-caption text-textSecondary">
              Sesi yang sudah dibuka tidak dapat diubah.
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
