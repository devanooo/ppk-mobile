import { ScrollView, Text, View } from 'react-native';

import { AppButton, Banner, Card, EmptyState, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { formatTanggal } from '@/features/praktikan/format-sesi';
import type { Izin, StatusIzin } from '@/features/izin/types';
import type { SesiPraktikan } from '@/lib/izin-sesi';

import { KartuIzin } from './kartu-izin';

export const FILTER_STATUS: { nilai: StatusIzin | 'semua'; label: string }[] = [
  { nilai: 'menunggu', label: 'Menunggu' },
  { nilai: 'disetujui', label: 'Disetujui' },
  { nilai: 'ditolak', label: 'Ditolak' },
  { nilai: 'semua', label: 'Semua' },
];

type DaftarIzinAsistenProps = {
  daftarIzin: Izin[];
  sesiById: Map<string, SesiPraktikan>;
  namaPraktikan: Map<string, string>;
  filter: StatusIzin | 'semua';
  status: 'memuat' | 'siap' | 'gagal';
  pesanGalat?: string;
  profil?: React.ReactNode;
  onUbahFilter: (nilai: StatusIzin | 'semua') => void;
  onBukaIzin: (izin: Izin) => void;
  onTutupUmpanBalik?: () => void;
  umpanBalik?: { jenis: 'sukses' | 'gagal'; pesan: string } | null;
};

export function DaftarIzinAsisten({
  daftarIzin,
  sesiById,
  namaPraktikan,
  filter,
  status,
  pesanGalat,
  profil,
  onUbahFilter,
  onBukaIzin,
  onTutupUmpanBalik,
  umpanBalik,
}: DaftarIzinAsistenProps) {
  const jumlahMenunggu = daftarIzin.filter((izin) => izin.status === 'menunggu').length;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
        <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
          <View className="flex-row items-start justify-between gap-three pt-three">
            <View className="flex-1">
              <Text accessibilityRole="header" className="text-title font-semibold text-text">
                Izin
              </Text>
              <Text className="mt-one text-small text-textSecondary">
                {jumlahMenunggu > 0
                  ? `${jumlahMenunggu} pengajuan menunggu keputusan`
                  : 'Daftar pengajuan izin dari sesi yang kamu ampu.'}
              </Text>
            </View>
            {profil}
          </View>

          <View className="mt-four flex-row flex-wrap gap-two">
            {FILTER_STATUS.map((item) => (
              <AppButton
                key={item.nilai}
                className="grow"
                label={item.label}
                onPress={() => onUbahFilter(item.nilai)}
                variant={filter === item.nilai ? 'primary' : 'secondary'}
              />
            ))}
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
                judul="Belum ada pengajuan izin"
                deskripsi="Pengajuan dari praktikan di sesimu akan muncul di sini."
              />
            </Card>
          ) : null}

          <View className="mt-four gap-twoHalf">
            {daftarIzin.map((izin) => {
              const sesi = sesiById.get(izin.sesiId);

              return (
                <View key={`${izin.sesiId}:${izin.id}`}>
                  {sesi ? (
                    <Text className="mb-one text-caption text-textSecondary">
                      {sesi.namaKelas} · {formatTanggal(sesi.tanggal)} · {sesi.jamMulai}–
                      {sesi.jamSelesai}
                    </Text>
                  ) : null}

                  <KartuIzin
                    izin={izin}
                    namaPraktikan={namaPraktikan.get(izin.praktikanId) ?? 'Praktikan'}
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
