import { ScrollView, Text, View } from 'react-native';

import { AppHeader, Banner, Card, EmptyState, FilterSelect, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import type { Izin, StatusIzin } from '@/features/izin/types';
import type { SesiPraktikan } from '@/lib/izin-sesi';

import { BarisIzinAsisten } from './baris-izin-asisten';

export const FILTER_STATUS: { nilai: StatusIzin | 'semua'; label: string }[] = [
  { nilai: 'menunggu', label: 'Menunggu' },
  { nilai: 'disetujui', label: 'Disetujui' },
  { nilai: 'ditolak', label: 'Ditolak' },
  { nilai: 'semua', label: 'Semua' },
];

type DaftarIzinAsistenProps = {
  daftarIzin: Izin[];
  /** Seluruh izin tanpa filter, dipakai untuk menghitung antrean. */
  semuaIzin: Izin[];
  sesiById: Map<string, SesiPraktikan>;
  namaPraktikan: Map<string, string>;
  filter: StatusIzin | 'semua';
  filterKategori: string;
  opsiKategori: { nilai: string; label: string }[];
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  profil?: React.ReactNode;
  onUbahFilter: (nilai: StatusIzin | 'semua') => void;
  onUbahFilterKategori: (nilai: string) => void;
  onBukaIzin: (izin: Izin) => void;
  onTutupUmpanBalik?: () => void;
  umpanBalik?: { jenis: 'sukses' | 'gagal'; pesan: string } | null;
};

/**
 * Empty state dibedakan per filter. "Belum ada pengajuan sama sekali" berbeda
 * artinya dengan "tidak ada yang berstatus disetujui".
 */
function judulKosong(filter: StatusIzin | 'semua', total: number): string {
  if (total === 0) return 'Belum ada pengajuan izin';

  if (filter === 'menunggu') return 'Tidak ada pengajuan yang menunggu';
  if (filter === 'disetujui') return 'Belum ada izin disetujui';
  if (filter === 'ditolak') return 'Belum ada izin ditolak';

  return 'Belum ada pengajuan izin';
}

function deskripsiKosong(filter: StatusIzin | 'semua', total: number): string {
  if (total === 0) return 'Pengajuan dari praktikan di sesimu akan muncul di sini.';

  if (filter === 'menunggu') return 'Semua pengajuan pada sesimu sudah diputuskan.';

  return 'Pengajuan dengan status ini akan muncul di sini.';
}

export function DaftarIzinAsisten({
  daftarIzin,
  semuaIzin,
  sesiById,
  namaPraktikan,
  filter,
  filterKategori,
  opsiKategori,
  status,
  pesanGalat,
  profil,
  onUbahFilter,
  onUbahFilterKategori,
  onBukaIzin,
  onTutupUmpanBalik,
  umpanBalik,
}: DaftarIzinAsistenProps) {
  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
        <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
          <AppHeader aksi={profil} className="pt-three" peran="asisten" />

          <View className="mt-four">
            <Text accessibilityRole="header" className="text-title font-bold text-text">
              Pengajuan izin praktikan.
            </Text>
            <Text className="mt-two text-small text-textSecondary">
              Tinjau pengajuan pada sesi yang kamu dampingi.
            </Text>
          </View>

          <View className="mt-four flex-row flex-wrap gap-two">
            <FilterSelect
              label="Status"
              nilai={filter}
              opsi={FILTER_STATUS}
              onPilih={(nilai) => onUbahFilter(nilai as StatusIzin | 'semua')}
            />

            <FilterSelect
              label="Kategori"
              nilai={filterKategori}
              opsi={opsiKategori}
              onPilih={onUbahFilterKategori}
            />
          </View>

          {umpanBalik ? (
            <Banner
              className="mt-three"
              jenis={umpanBalik.jenis}
              onTutup={onTutupUmpanBalik}
              pesan={umpanBalik.pesan}
            />
          ) : null}

          {status === 'gagal' ? (
            <Banner className="mt-three" jenis="gagal" pesan={pesanGalat ?? 'Data izin gagal dimuat'} />
          ) : null}

          {status === 'memuat' ? (
            <Text className="mt-four text-small text-textSecondary">Memuat pengajuan izin...</Text>
          ) : null}

          {status === 'siap' && daftarIzin.length === 0 ? (
            <Card className="mt-four">
              <EmptyState
                judul={judulKosong(filter, semuaIzin.length)}
                deskripsi={deskripsiKosong(filter, semuaIzin.length)}
              />
            </Card>
          ) : null}

          <View className="mt-two">
            {daftarIzin.map((izin, indeks) => {
              const sesi = sesiById.get(izin.sesiId);

              return (
                <View key={`${izin.sesiId}:${izin.id}`}>
                  {indeks > 0 ? <View className="h-half bg-border" /> : null}

                  <BarisIzinAsisten
                    izin={izin}
                    nama={namaPraktikan.get(izin.praktikanId) ?? 'Praktikan'}
                    onPress={() => onBukaIzin(izin)}
                    sesi={sesi}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
