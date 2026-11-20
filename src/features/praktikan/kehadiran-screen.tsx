import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import {
  EmptyState,
  Screen,
  Skeleton,
  StatusBadge,
  teksKosong,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { formatTanggal } from './format-sesi';
import type {
  PraktikumRiwayat,
  RiwayatKehadiran,
  StatusKehadiran,
} from './use-riwayat-kehadiran';

type KehadiranScreenProps = {
  riwayat: RiwayatKehadiran[];
  praktikum: PraktikumRiwayat[];
  profil?: ReactNode;
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
};

const GAYA_STATUS: Record<
  StatusKehadiran,
  { label: string; tone: 'success' | 'neutral' | 'danger' }
> = {
  hadir: { label: 'Hadir', tone: 'success' },
  izin: { label: 'Izin', tone: 'neutral' },
  'tidak-hadir': { label: 'Tidak hadir', tone: 'danger' },
};

export function KehadiranScreen({
  riwayat,
  praktikum,
  profil,
  status,
  pesanGalat,
}: KehadiranScreenProps) {
  const [filter, setFilter] = useState<PraktikumRiwayat | null>(null);
  const [filterTerbuka, setFilterTerbuka] = useState(false);

  const opsiPraktikum = useMemo(() => {
    const peta = new Map<string, string>();

    for (const item of praktikum) {
      peta.set(item.id, item.nama);
    }

    if (peta.size === 0) {
      for (const item of riwayat) {
        peta.set(item.sesi.kelasId, item.sesi.namaKelas);
      }
    }

    return Array.from(peta.entries())
      .map(([id, nama]) => ({ id, nama }))
      .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
  }, [praktikum, riwayat]);

  const riwayatTampil = useMemo(
    () =>
      filter
        ? riwayat.filter((item) => item.sesi.kelasId === filter.id)
        : riwayat,
    [filter, riwayat],
  );

  function pilihFilter(opsi: PraktikumRiwayat | null) {
    setFilter(opsi);
    setFilterTerbuka(false);
  }

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={riwayatTampil}
          keyExtractor={(item) => item.sesi.id}
          contentContainerClassName="pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <BagianAtas
              filter={filter}
              filterTerbuka={filterTerbuka}
              onPilihFilter={pilihFilter}
              onToggleFilter={() =>
                setFilterTerbuka((terbuka) => !terbuka)
              }
              opsiPraktikum={opsiPraktikum}
              profil={profil}
            />
          }
          ListEmptyComponent={
            <KondisiKosong
              filter={filter}
              onResetFilter={() => pilihFilter(null)}
              pesanGalat={pesanGalat}
              status={status}
            />
          }
          ItemSeparatorComponent={PemisahRiwayat}
          renderItem={({ item }) => <BarisRiwayat item={item} />}
        />
      </View>
    </Screen>
  );
}

function BagianAtas({
  filter,
  filterTerbuka,
  opsiPraktikum,
  onPilihFilter,
  onToggleFilter,
  profil,
}: {
  filter: PraktikumRiwayat | null;
  filterTerbuka: boolean;
  opsiPraktikum: PraktikumRiwayat[];
  onPilihFilter: (opsi: PraktikumRiwayat | null) => void;
  onToggleFilter: () => void;
  profil?: ReactNode;
}) {
  const theme = useTheme();

  return (
    <View className="px-three pt-three">
      <View className="flex-row items-center justify-between gap-two">
        <Text
          className="flex-1 text-subtitle font-bold text-primary"
          numberOfLines={1}
        >
          PraktikumKU
        </Text>

        <View className="flex-row items-center gap-two">
          <View
            accessibilityElementsHidden
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            className="h-touch w-touch items-center justify-center"
          >
            <SymbolView
              name={{
                ios: 'bell',
                android: 'notifications_none',
                web: 'notifications_none',
              }}
              size={22}
              tintColor={theme.primary}
            />
          </View>

          <View className="rounded-pill bg-backgroundSelected px-two py-one">
            <Text className="text-caption font-medium text-primary">
              Praktikan
            </Text>
          </View>

          {profil}
        </View>
      </View>

      <Text
        accessibilityRole="header"
        className="mt-four text-title font-semibold text-primary"
      >
        {'Riwayat\nkehadiran.'}
      </Text>

      <Text className="mt-two text-small text-textSecondary">
        Rekap kehadiran di setiap praktikummu.
      </Text>

      <FilterPraktikum
        filter={filter}
        onPilih={onPilihFilter}
        onToggle={onToggleFilter}
        opsiPraktikum={opsiPraktikum}
        terbuka={filterTerbuka}
      />
    </View>
  );
}

