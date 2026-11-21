import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  Screen,
  Skeleton,
  StatusBadge,
  teksKosong,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import {
  formatTanggalPanjang,
  geserTanggal,
  labelHari,
  nomorTanggal,
  rentangJamTitik,
  tanggalHariIni,
} from '@/features/praktikan/format-sesi';
import { useTheme } from '@/hooks/use-theme';

import type { SesiAsisten } from './use-sesi-asisten';

type JadwalAsistenScreenProps = {
  sesi: SesiAsisten[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  onBukaSesi: (sesiId: string) => void;
  profil?: ReactNode;
};

const JUMLAH_HARI = 5;
const HARI_SEBELUM = 2;

export function JadwalAsistenScreen({
  sesi,
  status,
  pesanGalat,
  onBukaSesi,
  profil,
}: JadwalAsistenScreenProps) {
  const [tanggalPilihan, setTanggalPilihan] = useState<string>();

  const hariIni = useMemo(() => tanggalHariIni(), []);
  const mingguPerSesi = useMemo(() => hitungMinggu(sesi), [sesi]);

  const tanggalAwal = useMemo(
    () => (sesi.length > 0 ? tanggalTerdekat(sesi, hariIni) : hariIni),
    [sesi, hariIni],
  );

  const tanggalDipilih = tanggalPilihan ?? tanggalAwal;

  const hariStrip = useMemo(
    () =>
      Array.from({ length: JUMLAH_HARI }, (_, urutan) =>
        geserTanggal(tanggalDipilih, urutan - HARI_SEBELUM),
      ),
    [tanggalDipilih],
  );

  const sesiTerpilih = useMemo(
    () => sesi.filter((item) => item.tanggal === tanggalDipilih),
    [sesi, tanggalDipilih],
  );

  const tanggalTerdekatLain = useMemo(() => {
    if (sesi.length === 0) return undefined;
    return tanggalTerdekat(sesi, tanggalDipilih);
  }, [sesi, tanggalDipilih]);

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <FlatList
          data={sesiTerpilih}
          keyExtractor={(item) => item.id}
          contentContainerClassName="pb-five"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <BagianAtas
              adaSesi={sesiTerpilih.length > 0}
              hariStrip={hariStrip}
              onPilihTanggal={setTanggalPilihan}
              profil={profil}
              tanggalDipilih={tanggalDipilih}
            />
          }
          ListEmptyComponent={
            <KondisiKosong
              adaJadwal={sesi.length > 0}
              onPilihTanggal={setTanggalPilihan}
              pesanGalat={pesanGalat}
              status={status}
              tanggalDipilih={tanggalDipilih}
              tanggalLain={tanggalTerdekatLain}
            />
          }
          ItemSeparatorComponent={PemisahSesi}
          renderItem={({ item }) => (
            <BarisSesi
              minggu={mingguPerSesi.get(item.id) ?? 1}
              onPress={() => onBukaSesi(item.id)}
              sesi={item}
            />
          )}
        />
      </View>
    </Screen>
  );
}

function BagianAtas({
  hariStrip,
  tanggalDipilih,
  onPilihTanggal,
  profil,
  adaSesi,
}: {
  hariStrip: string[];
  tanggalDipilih: string;
  onPilihTanggal: (tanggal: string) => void;
  profil?: ReactNode;
  adaSesi: boolean;
}) {
  return (
    <View className="px-three pt-three">
      {/* Header: wordmark + notif + pill peran + profil */}
      <View className="flex-row items-center justify-between gap-two">
        <Text
          className="flex-1 text-subtitle font-bold text-primary"
          numberOfLines={1}
        >
          PraktikumKU
        </Text>

        <View className="flex-row items-center gap-two">
          <LoncengNotifikasi />
          <View className="rounded-pill bg-backgroundSelected px-two py-one">
            <Text className="text-caption font-medium text-primary">
              Asisten
            </Text>
          </View>
          {profil}
        </View>
      </View>

      <Text
        accessibilityRole="header"
        className="mt-four text-title font-semibold text-primary"
      >
        {'Sesi yang\nkamu dampingi.'}
      </Text>

      <Text className="mt-two text-small text-textSecondary">
        {formatTanggalPanjang(tanggalDipilih)}
      </Text>

      <StripTanggal
        dipilih={tanggalDipilih}
        hari={hariStrip}
        onPilih={onPilihTanggal}
      />

      <KartuPeta />

      {adaSesi ? <View className="mt-four h-half bg-border" /> : null}
    </View>
  );
}

