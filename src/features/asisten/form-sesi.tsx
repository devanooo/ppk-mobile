import DateTimePicker from '@react-native-community/datetimepicker';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AppButton, Banner, Card } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import {
  kosongkanPilihanLaboratorium,
  labDariSesi,
  usePilihanLaboratorium,
  type LabTerpilih,
} from '@/features/maps/pemilihan-lab';
import { useTheme } from '@/hooks/use-theme';
import {
  validasiWaktuSesi,
  type DataLabSesi,
  type HasilAksiSesi,
  type SesiFirestore,
} from '@/lib/sesi';

import { FieldJam } from './field-jam';
import { FieldTanggal } from './field-tanggal';
import {
  dariTanggalJam,
  dariTanggalPicker,
  hariDariTanggal,
  jamValid,
  keTanggalJam,
  keTanggalPicker,
  tanggalValid,
} from './format-edit-sesi';

export type DataSesiForm = {
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
} & DataLabSesi;

type GalatField = {
  tanggal?: string;
  jamMulai?: string;
  jamSelesai?: string;
};

type PickerAktif = 'tanggal' | 'mulai' | 'selesai' | null;

type FormSesiProps = {
  namaKelas: string;
  lab: string;
  labAwal?: LabTerpilih | null;
  /** `null` berarti mode tambah sesi. */
  sesi?: SesiFirestore | null;
  onSimpan: (data: DataSesiForm) => Promise<HasilAksiSesi>;
  onBatal: () => void;
  /** Dipanggil setelah simpan berhasil; route melakukan navigasi. */
  onSelesai: () => void;
  onPilihDiMaps: () => void;
};