function FilterPraktikum({
  filter,
  opsiPraktikum,
  terbuka,
  onToggle,
  onPilih,
}: {
  filter: PraktikumRiwayat | null;
  opsiPraktikum: PraktikumRiwayat[];
  terbuka: boolean;
  onToggle: () => void;
  onPilih: (opsi: PraktikumRiwayat | null) => void;
}) {
  const theme = useTheme();
  const label = filter?.nama ?? 'Semua praktikum';

  return (
    <View className="mt-four">
      <Pressable
        accessibilityLabel={`Filter praktikum. ${label}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: terbuka }}
        onPress={onToggle}
        className="min-h-button flex-row items-center justify-between gap-three rounded-md bg-backgroundSelected px-three active:opacity-60"
      >
        <Text
          className="flex-1 text-body font-medium text-text"
          numberOfLines={1}
        >
          {label}
        </Text>

        <SymbolView
          name={
            terbuka
              ? {
                  ios: 'chevron.up',
                  android: 'expand_less',
                  web: 'expand_less',
                }
              : {
                  ios: 'arrow.right',
                  android: 'arrow_forward',
                  web: 'arrow_forward',
                }
          }
          size={18}
          tintColor={theme.primary}
        />
      </Pressable>

      {terbuka ? (
        <View className="mt-two overflow-hidden rounded-md border border-border bg-backgroundElement">
          <OpsiFilter
            label="Semua praktikum"
            onPress={() => onPilih(null)}
            terpilih={filter === null}
          />

          {opsiPraktikum.map((opsi) => (
            <View key={opsi.id}>
              <View className="h-half bg-border" />
              <OpsiFilter
                label={opsi.nama}
                onPress={() => onPilih(opsi)}
                terpilih={filter?.id === opsi.id}
              />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function OpsiFilter({
  label,
  terpilih,
  onPress,
}: {
  label: string;
  terpilih: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: terpilih }}
      onPress={onPress}
      className="min-h-touch flex-row items-center justify-between gap-two px-three py-three active:opacity-60"
    >
      <Text
        className={`flex-1 text-body ${
          terpilih ? 'font-semibold text-primary' : 'text-text'
        }`}
      >
        {label}
      </Text>

      {terpilih ? (
        <SymbolView
          name={{ ios: 'checkmark', android: 'check', web: 'check' }}
          size={18}
          tintColor={theme.primary}
        />
      ) : null}
    </Pressable>
  );
}

function BarisRiwayat({ item }: { item: RiwayatKehadiran }) {
  const gaya = GAYA_STATUS[item.status];
  const keterangan = keteranganRiwayat(item);
  const tanggal = `${formatTanggal(item.sesi.tanggal)} · Minggu ke-${item.minggu}`;

  return (
    <View
      accessible
      accessibilityLabel={`${tanggal}. ${gaya.label}. ${item.sesi.namaKelas}. ${keterangan}`}
      className="px-three py-three"
    >
      <View className="flex-row items-start justify-between gap-two">
        <Text className="flex-1 pr-two text-small text-textSecondary">
          {tanggal}
        </Text>

        <StatusBadge label={gaya.label} tone={gaya.tone} />
      </View>

      <Text className="mt-two text-subtitle font-semibold text-primary">
        {item.sesi.namaKelas}
      </Text>

      <Text className="mt-one text-small text-textSecondary">
        {keterangan}
      </Text>
    </View>
  );
}

function PemisahRiwayat() {
  return <View className="mx-three h-half bg-border" />;
}

function KondisiKosong({
  status,
  pesanGalat,
  filter,
  onResetFilter,
}: {
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  filter: PraktikumRiwayat | null;
  onResetFilter: () => void;
}) {
  const theme = useTheme();

  if (status === 'memuat') {
    return (
      <View className="px-three pt-four">
        <Skeleton
          accessibilityLabel="Memuat riwayat kehadiran"
          baris={4}
        />
      </View>
    );
  }

  if (status === 'gagal') {
    return (
      <EmptyState
        deskripsi={
          pesanGalat ?? 'Periksa koneksi internet, lalu coba lagi.'
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
        judul="Riwayat gagal dimuat"
        tone="gagal"
      />
    );
  }

  if (filter) {
    return (
      <EmptyState
        aksi={{
          label: 'Tampilkan semua praktikum',
          onPress: onResetFilter,
        }}
        deskripsi="Praktikum ini belum memiliki catatan kehadiran."
        ikon={
          <SymbolView
            name={{
              ios: 'clock.arrow.circlepath',
              android: 'history',
              web: 'history',
            }}
            size={32}
            tintColor={theme.textSecondary}
          />
        }
        judul={`Belum ada riwayat untuk ${filter.nama}`}
      />
    );
  }

  return (
    <EmptyState
      deskripsi={teksKosong.riwayat.deskripsi}
      ikon={
        <SymbolView
          name={{
            ios: 'clock.arrow.circlepath',
            android: 'history',
            web: 'history',
          }}
          size={32}
          tintColor={theme.textSecondary}
        />
      }
      judul={teksKosong.riwayat.judul}
    />
  );
}

function keteranganRiwayat(item: RiwayatKehadiran): string {
  if (item.status === 'hadir' && item.waktu) {
    return `Tercatat pukul ${formatJam(item.waktu)}`;
  }

  if (item.izin === 'disetujui') return 'Disetujui oleh asisten';
  if (item.izin === 'menunggu') return 'Menunggu persetujuan asisten';
  if (item.izin === 'ditolak') return 'Pengajuan izin ditolak';

  return 'Tidak ada kehadiran tercatat';
}

function formatJam(waktu: Date): string {
  return `${String(waktu.getHours()).padStart(2, '0')}.${String(
    waktu.getMinutes(),
  ).padStart(2, '0')}`;
}

export type { KehadiranScreenProps };
