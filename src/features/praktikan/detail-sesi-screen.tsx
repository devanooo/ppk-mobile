import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  EmptyState,
  IconButton,
  Screen,
  Skeleton,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { formatTanggalPanjang, rentangJamTitik } from './format-sesi';
import type { DetailSesiPraktikan } from './use-detail-sesi-praktikan';

type StatusMuat = 'memuat' | 'siap' | 'gagal';

type DetailSesiScreenProps = {
  sesi: DetailSesiPraktikan | null;
  waktuHadir?: Date;
  status: StatusMuat;
  pesanGalat?: string;
  onKembali: () => void;
  /**
   * Dihubungkan ke route pemindai QR saat fitur itu tersedia. Selama belum
   * ada, tombol scan tampil nonaktif dengan alasan yang terlihat.
   */
  onScanQr?: () => void;
  onAjukanIzin?: () => void;
  profil?: ReactNode;
};

function formatJam(waktu: Date): string {
  return `${String(waktu.getHours()).padStart(2, '0')}.${String(
    waktu.getMinutes(),
  ).padStart(2, '0')}`;
}

export function DetailSesiScreen({
  sesi,
  waktuHadir,
  status,
  pesanGalat,
  onKembali,
  onScanQr,
  onAjukanIzin,
  profil,
}: DetailSesiScreenProps) {
  const theme = useTheme();

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <View className="flex-row items-center justify-between px-three pt-two">
          <IconButton
            ikon={
              <SymbolView
                name={{
                  ios: 'arrow.left',
                  android: 'arrow_back',
                  web: 'arrow_back',
                }}
                size={20}
                tintColor={theme.primary}
              />
            }
            label="Kembali"
            onPress={onKembali}
            variant="filled"
          />
          {profil}
        </View>

        {status === 'memuat' ? (
          <MemuatDetail />
        ) : status === 'gagal' ? (
          <GagalDetail pesan={pesanGalat} />
        ) : sesi ? (
          <IsiDetail
            onAjukanIzin={onAjukanIzin}
            onScanQr={onScanQr}
            sesi={sesi}
            waktuHadir={waktuHadir}
          />
        ) : (
          <View className="px-three pt-four">
            <EmptyState
              deskripsi="Jadwal sesi ini mungkin sudah dihapus atau tidak tersedia."
              judul="Sesi tidak ditemukan"
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

function IsiDetail({
  sesi,
  waktuHadir,
  onScanQr,
  onAjukanIzin,
}: {
  sesi: DetailSesiPraktikan;
  waktuHadir?: Date;
  onScanQr?: () => void;
  onAjukanIzin?: () => void;
}) {
  const theme = useTheme();
  const sudahHadir = Boolean(waktuHadir);

  const alasanSesi =
    sesi.status === 'belum-dibuka'
      ? 'Sesi belum dibuka'
      : sesi.status === 'ditutup'
        ? 'Sesi sudah ditutup'
        : undefined;

  const keteranganPresensi = waktuHadir
    ? `Presensi tercatat pukul ${formatJam(waktuHadir)}`
    : sesi.status === 'dibuka'
      ? 'Pencatatan kehadiran dibuka'
      : sesi.status === 'belum-dibuka'
        ? 'Pencatatan kehadiran belum dibuka'
        : 'Pencatatan kehadiran ditutup';

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerClassName="px-three pb-five"
        showsVerticalScrollIndicator={false}
      >
        <Text
          accessibilityRole="header"
          className="mt-three text-title font-semibold text-primary"
        >
          {sesi.namaKelas}
        </Text>

        <StatusBadge className="mt-three" status={sesi.status} />

        <View className="mt-four gap-three">
          <BarisMeta
            ikon={
              <SymbolView
                name={{
                  ios: 'calendar',
                  android: 'calendar_today',
                  web: 'calendar_today',
                }}
                size={20}
                tintColor={theme.primary}
              />
            }
            nilai={formatTanggalPanjang(sesi.tanggal)}
          />

          <BarisMeta
            keterangan={keteranganPresensi}
            tebal
            ikon={
              <SymbolView
                name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                size={20}
                tintColor={theme.primary}
              />
            }
            nilai={rentangJamTitik(sesi)}
          />

          <BarisMeta
            tebal
            ikon={
              <SymbolView
                name={{
                  ios: 'mappin.and.ellipse',
                  android: 'location_on',
                  web: 'location_on',
                }}
                size={20}
                tintColor={theme.primary}
              />
            }
            nilai={sesi.lab || 'Lokasi belum diisi'}
          />
        </View>
      </ScrollView>

      <View className="px-three pb-three pt-two">
        {sudahHadir ? (
          <StatusHadir waktu={waktuHadir} />
        ) : (
          <View className="gap-twoHalf">
            {onScanQr ? (
              <AppButton
                disabled={Boolean(alasanSesi)}
                disabledReason={alasanSesi}
                label="Scan QR untuk presensi"
                onPress={onScanQr}
              />
            ) : (
              <TombolScanNonaktif />
            )}

            {onAjukanIzin ? (
              <AppButton
                label="Ajukan izin"
                onPress={onAjukanIzin}
                variant="secondary"
              />
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

function BarisMeta({
  ikon,
  nilai,
  keterangan,
  tebal = false,
}: {
  ikon: ReactNode;
  nilai: string;
  keterangan?: string;
  tebal?: boolean;
}) {
  return (
    <View className="flex-row items-start gap-three">
      <View className="pt-half">{ikon}</View>

      <View className="flex-1">
        <Text
          className={`text-body text-text ${tebal ? 'font-semibold' : ''}`}
        >
          {nilai}
        </Text>

        {keterangan ? (
          <Text className="mt-half text-small text-textSecondary">
            {keterangan}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function TombolScanNonaktif() {
  return (
    <View>
      <View
        accessible
        accessibilityLabel="Scan QR untuk presensi. Fitur scan QR belum tersedia."
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        className="min-h-button items-center justify-center rounded-pill border border-border bg-backgroundElement"
      >
        <Text className="text-body font-semibold text-textSecondary">
          Scan QR untuk presensi
        </Text>
      </View>

      <Text className="mt-two text-center text-caption text-textSecondary">
        Fitur scan QR belum tersedia
      </Text>
    </View>
  );
}

function StatusHadir({ waktu }: { waktu?: Date }) {
  const theme = useTheme();

  const keterangan = waktu
    ? `Presensi tercatat pukul ${formatJam(waktu)}.`
    : 'Presensi tercatat untuk sesi ini.';

  return (
    <View
      accessible
      accessibilityLabel={`Sudah hadir. ${keterangan}`}
      className="min-h-touch flex-row items-center gap-two rounded-md border border-success bg-successSurface px-three py-two"
    >
      <SymbolView
        name={{
          ios: 'checkmark.circle.fill',
          android: 'check_circle',
          web: 'check_circle',
        }}
        size={20}
        tintColor={theme.success}
      />

      <View className="flex-1">
        <Text className="text-body font-semibold text-text">
          Sudah hadir
        </Text>
        <Text className="mt-half text-small text-text">
          {keterangan}
        </Text>
      </View>
    </View>
  );
}

function MemuatDetail() {
  return (
    <View className="px-three pt-four">
      <Skeleton baris={2} accessibilityLabel="Memuat detail sesi" />
      <Skeleton baris={3} className="mt-five" />
    </View>
  );
}

function GagalDetail({ pesan }: { pesan?: string }) {
  const theme = useTheme();

  return (
    <View className="px-three pt-four">
      <EmptyState
        deskripsi={
          pesan ?? 'Terjadi kesalahan saat mengambil data sesi.'
        }
        ikon={
          <SymbolView
            name={{
              ios: 'exclamationmark.triangle',
              android: 'error_outline',
              web: 'error_outline',
            }}
            size={32}
            tintColor={theme.danger}
          />
        }
        judul="Gagal memuat sesi"
        tone="gagal"
      />
    </View>
  );
}

export type { DetailSesiScreenProps };