export function FormSesi({
  namaKelas,
  lab,
  labAwal,
  sesi,
  onSimpan,
  onBatal,
  onSelesai,
  onPilihDiMaps,
}: FormSesiProps) {
  const tema = useTheme();
  const modeEdit = Boolean(sesi);

  const [tanggal, setTanggal] = useState(sesi?.tanggal ?? '');
  const [jamMulai, setJamMulai] = useState(sesi?.jamMulai ?? '');
  const [jamSelesai, setJamSelesai] = useState(sesi?.jamSelesai ?? '');
  const [pickerAktif, setPickerAktif] = useState<PickerAktif>(null);

  const [galat, setGalat] = useState<GalatField>({});
  const [pesanGalat, setPesanGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const pilihanDariMaps = usePilihanLaboratorium();
  const labTerpilih = pilihanDariMaps ?? labDariSesi(sesi);

  useEffect(() => {
    return () => {
      kosongkanPilihanLaboratorium();
    };
  }, []);

  const hari = hariDariTanggal(tanggal);
  const labTampil = labTerpilih ?? labAwal ?? null;

  function bukaPicker(jenis: Exclude<PickerAktif, null>) {
    setPickerAktif((aktif) => (aktif === jenis ? null : jenis));
  }

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
      const data: DataSesiForm = {
        hari,
        tanggal,
        jamMulai,
        jamSelesai,
      };

      if (labTerpilih) {
        data.labId = labTerpilih.id;
        data.labNama = labTerpilih.nama;
        data.labLatitude = labTerpilih.latitude;
        data.labLongitude = labTerpilih.longitude;
        data.labRadiusMeters = labTerpilih.radiusMeters;
      }

      const hasil = await onSimpan(data);

      if (!hasil.ok) {
        setPesanGalat(hasil.pesan);
        setMenyimpan(false);
        return;
      }

      onSelesai();
    } catch {
      setPesanGalat(
        'Perubahan gagal disimpan. Periksa koneksi lalu coba lagi.',
      );
      setMenyimpan(false);
    }
  }

  return (
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
          onPress={onBatal}
          className="min-h-touch flex-row items-center gap-one px-three active:opacity-60"
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
            Kembali ke kelola sesi
          </Text>
        </Pressable>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-three pb-five pt-three"
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

          <View className="mt-four">
            <FieldTanggal
              aktif={pickerAktif === 'tanggal'}
              disabled={menyimpan}
              error={galat.tanggal}
              onBuka={() => bukaPicker('tanggal')}
              onChange={setTanggal}
              nilai={tanggal}
            />

            {pickerAktif === 'tanggal' && Platform.OS !== 'web' ? (
              <View className="-mx-three mt-two overflow-hidden">
                <DateTimePicker
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  mode="date"
                  onChange={(peristiwa, dipilih) => {
                    if (Platform.OS !== 'ios') setPickerAktif(null);

                    if (peristiwa.type === 'set' && dipilih) {
                      setTanggal(dariTanggalPicker(dipilih));
                    }
                  }}
                  style={{ width: '100%' }}
                  value={keTanggalPicker(tanggal)}
                />

                {Platform.OS === 'ios' ? (
                  <TombolSelesaiPicker
                    label="tanggal"
                    onPress={() => setPickerAktif(null)}
                  />
                ) : null}
              </View>
            ) : null}
          </View>

          <View className="mt-four">
            <Text className="mb-two text-small font-medium text-text">
              Laboratorium
            </Text>

            <Card tone="muted">
              <View className="flex-row items-center justify-between gap-two">
                <Text className="flex-1 text-body font-semibold text-text">
                  {labTampil?.nama ?? lab}
                </Text>

                <Pressable
                  accessibilityLabel="Pilih laboratorium di Maps"
                  accessibilityRole="button"
                  accessibilityState={{ disabled: menyimpan }}
                  disabled={menyimpan}
                  onPress={onPilihDiMaps}
                  className="min-h-touch flex-row items-center justify-center rounded-pill border border-border bg-backgroundElement px-three active:opacity-60"
                >
                  <Text className="text-small font-medium text-text">
                    Pilih di Maps
                  </Text>
                </Pressable>
              </View>

              <Text className="mt-two text-small text-textSecondary">
                {labTerpilih
                  ? 'Laboratorium dipilih dari Maps dan dipakai untuk sesi ini.'
                  : 'Laboratorium mengikuti data kelas. Pilih di Maps untuk menggantinya.'}
              </Text>

              <Text className="mt-one text-caption text-textSecondary">
                {labTampil
                  ? `Radius laboratorium: ${labTampil.radiusMeters} meter.`
                  : 'Radius laboratorium belum tersedia.'}
              </Text>
            </Card>
          </View>

          <View className="mt-four flex-row gap-two">
            <View className="flex-1">
              <FieldJam
                aktif={pickerAktif === 'mulai'}
                disabled={menyimpan}
                error={galat.jamMulai}
                label="Jam Mulai"
                onBuka={() => bukaPicker('mulai')}
                onChange={setJamMulai}
                nilai={jamMulai}
              />
            </View>

            <View className="flex-1">
              <FieldJam
                aktif={pickerAktif === 'selesai'}
                disabled={menyimpan}
                error={galat.jamSelesai}
                label="Jam Selesai"
                onBuka={() => bukaPicker('selesai')}
                onChange={setJamSelesai}
                nilai={jamSelesai}
              />
            </View>
          </View>

          {pickerAktif === 'mulai' && Platform.OS !== 'web' ? (
            <PemilihJam
              label="jam mulai"
              nilai={jamMulai}
              onPilih={setJamMulai}
              onTutup={() => setPickerAktif(null)}
            />
          ) : null}

          {pickerAktif === 'selesai' && Platform.OS !== 'web' ? (
            <PemilihJam
              label="jam selesai"
              nilai={jamSelesai}
              onPilih={setJamSelesai}
              onTutup={() => setPickerAktif(null)}
            />
          ) : null}

          {pesanGalat ? (
            <Banner
              className="mt-four"
              jenis="gagal"
              pesan={pesanGalat}
              onTutup={() => setPesanGalat('')}
            />
          ) : null}

          <View className="mt-five flex-row gap-two">
            <View className="w-24">
              <AppButton
                disabled={menyimpan}
                label="Batal"
                onPress={onBatal}
                size="sm"
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
                size="sm"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function TombolSelesaiPicker({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Tutup pemilih ${label}`}
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-touch items-end justify-center px-three active:opacity-60"
    >
      <Text className="text-small font-semibold text-primary">Selesai</Text>
    </Pressable>
  );
}

function PemilihJam({
  label,
  nilai,
  onPilih,
  onTutup,
}: {
  label: string;
  nilai: string;
  onPilih: (jam: string) => void;
  onTutup: () => void;
}) {
  return (
    <View className="-mx-three mt-two overflow-hidden">
      <DateTimePicker
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        is24Hour
        mode="time"
        onChange={(peristiwa, waktu) => {
          if (Platform.OS !== 'ios') onTutup();

          if (peristiwa.type === 'set' && waktu) {
            onPilih(dariTanggalJam(waktu));
          }
        }}
        style={{ width: '100%' }}
        value={keTanggalJam(nilai)}
      />

      {Platform.OS === 'ios' ? (
        <TombolSelesaiPicker label={label} onPress={onTutup} />
      ) : null}
    </View>
  );
}