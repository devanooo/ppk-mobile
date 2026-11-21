import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  BottomSheet,
  Card,
  EmptyState,
  IconButton,
  Screen,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { formatTanggalPanjang, rentangJamTitik } from '@/features/praktikan/format-sesi';
import { useTheme } from '@/hooks/use-theme';
import type { SesiPraktikan } from '@/lib/izin-sesi';

import { BidangAlasan } from './bidang-alasan';
import type { StatusMuat } from './use-sesi-praktikan';

export type UmpanBalik = { jenis: 'sukses' | 'gagal'; pesan: string };

type FormAjukanIzinProps = {
  sesi?: SesiPraktikan;
  minggu?: number;
  /** Membedakan "gagal dimuat" dari "sesi tidak ditemukan". */
  statusSesi?: StatusMuat;
  pesanGalatSesi?: string;
  alasan: string;
  sedangKirim: boolean;
  /** Alasan tambahan kenapa tombol Tinjau nonaktif, mis. sesi sudah ditutup. */
  alasanNonaktif?: string;
  tampilkanGalatAlasan?: boolean;
  umpanBalik?: UmpanBalik | null;
  konfirmasiTerbuka: boolean;
  onUbahAlasan: (nilai: string) => void;
  onTinjau: () => void;
  onTutupKonfirmasi: () => void;
  onKirim: () => void;
  onKembali: () => void;
  onTutupUmpanBalik?: () => void;
  onCobaLagi?: () => void;
  bolehCobaLagi?: boolean;
  profil?: ReactNode;
};

function BarisInfo({ label, nilai }: { label: string; nilai: string }) {
  return (
    <View className="flex-row items-start justify-between gap-three">
      <Text className="text-small text-textSecondary">{label}</Text>
      <Text className="flex-1 text-right text-small font-medium text-text">{nilai}</Text>
    </View>
  );
}

export function FormAjukanIzin({
  sesi,
  minggu,
  statusSesi = 'siap',
  pesanGalatSesi,
  alasan,
  sedangKirim,
  alasanNonaktif,
  tampilkanGalatAlasan = false,
  umpanBalik,
  konfirmasiTerbuka,
  onUbahAlasan,
  onTinjau,
  onTutupKonfirmasi,
  onKirim,
  onKembali,
  onTutupUmpanBalik,
  onCobaLagi,
  bolehCobaLagi = false,
  profil,
}: FormAjukanIzinProps) {
  const theme = useTheme();
  const namaKelas = sesi?.namaKelas || 'Sesi praktikum';

  return (
    <>
      <Screen padded={false}>
        <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
          <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
            <View className="flex-row items-center justify-between gap-two pt-two">
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

            <Text
              accessibilityRole="header"
              className="mt-three text-title font-semibold text-text"
            >
              Ceritakan kondisimu.
            </Text>
            <Text className="mt-one text-small text-textSecondary">
              Tulis alasan ketidakhadiranmu untuk sesi ini.
            </Text>

            {umpanBalik ? (
              <Banner
                className="mt-three"
                jenis={umpanBalik.jenis}
                onTutup={onTutupUmpanBalik}
                pesan={umpanBalik.pesan}
              />
            ) : null}

            {!sesi ? (
              <Card className="mt-four">
                {statusSesi === 'memuat' ? (
                  <EmptyState judul="Memuat sesi..." deskripsi="Detail sesi sedang diambil." />
                ) : statusSesi === 'gagal' ? (
                  <EmptyState
                    judul="Sesi gagal dimuat"
                    deskripsi={pesanGalatSesi ?? 'Tidak dapat memuat detail sesi.'}
                  />
                ) : (
                  <EmptyState
                    judul="Sesi tidak ditemukan"
                    deskripsi="Sesi ini mungkin sudah dihapus atau bukan bagian dari kelasmu."
                  />
                )}
              </Card>
            ) : (
              <>
                <Card className="mt-four" tone="muted">
                  <View className="flex-row items-start justify-between gap-two">
                    <View className="flex-1">
                      <Text className="text-caption text-textSecondary">Praktikum</Text>
                      <Text className="mt-one text-body font-semibold text-text">{namaKelas}</Text>
                    </View>
                    <StatusBadge status={sesi.status} />
                  </View>

                  <View className="mt-three gap-two">
                    <BarisInfo
                      label="Minggu"
                      nilai={minggu ? `Minggu ke-${minggu}` : 'Belum tersedia'}
                    />
                    <BarisInfo label="Tanggal" nilai={formatTanggalPanjang(sesi.tanggal)} />
                    <BarisInfo label="Waktu" nilai={`${rentangJamTitik(sesi)} WIB`} />
                    <BarisInfo label="Lokasi" nilai={sesi.lab || 'Belum ditentukan'} />
                  </View>
                </Card>

                <Card className="mt-four">
                  <BidangAlasan
                    onChange={onUbahAlasan}
                    tampilkanGalat={tampilkanGalatAlasan}
                    nilai={alasan}
                  />
                </Card>

                <View className="mt-four gap-two">
                  <AppButton
                    disabled={sedangKirim || Boolean(alasanNonaktif)}
                    disabledReason={alasanNonaktif}
                    label={sedangKirim ? 'Mengirim...' : 'Tinjau pengajuan'}
                    onPress={onTinjau}
                  />

                  {bolehCobaLagi && onCobaLagi ? (
                    <AppButton
                      disabled={sedangKirim}
                      label="Coba klasifikasi lagi"
                      onPress={onCobaLagi}
                      variant="secondary"
                    />
                  ) : null}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </Screen>

      {sesi ? (
        <BottomSheet
          deskripsi="Pengajuan izin ini akan dikirim ke asisten untuk ditinjau. Pastikan informasi sudah sesuai."
          judul="Kirim pengajuan?"
          labelBatal="Batal"
          labelKonfirmasi="Ya, kirim pengajuan"
          onClose={onTutupKonfirmasi}
          onKonfirmasi={onKirim}
          visible={konfirmasiTerbuka}
        >
          <View className="gap-one">
            <Text className="text-body font-semibold text-text">{namaKelas}</Text>
            <Text className="text-small text-textSecondary">
              {minggu ? `Minggu ke-${minggu} · ` : ''}
              {formatTanggalPanjang(sesi.tanggal)}
            </Text>
            <Text className="text-small text-textSecondary">
              {rentangJamTitik(sesi)} WIB · {sesi.lab || 'Lokasi belum ditentukan'}
            </Text>

            <View className="mt-two rounded-md bg-backgroundSelected p-twoHalf">
              <Text className="text-caption text-textSecondary">Alasan</Text>
              <Text className="mt-one text-small text-text">{alasan.trim()}</Text>
            </View>
          </View>
        </BottomSheet>
      ) : null}
    </>
  );
}