function LoncengNotifikasi({
  adaBelumDibaca = false,
}: {
  adaBelumDibaca?: boolean;
}) {
  const theme = useTheme();

  return (
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

      {adaBelumDibaca ? (
        <View className="absolute right-two top-two h-two w-two rounded-pill bg-danger" />
      ) : null}
    </View>
  );
}

function StripTanggal({
  hari,
  dipilih,
  onPilih,
}: {
  hari: string[];
  dipilih: string;
  onPilih: (tanggal: string) => void;
}) {
  return (
    <View className="mt-four flex-row rounded-lg bg-backgroundSelected p-two">
      {hari.map((tanggal) => {
        const terpilih = tanggal === dipilih;

        return (
          <Pressable
            key={tanggal}
            accessibilityLabel={`${formatTanggalPanjang(tanggal)}${
              terpilih ? ', tanggal dipilih' : ''
            }`}
            accessibilityRole="button"
            accessibilityState={{ selected: terpilih }}
            onPress={() => onPilih(tanggal)}
            className={`min-h-touch flex-1 items-center justify-center rounded-pill px-one py-two active:opacity-60 ${
              terpilih ? 'bg-primary' : ''
            }`}
          >
            <Text
              className={`text-caption ${
                terpilih ? 'text-primaryText' : 'text-text'
              }`}
            >
              {labelHari(tanggal)}
            </Text>
            <Text
              className={`mt-half text-body font-semibold ${
                terpilih ? 'text-primaryText' : 'text-text'
              }`}
            >
              {nomorTanggal(tanggal)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function KartuPeta() {
  const theme = useTheme();

  return (
    <Card className="mt-three" tone="muted">
      <View className="flex-row items-center gap-three">
        <SymbolView
          name={{
            ios: 'mappin.and.ellipse',
            android: 'location_on',
            web: 'location_on',
          }}
          size={28}
          tintColor={theme.primary}
        />

        <View className="flex-1">
          <Text className="text-body font-semibold text-primary">
            Peta Laboratorium
          </Text>
          <Text className="mt-half text-small text-textSecondary">
            Lihat lokasi dan aktivitas laboratorium
          </Text>
        </View>

        <SymbolView
          name={{
            ios: 'chevron.right',
            android: 'chevron_right',
            web: 'chevron_right',
          }}
          size={22}
          tintColor={theme.primary}
        />
      </View>
    </Card>
  );
}

function KondisiKosong({
  status,
  pesanGalat,
  adaJadwal,
  tanggalDipilih,
  tanggalLain,
  onPilihTanggal,
}: {
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  adaJadwal: boolean;
  tanggalDipilih: string;
  tanggalLain?: string;
  onPilihTanggal: (tanggal: string) => void;
}) {
  const theme = useTheme();

  if (status === 'memuat') {
    return (
      <View className="px-three pt-four">
        <Skeleton baris={3} accessibilityLabel="Memuat jadwal sesi" />
        <Skeleton baris={4} className="mt-five" />
      </View>
    );
  }

  if (status === 'gagal') {
    return (
      <EmptyState
        deskripsi={pesanGalat ?? 'Periksa koneksi internet, lalu coba lagi.'}
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
        judul="Jadwal gagal dimuat"
        tone="gagal"
      />
    );
  }

  if (!adaJadwal) {
    return (
      <EmptyState
        deskripsi={teksKosong.jadwal.deskripsi}
        ikon={
          <SymbolView
            name={{
              ios: 'calendar',
              android: 'calendar_today',
              web: 'calendar_today',
            }}
            size={32}
            tintColor={theme.textSecondary}
          />
        }
        judul={teksKosong.jadwal.judul}
      />
    );
  }

  const adaTanggalLain =
    tanggalLain !== undefined && tanggalLain !== tanggalDipilih;

  return (
    <EmptyState
      aksi={
        adaTanggalLain
          ? {
              label: 'Lihat sesi terdekat',
              onPress: () => onPilihTanggal(tanggalLain),
            }
          : undefined
      }
      deskripsi={`Belum ada sesi pada ${formatTanggalPanjang(tanggalDipilih)}.`}
      ikon={
        <SymbolView
          name={{
            ios: 'calendar',
            android: 'calendar_today',
            web: 'calendar_today',
          }}
          size={32}
          tintColor={theme.textSecondary}
        />
      }
      judul="Tidak ada sesi"
    />
  );
}

function BarisSesi({
  sesi,
  minggu,
  onPress,
}: {
  sesi: SesiAsisten;
  minggu: number;
  onPress: () => void;
}) {
  const theme = useTheme();
  const jumlahPeserta = sesi.pesertaIds.length;
  const teksPeserta =
    jumlahPeserta === 0
      ? 'Belum ada praktikan'
      : `${jumlahPeserta} praktikan`;

  return (
    <Pressable
      accessibilityLabel={`Buka detail sesi ${sesi.namaKelas}, ${labelStatus(
        sesi.status,
      )}, ${formatTanggalPanjang(sesi.tanggal)}, pukul ${rentangJamTitik(
        sesi,
      )}, ${sesi.lab}, ${teksPeserta}`}
      accessibilityRole="button"
      onPress={onPress}
      className="px-three py-three active:opacity-60"
    >
      <View className="flex-row items-center justify-between gap-two">
        <Text className="text-small font-semibold text-primary">
          {rentangJamTitik(sesi)}
        </Text>

        <StatusBadge className="self-center" status={sesi.status} />
      </View>

      <View className="mt-two flex-row items-center justify-between gap-two">
        <Text className="flex-1 text-subtitle font-semibold text-primary">
          {sesi.namaKelas}
        </Text>

        <SymbolView
          name={{
            ios: 'chevron.right',
            android: 'chevron_right',
            web: 'chevron_right',
          }}
          size={16}
          tintColor={theme.textSecondary}
        />
      </View>

      <Text className="mt-one text-small text-textSecondary">
        Praktikum minggu ke-{minggu}
      </Text>

      <View className="mt-two flex-row flex-wrap items-center gap-two">
        <View className="flex-row items-center gap-two">
          <SymbolView
            name={{
              ios: 'mappin',
              android: 'location_on',
              web: 'location_on',
            }}
            size={16}
            tintColor={theme.textSecondary}
          />
          <Text className="text-small text-textSecondary">
            {sesi.lab || 'Lokasi belum diisi'}
          </Text>
        </View>

        <Text className="text-small text-textSecondary">·</Text>

        <Text className="text-small text-textSecondary">{teksPeserta}</Text>
      </View>
    </Pressable>
  );
}

function PemisahSesi() {
  return <View className="mx-three h-half bg-border" />;
}

function hitungMinggu(daftar: SesiAsisten[]): Map<string, number> {
  const perKelas = new Map<string, SesiAsisten[]>();

  for (const item of daftar) {
    const isi = perKelas.get(item.kelasId) ?? [];
    isi.push(item);
    perKelas.set(item.kelasId, isi);
  }

  const hasil = new Map<string, number>();

  for (const isi of perKelas.values()) {
    const urut = [...isi].sort((a, b) =>
      `${a.tanggal}T${a.jamMulai}`.localeCompare(
        `${b.tanggal}T${b.jamMulai}`,
      ),
    );

    urut.forEach((item, indeks) => hasil.set(item.id, indeks + 1));
  }

  return hasil;
}

function tanggalTerdekat(daftar: SesiAsisten[], acuan: string): string {
  const semuaTanggal = Array.from(
    new Set(daftar.map((item) => item.tanggal)),
  ).sort();

  return (
    semuaTanggal.find((tanggal) => tanggal >= acuan) ??
    semuaTanggal[semuaTanggal.length - 1] ??
    acuan
  );
}

function labelStatus(status: SesiAsisten['status']): string {
  if (status === 'belum-dibuka') return 'Belum dibuka';
  if (status === 'dibuka') return 'Dibuka';
  return 'Ditutup';
}

export type { JadwalAsistenScreenProps };
