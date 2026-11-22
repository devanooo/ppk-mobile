import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  EmptyState,
  IconButton,
  Screen,
  StatusBadge,
  Skeleton,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

import {
  useRiwayatKehadiran,
  type RiwayatKehadiran,
} from '@/features/praktikan/use-riwayat-kehadiran';

function formatTanggal(tanggal: string): string {
  const date = new Date(`${tanggal}T00:00:00`);

  if (Number.isNaN(date.getTime())) return tanggal;

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatWaktuHadir(waktu: Date): string {
  return `${String(waktu.getHours()).padStart(2, '0')}.${String(
    waktu.getMinutes(),
  ).padStart(2, '0')} WIB`;
}

function formatTanggalWaktu(waktu: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(waktu);
}

export default function DetailRiwayatRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();

  const sesiId = Array.isArray(id) ? id[0] : id;

  const hasil = useRiwayatKehadiran(
    db,
    user?.peran === 'praktikan' ? user.id : undefined,
  );

  if (!user || !sesiId) return null;

    function kembali() {
    if (router.canGoBack()) {
        router.back();
    } else {
        router.replace('/(praktikan)/riwayat');
    }
    }

  const riwayat = hasil.riwayat.find(
    (item) => item.sesi.id === sesiId,
  );

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <View className="flex-row items-center px-three pt-two">
          <IconButton
            ikon={
              <SymbolView
                name={{
                  ios: 'arrow.left',
                  android: 'arrow_back',
                  web: 'arrow_back',
                }}
                size={20}
                tintColor="#172554"
              />
            }
            label="Kembali"
            onPress={kembali}
            variant="filled"
          />
        </View>

        {hasil.status === 'memuat' ? (
          <View className="gap-three px-three pt-four">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </View>
        ) : hasil.status === 'gagal' ? (
          <View className="px-three pt-four">
            <EmptyState
              judul="Riwayat gagal dimuat"
              deskripsi={
                hasil.pesanGalat ??
                'Periksa koneksi internet dan coba kembali.'
              }
            />
          </View>
        ) : !riwayat ? (
          <View className="px-three pt-four">
            <EmptyState
              judul="Riwayat tidak ditemukan"
              deskripsi="Catatan kehadiran ini tidak tersedia atau sudah tidak dapat diakses."
            />
          </View>
        ) : (
            <IsiDetailRiwayat
            riwayat={riwayat}
            onLihatRiwayat={() => router.replace('/(praktikan)/riwayat')}
            onKembaliKeJadwal={() => router.replace('/(praktikan)/jadwal')}
            />
        )}
      </View>
    </Screen>
  );
}

