import { ScrollView, Text, View } from 'react-native';

import { AppButton, Banner, Card, EmptyState, HomeButton, Screen } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';

import { BidangAlasan } from './bidang-alasan';
import { PemilihSesi } from './pemilih-sesi';
import type { SesiPraktikan } from '@/lib/izin-sesi';

export type UmpanBalik = { jenis: 'sukses' | 'gagal'; pesan: string };

type FormAjukanIzinProps = {
  daftarSesi: SesiPraktikan[];
  sesiTerpilih?: string;
  alasan: string;
  sedangKirim: boolean;
  /** Membedakan "gagal dimuat" dari "memang belum ada sesi" (NFR-02). */
  statusSesi?: 'memuat' | 'siap' | 'gagal';
  pesanGalatSesi?: string;
  /** Alasan tambahan kenapa tombol Ajukan nonaktif, mis. sesi sudah ditutup. */
  alasanNonaktif?: string;
  tampilkanGalatAlasan?: boolean;
  umpanBalik?: UmpanBalik | null;
  onPilihSesi: (sesiId: string) => void;
  onUbahAlasan: (nilai: string) => void;
  onAjukan: () => void;
  onKembali: () => void;
  onTutupUmpanBalik?: () => void;
  onCobaLagi?: () => void;
  bolehCobaLagi?: boolean;
  profil?: React.ReactNode;
};

export function FormAjukanIzin({
  daftarSesi,
  sesiTerpilih,
  alasan,
  sedangKirim,
  statusSesi = 'siap',
  pesanGalatSesi,
  alasanNonaktif,
  tampilkanGalatAlasan = false,
  umpanBalik,
  onPilihSesi,
  onUbahAlasan,
  onAjukan,
  onKembali,
  onTutupUmpanBalik,
  onCobaLagi,
  bolehCobaLagi = false,
  profil,
}: FormAjukanIzinProps) {
  const adaSesi = daftarSesi.length > 0;
  const sedangMemuat = statusSesi === 'memuat';
  const gagalMemuat = statusSesi === 'gagal';

  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="pb-five" showsVerticalScrollIndicator={false}>
        <View className="w-full self-center px-three" style={{ maxWidth: MaxContentWidth }}>
          <View className="flex-row items-center justify-between gap-two pt-two">
            <HomeButton onPress={onKembali} />
            {profil}
          </View>

          <Text accessibilityRole="header" className="mt-three text-title font-semibold text-text">
            Ajukan izin
          </Text>
          <Text className="mt-one text-small text-textSecondary">
            Pilih sesi lalu tulis alasan ketidakhadiranmu. Satu pengajuan untuk setiap sesi.
          </Text>

          {umpanBalik ? (
            <Banner
              className="mt-three"
              jenis={umpanBalik.jenis}
              onTutup={onTutupUmpanBalik}
              pesan={umpanBalik.pesan}
            />
          ) : null}

          {adaSesi ? (
            <>
              <PemilihSesi
                className="mt-four"
                daftarSesi={daftarSesi}
                onPilih={onPilihSesi}
                sesiTerpilih={sesiTerpilih}
              />

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
                  label={sedangKirim ? 'Mengirim...' : 'Ajukan izin'}
                  onPress={onAjukan}
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
          ) : (
            <Card className="mt-four">
              {sedangMemuat ? (
                <EmptyState judul="Memuat sesi..." deskripsi="Daftar sesi sedang diambil." />
              ) : gagalMemuat ? (
                <EmptyState
                  judul="Sesi gagal dimuat"
                  deskripsi={pesanGalatSesi ?? 'Tidak dapat memuat daftar sesi.'}
                />
              ) : (
                <EmptyState
                  judul="Belum ada sesi"
                  deskripsi="Izin hanya dapat diajukan untuk sesi dari kelas yang kamu ikuti."
                />
              )}
            </Card>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
