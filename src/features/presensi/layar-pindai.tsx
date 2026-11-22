import { SymbolView } from 'expo-symbols';
import { ScrollView, Text, View } from 'react-native';

import { AppButton, IconButton, Screen, StatusBadge } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatTanggalPanjang, rentangJamTitik } from '@/features/praktikan/format-sesi';

import { DialogHasil, type JenisHasil } from './dialog-hasil';
import { PanelKamera } from './panel-kamera';

/** Status lokasi yang ditampilkan pada kartu lokasi, mengikuti referensi 03. */
export type StatusLokasi =
  | 'tidak-aktif'
  | 'mencari'
  | 'terdeteksi'
  | 'lab-dikenal';

type InfoSesi = {
  namaKelas: string;
  lab: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  status: 'belum-dibuka' | 'dibuka' | 'ditutup';
};

type LayarPindaiProps = {
  sesi: InfoSesi | null;
  izinKamera: boolean;
  memuatIzinKamera: boolean;
  bisaMintaKamera: boolean;
  statusLokasi: StatusLokasi;
  izinLokasi: boolean;
  bisaMintaLokasi: boolean;
  namaLabTerdeteksi?: string;
  koordinatTerdeteksi?: { latitude: number; longitude: number };
  senter: boolean;
  zoom: number;
  onPutarSenter: () => void;
  onTambahZoom: () => void;
  onKurangiZoom: () => void;
  onTerdeteksi: (teks: string) => void;
  terkunci: boolean;
  onMintaKamera: () => void;
  onMintaLokasi: () => void;
  onKembali: () => void;
  hasil: JenisHasil | null;
  onAksiHasil: () => void;
  onTutupHasil: () => void;
};

/** Strip status tepat di bawah panel kamera, mis. "Memindai QR Code...". */
function StripStatus({ teks }: { teks: string }) {
  return (
    <View
      accessibilityLiveRegion="polite"
      className="mt-three items-center rounded-md bg-surfaceMuted px-three py-twoHalf"
    >
      <Text className="text-small font-semibold text-text">{teks}</Text>
    </View>
  );
}

function KartuLokasi({
  statusLokasi,
  izinLokasi,
  namaLabTerdeteksi,
  koordinatTerdeteksi,
}: {
  statusLokasi: StatusLokasi;
  izinLokasi: boolean;
  namaLabTerdeteksi?: string;
  koordinatTerdeteksi?: { latitude: number; longitude: number };
}) {
  const tema = useTheme();

  const aktif = statusLokasi === 'terdeteksi' || statusLokasi === 'lab-dikenal';
  const labDikenal = statusLokasi === 'lab-dikenal';

  const judul = labDikenal
    ? (namaLabTerdeteksi ?? 'Lokasi terdeteksi')
    : statusLokasi === 'mencari'
      ? 'Mencari lokasi...'
      : aktif
        ? 'Lokasi terdeteksi'
        : 'Lokasi non-aktif';

  const keterangan = labDikenal
    ? koordinatTerdeteksi
      ? `${koordinatTerdeteksi.latitude.toFixed(6)}, ${koordinatTerdeteksi.longitude.toFixed(6)}`
      : 'Lokasi dalam radius laboratorium'
    : aktif
      ? 'Lokasi akan diperiksa terhadap radius laboratorium'
      : izinLokasi
        ? 'Menunggu sinyal GPS'
        : 'Akses lokasi diperlukan';

  const wadah = labDikenal
    ? 'border-success bg-successSurface'
    : aktif
      ? 'border-warning bg-warningSurface'
      : 'border-border bg-backgroundElement';

  return (
    <View className={`mt-three flex-row items-start gap-three rounded-md border p-three ${wadah}`}>
      <View className="pt-half">
        <SymbolView
          name={{
            ios: aktif ? 'location.fill' : 'location',
            android: aktif ? 'location_on' : 'location_off',
            web: aktif ? 'location_on' : 'location_off',
          }}
          size={20}
          tintColor={aktif ? tema.text : tema.textSecondary}
        />
      </View>

      <View className="flex-1 min-w-0">
        <View className="flex-row items-start justify-between gap-two">
          <Text className="flex-1 min-w-0 text-body font-semibold text-text">{judul}</Text>

          <View className="shrink-0">
            <StatusBadge
              label={aktif ? 'GPS aktif' : 'GPS non-aktif'}
              tone={aktif ? 'success' : 'danger'}
            />
          </View>
        </View>

        <Text className="mt-one text-small text-textSecondary">{keterangan}</Text>
      </View>
    </View>
  );
}

function KartuSesi({ sesi }: { sesi: InfoSesi }) {
  return (
    <View className="mt-three rounded-lg bg-surfaceMuted p-three">
      <Text className="text-body font-semibold text-text">{sesi.namaKelas}</Text>

      <Text className="mt-one text-small text-textSecondary">
        Praktikum · {sesi.lab || 'Lokasi belum diisi'}
      </Text>

      <Text className="mt-half text-small text-textSecondary">
        {formatTanggalPanjang(sesi.tanggal)} · {rentangJamTitik(sesi)} WIB
      </Text>
    </View>
  );
}

