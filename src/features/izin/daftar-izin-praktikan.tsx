import type { ReactNode } from 'react';
import { FlatList, Text, View } from 'react-native';

import {
  AppButton,
  AppHeader,
  Banner,
  Card,
  EmptyState,
  FilterSelect,
  Screen,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { KartuIzin } from '@/features/izin/kartu-izin';
import { BATAS_SESI_PRAKTIKAN } from '@/features/izin/use-izin-praktikan';
import type { Izin, StatusIzin } from '@/features/izin/types';
import type { SesiPraktikan } from '@/lib/izin-sesi';

export type StatusDaftar = 'memuat' | 'siap' | 'gagal';

export const FILTER_STATUS: { nilai: StatusIzin | 'semua'; label: string }[] = [
  { nilai: 'semua', label: 'Semua status' },
  { nilai: 'menunggu', label: 'Menunggu' },
  { nilai: 'disetujui', label: 'Disetujui' },
  { nilai: 'ditolak', label: 'Ditolak' },
];

type DaftarIzinPraktikanProps = {
  daftarIzin: Izin[];
  filter: StatusIzin | 'semua';
  filterKategori: string;
  opsiKategori: { nilai: string; label: string }[];
  /** Jumlah sebelum filter, dipakai membedakan kosong awal dan kosong karena filter. */
  totalIzin: number;
  sesiById: Map<string, SesiPraktikan>;
  /** Digabung dari status sesi dan status izin oleh pemanggil. */
  status: StatusDaftar;
  pesanGalat?: string;
  /** Riwayat dipotong ke batas sesi; diberi tahu, bukan dipotong diam-diam. */
  terpotong?: boolean;
  onAjukan: () => void;
  onUbahFilter: (nilai: StatusIzin | 'semua') => void;
  onUbahFilterKategori: (nilai: string) => void;
  onHapusFilter?: () => void;
  profil?: ReactNode;
  /** Diisi hanya bila daftar boleh menawarkan klasifikasi ulang. */
  onKlasifikasiUlang?: (izin: Izin) => void;
  idSedangKlasifikasi?: string;
  /** Hasil klasifikasi ulang atau pengajuan baru, ditampilkan sebagai banner. */
  umpanBalik?: { jenis: 'sukses' | 'gagal'; pesan: string } | null;
  onTutupUmpanBalik?: () => void;
};

function labelJumlah(jumlah: number, status: StatusDaftar): string {
  if (status === 'memuat') return 'Memuat pengajuan izin...';
  if (status === 'gagal') return 'Pengajuan izin gagal dimuat.';

  return `${jumlah} pengajuan ditemukan.`;
}

/**
 * Empty state dibedakan antara belum punya pengajuan sama sekali dan tidak ada
 * yang cocok dengan filter, karena tindakan lanjutannya berbeda.
 */
function teksKosong(
  status: StatusDaftar,
  total: number,
  adaFilter: boolean,
  pesanGalat?: string,
): { judul: string; deskripsi: string } {
  if (status === 'gagal') {
    return {
      judul: 'Daftar izin gagal dimuat',
      deskripsi: pesanGalat ?? 'Coba muat ulang halaman ini.',
    };
  }

  if (total === 0) {
    return {
      judul: 'Belum ada pengajuan izin',
      deskripsi: 'Pengajuan izin yang kamu kirim akan tercatat di sini.',
    };
  }

  if (adaFilter) {
    return {
      judul: 'Tidak ada pengajuan yang cocok',
      deskripsi: 'Ubah kategori atau status untuk melihat pengajuan lain.',
    };
  }

  return {
    judul: 'Belum ada pengajuan izin',
    deskripsi: 'Pengajuan izin yang kamu kirim akan tercatat di sini.',
  };
}

export function DaftarIzinPraktikan({
  daftarIzin,
  filter,
  filterKategori,
  opsiKategori,
  totalIzin,
  sesiById,
  status,
  pesanGalat,
  terpotong = false,
  onAjukan,
  onUbahFilter,
  onUbahFilterKategori,
  onHapusFilter,
  profil,
  onKlasifikasiUlang,
  idSedangKlasifikasi,
  umpanBalik,
}: DaftarIzinPraktikanProps) {
  const sedangMemuat = status === 'memuat';
  const gagal = status === 'gagal';
  const adaFilter = filter !== 'semua' || filterKategori !== 'semua';
  const kosong = teksKosong(status, totalIzin, adaFilter, pesanGalat);

  return (
    <Screen padded={false} backgroundClassName="bg-backgroundElement">
      <View className="w-full flex-1 self-center" style={{ maxWidth: MaxContentWidth }}>
        <FlatList
          contentContainerClassName="px-three pb-five"
          data={daftarIzin}
          // ID dokumen izin = uid praktikan, jadi tidak unik lintas sesi.
          keyExtractor={(item) => `${item.sesiId}:${item.id}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <AppHeader aksi={profil} className="pt-three" peran="praktikan" />

              <View className="mt-four">
                <Text
                  accessibilityRole="header"
                  className="text-title font-semibold text-primary"
                >
                  Pengajuan izinmu.
                </Text>
                <Text className="mt-two text-small text-textSecondary">
                  Pantau status pengajuan izin untuk setiap praktikum.
                </Text>
              </View>

              <AppButton className="mt-four" fullWidth label="Ajukan izin" onPress={onAjukan} />

              <View className="mt-four flex-row gap-two">
                <FilterSelect
                  className="shrink"
                  label="Kategori AI"
                  nilai={filterKategori}
                  opsi={opsiKategori}
                  onPilih={onUbahFilterKategori}
                  tampilkanNilai
                />

                <FilterSelect
                  className="shrink"
                  label="Status"
                  nilai={filter}
                  opsi={FILTER_STATUS}
                  onPilih={(nilai) => onUbahFilter(nilai as StatusIzin | 'semua')}
                  tampilkanNilai
                />
              </View>

              <Text
                accessibilityLiveRegion="polite"
                className="mt-three text-small text-textSecondary"
              >
                {labelJumlah(daftarIzin.length, status)}
              </Text>

              {terpotong ? (
                <Text className="mt-three text-caption text-textSecondary">
                  Menampilkan {BATAS_SESI_PRAKTIKAN} sesi terbaru saja. Riwayat izin pada sesi
                  lama tidak dimuat.
                </Text>
              ) : null}

              {pesanGalat ? (
                <Banner className="mt-three" jenis="gagal" pesan={pesanGalat} />
              ) : null}

              {umpanBalik ? (
                <Banner
                  className="mt-three"
                  jenis={umpanBalik.jenis}
                  pesan={umpanBalik.pesan}
                />
              ) : null}
            </>
          }
          ListEmptyComponent={
            sedangMemuat ? undefined : (
              <Card className="mt-four">
                <EmptyState
                  aksi={
                    !gagal && totalIzin > 0 && adaFilter && onHapusFilter
                      ? { label: 'Hapus filter', onPress: onHapusFilter }
                      : undefined
                  }
                  deskripsi={kosong.deskripsi}
                  judul={kosong.judul}
                  tone={gagal ? 'gagal' : 'kosong'}
                />
              </Card>
            )
          }
          ItemSeparatorComponent={() => <View className="h-twoHalf" />}
          renderItem={({ item }) => (
            <KartuIzin
              izin={item}
              onKlasifikasiUlang={
                onKlasifikasiUlang ? () => onKlasifikasiUlang(item) : undefined
              }
              sedangKlasifikasi={idSedangKlasifikasi === `${item.sesiId}:${item.id}`}
              sesi={sesiById.get(item.sesiId)}
            />
          )}
        />
      </View>
    </Screen>
  );
}
