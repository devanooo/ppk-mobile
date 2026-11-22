import { SymbolView } from 'expo-symbols';
import { Modal, Pressable, Text, View } from 'react-native';

import { AppButton } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';

export type JenisHasil =
  | 'berhasil'
  | 'di-luar-radius'
  | 'qr-tidak-valid'
  | 'presensi-tidak-valid'
  | 'sudah-presensi'
  | 'gagal-simpan';

type KonfigurasiHasil = {
  judul: string;
  deskripsi: string;
  labelAksi: string;
  /** `netral` dipakai saat aksi hanya menutup dialog, bukan mengulang pindai. */
  jenisAksi: 'utama' | 'netral';
  ikon: 'sukses' | 'bahaya' | 'peringatan';
};

/**
 * Teks dan ikon mengikuti referensi 04-qr-validation apa adanya.
 * Warna memakai token yang sudah ada: success/danger/warning + permukaannya.
 */
const HASIL: Record<JenisHasil, KonfigurasiHasil> = {
  berhasil: {
    judul: 'Validasi Berhasil',
    deskripsi: 'QR Code valid dan lokasi sesuai radius laboratorium.',
    labelAksi: 'Lanjutkan',
    jenisAksi: 'utama',
    ikon: 'sukses',
  },
  'di-luar-radius': {
    judul: 'Di Luar Radius Laboratorium',
    deskripsi: 'Lokasi berada di luar area Lab B, C, D, atau AP.',
    labelAksi: 'Coba Lagi',
    jenisAksi: 'utama',
    ikon: 'bahaya',
  },
  'qr-tidak-valid': {
    judul: 'QR Code Tidak Valid',
    deskripsi: 'QR Code tidak valid atau sudah kedaluwarsa.',
    labelAksi: 'Coba Lagi',
    jenisAksi: 'utama',
    ikon: 'peringatan',
  },
  'presensi-tidak-valid': {
    judul: 'Presensi Tidak Valid',
    deskripsi: 'QR Code tidak valid dan lokasi berada di luar radius presensi.',
    labelAksi: 'Coba Lagi',
    jenisAksi: 'utama',
    ikon: 'bahaya',
  },
  'sudah-presensi': {
    judul: 'Presensi Sudah Tercatat',
    deskripsi: 'Kamu sudah melakukan presensi pada sesi ini.',
    labelAksi: 'Kembali',
    jenisAksi: 'netral',
    ikon: 'peringatan',
  },
  'gagal-simpan': {
    judul: 'Presensi Gagal Disimpan',
    deskripsi: 'Periksa koneksi lalu coba lagi. Presensi belum tercatat.',
    labelAksi: 'Coba Lagi',
    jenisAksi: 'utama',
    ikon: 'bahaya',
  },
};

type DialogHasilProps = {
  jenis: JenisHasil | null;
  onAksi: () => void;
  onKembali: () => void;
};

function IkonHasil({ jenis }: { jenis: KonfigurasiHasil['ikon'] }) {
  const tema = useTheme();

  const gaya = {
    sukses: { wadah: 'bg-successSurface', warna: tema.success },
    bahaya: { wadah: 'bg-dangerSurface', warna: tema.danger },
    peringatan: { wadah: 'bg-warningSurface', warna: tema.warning },
  }[jenis];

  return (
    <View className={`h-24 w-24 items-center justify-center rounded-pill ${gaya.wadah}`}>
      <SymbolView
        name={{ ios: 'qrcode', android: 'qr_code_scanner', web: 'qr_code_scanner' }}
        size={40}
        tintColor={gaya.warna}
      />
    </View>
  );
}

/**
 * Dialog hasil validasi presensi. Tampil di tengah layar dengan scrim, satu
 * aksi utama navy, dan tautan "Kembali" di bawahnya — persis referensi 04.
 */
export function DialogHasil({ jenis, onAksi, onKembali }: DialogHasilProps) {
  const konfigurasi = jenis ? HASIL[jenis] : null;

  return (
    <Modal
      animationType="fade"
      onRequestClose={onKembali}
      statusBarTranslucent
      transparent
      visible={konfigurasi !== null}
    >
      <View className="flex-1 items-center justify-center px-four">
        <Pressable
          accessibilityLabel="Tutup dialog"
          accessibilityRole="button"
          className="absolute inset-0 bg-overlay/40"
          onPress={onKembali}
        />

        {konfigurasi ? (
          <View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            accessibilityViewIsModal
            className="w-full items-center rounded-xl bg-backgroundElement px-four py-five"
            style={{ maxWidth: 420 }}
          >
            <IkonHasil jenis={konfigurasi.ikon} />

            <Text className="mt-four text-center text-subtitle font-semibold text-text">
              {konfigurasi.judul}
            </Text>

            <Text className="mt-two text-center text-small text-textSecondary">
              {konfigurasi.deskripsi}
            </Text>

            <AppButton
              className="mt-five w-full"
              label={konfigurasi.labelAksi}
              onPress={onAksi}
              variant={konfigurasi.jenisAksi === 'netral' ? 'secondary' : 'primary'}
            />

            {konfigurasi.jenisAksi === 'netral' ? null : (
              <Pressable
                accessibilityLabel="Kembali"
                accessibilityRole="button"
                onPress={onKembali}
                className="mt-three min-h-touch items-center justify-center px-four active:scale-95"
              >
                <Text className="text-body text-textSecondary">Kembali</Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

export type { DialogHasilProps };