/**
 * Layar pemindai QR praktikan sesuai referensi 03-qr-scanner:
 * header, panel kamera, strip status, kartu lokasi, blok informasi,
 * kartu sesi, lalu satu tombol izin navy di bawah.
 */
export function LayarPindai({
  sesi,
  izinKamera,
  memuatIzinKamera,
  bisaMintaKamera,
  statusLokasi,
  izinLokasi,
  bisaMintaLokasi,
  namaLabTerdeteksi,
  koordinatTerdeteksi,
  senter,
  zoom,
  onPutarSenter,
  onTambahZoom,
  onKurangiZoom,
  onTerdeteksi,
  terkunci,
  onMintaKamera,
  onMintaLokasi,
  onKembali,
  hasil,
  onAksiHasil,
  onTutupHasil,
}: LayarPindaiProps) {
  const tema = useTheme();

  const butuhKamera = !izinKamera && !memuatIzinKamera;
  const butuhLokasi = !izinLokasi && statusLokasi === 'tidak-aktif';

  const strip = memuatIzinKamera
    ? 'Memeriksa izin kamera...'
    : butuhKamera
      ? 'Akses kamera diperlukan'
      : 'Memindai QR Code...';

  const judulInfo = butuhKamera
    ? 'Izin akses kamera'
    : butuhLokasi
      ? 'Izin akses lokasi'
      : 'Pindai QR Code';

  const deskripsiInfo = butuhKamera
    ? 'Aktifkan kamera untuk memindai QR Code presensi.'
    : butuhLokasi
      ? 'Aktifkan lokasi untuk memeriksa radius laboratorium.'
      : 'Arahkan kamera ke QR Code yang ditampilkan asisten.';

  const labelTombol = butuhKamera && butuhLokasi
    ? 'Izin kamera dan lokasi'
    : butuhKamera
      ? 'Izin kamera'
      : butuhLokasi
        ? 'Izin lokasi'
        : 'Memindai QR Code...';

  return (
    <Screen padded={false}>
      <View className="w-full flex-1 self-center" style={{ maxWidth: MaxContentWidth }}>
        <View className="w-full flex-row items-center gap-three px-three pt-two">
          <IconButton
            ikon={
              <SymbolView
                name={{ ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' }}
                size={20}
                tintColor={tema.primary}
              />
            }
            label="Kembali"
            onPress={onKembali}
            variant="filled"
          />

          <Text
            accessibilityRole="header"
            className="flex-1 text-subtitle font-semibold text-primary"
          >
            Scan QR Presensi
          </Text>
        </View>

        <ScrollView
          contentContainerClassName="w-full px-three pb-four"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-three">
            <PanelKamera
              izinDiberikan={izinKamera}
              memuatIzin={memuatIzinKamera}
              onKurangiZoom={onKurangiZoom}
              onPutarSenter={onPutarSenter}
              onTambahZoom={onTambahZoom}
              onTerdeteksi={onTerdeteksi}
              senter={senter}
              terkunci={terkunci}
              zoom={zoom}
            />
          </View>

          <StripStatus teks={strip} />

          <KartuLokasi
            izinLokasi={izinLokasi}
            koordinatTerdeteksi={koordinatTerdeteksi}
            namaLabTerdeteksi={namaLabTerdeteksi}
            statusLokasi={statusLokasi}
          />

          <Text className="mt-four text-body font-semibold text-text">{judulInfo}</Text>
          <Text className="mt-one text-small text-textSecondary">{deskripsiInfo}</Text>

          {sesi ? <KartuSesi sesi={sesi} /> : null}

          {butuhKamera || butuhLokasi ? (
            <View className="mt-four">
              <AppButton
                disabled={
                  (butuhKamera && !bisaMintaKamera) || (butuhLokasi && !bisaMintaLokasi)
                }
                disabledReason={
                  butuhKamera && !bisaMintaKamera
                    ? 'Izin kamera diblokir. Aktifkan lewat pengaturan perangkat.'
                    : butuhLokasi && !bisaMintaLokasi
                      ? 'Izin lokasi diblokir. Aktifkan lewat pengaturan perangkat.'
                      : undefined
                }
                label={labelTombol}
                onPress={() => {
                  if (butuhKamera) onMintaKamera();
                  if (butuhLokasi) onMintaLokasi();
                }}
              />
            </View>
          ) : null}

          {!sesi ? (
            <View className="mt-three">
              <Text className="text-small text-textSecondary">
                Buka layar pemindai dari detail sesi agar informasi sesi tampil.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <DialogHasil
        jenis={hasil}
        onAksi={onAksiHasil}
        onKembali={onTutupHasil}
      />
    </Screen>
  );
}

export type { InfoSesi, LayarPindaiProps };