function IsiDetailRiwayat({
  riwayat,
  onLihatRiwayat,
  onKembaliKeJadwal,
}: {
  riwayat: RiwayatKehadiran;
  onLihatRiwayat: () => void;
  onKembaliKeJadwal: () => void;
}) {
  const theme = useTheme();
  const { sesi, status, waktu, izin, minggu } = riwayat;

  const alasanIzin = (
    riwayat as RiwayatKehadiran & { alasanIzin?: string }
  ).alasanIzin;

  const konfigurasi = {
    hadir: {
      judul: 'Kehadiranmu tercatat.',
      deskripsi: 'Kamu sudah hadir untuk sesi ini.',
      ikon: 'checkmark.circle.fill',
      warna: theme.success,
      badge: 'Hadir',
      tone: 'success',
    },
    izin: {
      judul: 'Pengajuan izin tercatat.',
      deskripsi: 'Pengajuan izinmu sudah tersimpan.',
      ikon: 'clock.fill',
      warna: theme.warning,
      badge: 'Izin',
      tone: 'warning',
    },
    'tidak-hadir': {
      judul: 'Kamu tidak hadir.',
      deskripsi: 'Tidak ada kehadiran atau izin yang berlaku untuk sesi ini.',
      ikon: 'exclamationmark.circle.fill',
      warna: theme.danger,
      badge: 'Tidak hadir',
      tone: 'danger',
    },
  } as const;

  const konfigurasiStatus = konfigurasi[status];

  const statusPersetujuan = {
    menunggu: 'Menunggu persetujuan asisten',
    disetujui: 'Izin disetujui asisten',
    ditolak: 'Izin ditolak asisten',
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-three pb-four"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mt-four text-title font-semibold text-primary">
          {konfigurasiStatus.judul}
        </Text>

        <Text className="mt-one text-small text-textSecondary">
          {konfigurasiStatus.deskripsi}
        </Text>

        <View className="mt-four h-16 w-16 items-center justify-center rounded-full bg-backgroundSelected">
          <SymbolView
            name={{
              ios: konfigurasiStatus.ikon,
              android:
                status === 'hadir'
                  ? 'check_circle'
                  : status === 'izin'
                    ? 'schedule'
                    : 'error_outline',
              web:
                status === 'hadir'
                  ? 'check_circle'
                  : status === 'izin'
                    ? 'schedule'
                    : 'error_outline',
            }}
            size={28}
            tintColor={konfigurasiStatus.warna}
          />
        </View>

        <Text className="mt-four text-subtitle font-semibold text-primary">
          {sesi.namaKelas}
        </Text>

        <Text className="mt-two text-small text-textSecondary">
          Praktikum minggu ke-{minggu}
        </Text>

        <View className="my-four h-px bg-border" />

        {/* Jika hadir: tampilkan waktu tercatat sebagai baris pertama */}
        {status === 'hadir' && waktu ? (
          <BarisInformasi
            ikon="clock"
            label={`Tercatat pukul ${formatWaktuHadir(waktu)}`}
            sublabel={formatTanggalWaktu(waktu)}
          />
        ) : (
          <BarisInformasi
            ikon="calendar"
            label={formatTanggal(sesi.tanggal)}
          />
        )}

        <BarisInformasi
          ikon="location"
          label={sesi.lab}
        />

        <View className="mt-one self-start">
          <StatusBadge
            label={konfigurasiStatus.badge}
            tone={konfigurasiStatus.tone}
          />
        </View>

        {status === 'izin' ? (
          <View className="mt-three gap-two rounded-md bg-backgroundSelected p-three">
            <Text className="text-small font-semibold text-text">
              {izin
                ? statusPersetujuan[izin]
                : 'Status persetujuan belum tersedia'}
            </Text>

            {alasanIzin ? (
              <View className="gap-one">
                <Text className="text-caption text-textSecondary">
                  Alasan izin
                </Text>
                <Text className="text-body text-text">
                  {alasanIzin}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View className="gap-two px-three pb-four pt-two">
        <Pressable
          onPress={onLihatRiwayat}
          className="h-14 items-center justify-center rounded-full bg-primary"
          accessibilityRole="button"
        >
          <Text className="font-semibold text-primaryText">
            Lihat riwayat
          </Text>
        </Pressable>

        <Pressable
          onPress={onKembaliKeJadwal}
          className="h-14 items-center justify-center rounded-full border border-border"
          accessibilityRole="button"
        >
          <Text className="font-semibold text-primary">
            Kembali ke jadwal
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function BarisInformasi({
  ikon,
  label,
  sublabel,
}: {
  ikon: 'calendar' | 'clock' | 'location';
  label: string;
  sublabel?: string;
}) {
  const theme = useTheme();

  return (
    <View className="mb-three flex-row items-start gap-three">
      <View className="mt-0.5">
        <SymbolView
          name={{
            ios: ikon,
            android:
              ikon === 'calendar'
                ? 'calendar_today'
                : ikon === 'clock'
                  ? 'schedule'
                  : 'location_on',
            web:
              ikon === 'calendar'
                ? 'calendar_today'
                : ikon === 'clock'
                  ? 'schedule'
                  : 'location_on',
          }}
          size={19}
          tintColor={theme.primary}
        />
      </View>
      <View className="flex-1">
        <Text className="text-small font-medium text-text">{label}</Text>
        {sublabel ? (
          <Text className="mt-0.5 text-caption text-textSecondary">
            {sublabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}