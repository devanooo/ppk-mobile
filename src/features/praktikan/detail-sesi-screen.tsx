
import { SymbolView } from 'expo-symbols';
import { useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  BottomSheet,
  Card,
  EmptyState,
  HomeButton,
  Screen,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { HasilAksiPresensi } from '@/lib/presensi';
import type { User } from '@/types';

import type { DetailSesiPraktikan } from './use-detail-sesi-praktikan';

type StatusMuat = 'memuat' | 'siap' | 'gagal';

type DetailSesiScreenProps = {
  sesi: DetailSesiPraktikan | null;
  praktikan: User;
  waktuHadir?: Date;
  status: StatusMuat;
  pesanGalat?: string;
  onCatatKehadiran: () => Promise<HasilAksiPresensi>;
  onKembali: () => void;
  profil?: ReactNode;
};

type UmpanBalik = {
  jenis: 'sukses' | 'gagal';
  pesan: string;
};

function formatTanggal(tanggal: string): string {
  const [tahun, bulan, hari] = tanggal.split('-').map(Number);

  if (!tahun || !bulan || !hari) return tanggal;

  const waktu = new Date(tahun, bulan - 1, hari);

  return waktu.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatJam(waktu?: Date): string {
  if (!waktu || Number.isNaN(waktu.getTime())) return '-';

  return waktu.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DetailSesiScreen({
  sesi,
  praktikan,
  waktuHadir,
  status,
  pesanGalat,
  onCatatKehadiran,
  onKembali,
  profil,
}: DetailSesiScreenProps) {
  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerClassName="pb-five"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full self-center px-three"
          style={{ maxWidth: MaxContentWidth }}
        >
          <View className="flex-row items-center justify-between gap-two pt-two">
            <HomeButton onPress={onKembali} />
            {profil}
          </View>

          {status === 'memuat' ? (
            <View className="pt-four">
              <EmptyState
                judul="Memuat detail sesi"
                deskripsi="Sedang mengambil data sesi dari server."
              />
            </View>
          ) : status === 'gagal' ? (
            <View className="pt-four">
              <EmptyState
                judul="Gagal memuat sesi"
                deskripsi={
                  pesanGalat ??
                  'Terjadi kesalahan saat mengambil data sesi.'
                }
              />
            </View>
          ) : sesi ? (
            <DetailSesi
              sesi={sesi}
              praktikan={praktikan}
              waktuHadir={waktuHadir}
              onCatatKehadiran={onCatatKehadiran}
            />
          ) : (
            <View className="pt-four">
              <EmptyState
                judul="Sesi tidak ditemukan"
                deskripsi="Jadwal sesi ini mungkin sudah dihapus atau tidak tersedia."
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function DetailSesi({
  sesi,
  praktikan,
  waktuHadir,
  onCatatKehadiran,
}: {
  sesi: DetailSesiPraktikan;
  praktikan: User;
  waktuHadir?: Date;
  onCatatKehadiran: () => Promise<HasilAksiPresensi>;
}) {
  const [konfirmasiTerbuka, setKonfirmasiTerbuka] = useState(false);
  const [umpanBalik, setUmpanBalik] = useState<UmpanBalik | null>(null);
  const [sedangMencatat, setSedangMencatat] = useState(false);

  const sudahHadir = Boolean(waktuHadir);
  const bisaPresensi = sesi.status === 'dibuka' && !sudahHadir;

  const alasanNonaktif =
    sesi.status === 'belum-dibuka'
      ? 'Sesi belum dibuka'
      : sesi.status === 'ditutup'
        ? 'Sesi sudah ditutup'
        : undefined;

  async function catatKehadiran() {
    if (sedangMencatat) return;

    setSedangMencatat(true);

    try {
      const hasil = await onCatatKehadiran();

      setKonfirmasiTerbuka(false);
      setUmpanBalik({
        jenis: hasil.ok ? 'sukses' : 'gagal',
        pesan: hasil.pesan,
      });
    } catch {
      setKonfirmasiTerbuka(false);
      setUmpanBalik({
        jenis: 'gagal',
        pesan: 'Terjadi kesalahan saat mencatat presensi.',
      });
    } finally {
      setSedangMencatat(false);
    }
  }

  return (
    <View className="pt-three">
      <Text
        accessibilityRole="header"
        className="text-title font-semibold text-text"
      >
        {sesi.namaKelas}
      </Text>

      <StatusBadge className="mt-two" status={sesi.status} />

      <Card className="mt-four">
        <BarisInfo
          label="Jadwal"
          nilai={formatTanggal(sesi.tanggal)}
        />
        <BarisInfo
          garis
          label="Hari"
          nilai={sesi.hari}
        />
        <BarisInfo
          garis
          label="Waktu"
          nilai={`${sesi.jamMulai}–${sesi.jamSelesai}`}
        />
        <BarisInfo
          garis
          label="Kelas"
          nilai={sesi.namaKelas}
        />
        <BarisInfo
          garis
          label="Lab"
          nilai={sesi.lab || '-'}
        />

        {sesi.dibukaPada ? (
          <BarisInfo
            garis
            label="Dibuka"
            nilai={`Pukul ${formatJam(sesi.dibukaPada)}`}
          />
        ) : null}

        {sesi.ditutupPada ? (
          <BarisInfo
            garis
            label="Ditutup"
            nilai={`Pukul ${formatJam(sesi.ditutupPada)}`}
          />
        ) : null}
      </Card>

      <View className="mt-four gap-two">
        {umpanBalik ? (
          <Banner
            jenis={umpanBalik.jenis}
            onTutup={() => setUmpanBalik(null)}
            pesan={umpanBalik.pesan}
          />
        ) : null}

        {sudahHadir ? (
          <StatusHadir waktu={waktuHadir} />
        ) : (
          <AppButton
            disabled={!bisaPresensi || sedangMencatat}
            disabledReason={alasanNonaktif}
            label={
              sedangMencatat
                ? 'Mencatat presensi...'
                : 'Catat Kehadiran'
            }
            onPress={() => {
              setUmpanBalik(null);
              setKonfirmasiTerbuka(true);
            }}
          />
        )}
      </View>

      <BottomSheet
        deskripsi="Kehadiran hanya dapat dicatat satu kali untuk sesi ini."
        judul="Catat kehadiran?"
        labelBatal="Batal"
        labelKonfirmasi={
          sedangMencatat ? 'Mencatat...' : 'Konfirmasi'
        }
        onClose={() => {
          if (!sedangMencatat) {
            setKonfirmasiTerbuka(false);
          }
        }}
        onKonfirmasi={() => {
          void catatKehadiran();
        }}
        visible={konfirmasiTerbuka}
      >
        <View className="rounded-md bg-backgroundSelected px-three py-twoHalf">
          <Text className="text-body font-semibold text-text">
            {sesi.namaKelas}
          </Text>
          <Text className="mt-one text-small text-textSecondary">
            {praktikan.nama} · {praktikan.nomorInduk}
          </Text>
        </View>
      </BottomSheet>
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
        name={{ ios: 'checkmark.circle.fill', android: 'check_circle' }}
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

function BarisInfo({
  label,
  nilai,
  garis = false,
}: {
  label: string;
  nilai: string;
  garis?: boolean;
}) {
  return (
    <View
      className={`flex-row items-start justify-between gap-three py-two ${
        garis ? 'border-t border-border' : ''
      }`}
    >
      <Text className="text-small text-textSecondary">
        {label}
      </Text>
      <Text className="flex-1 text-right text-body text-text">
        {nilai}
      </Text>
    </View>
  );
}
