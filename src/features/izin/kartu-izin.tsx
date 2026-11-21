import { Text, View } from 'react-native';

import { AppButton, Card } from '@/components/ui';
import { formatTanggal } from '@/features/praktikan/format-sesi';
import type { SesiPraktikan } from '@/lib/izin-sesi';
import type { Izin } from '@/features/izin/types';

import { BadgeKlasifikasiAi, BadgeStatusIzin } from './badge-status-izin';
import { formatWaktuIzin } from './format-izin';

type KartuIzinProps = {
  izin: Izin;
  /** Diisi di sisi asisten; kosong berarti kartu milik praktikan sendiri. */
  namaPraktikan?: string;
  sesi?: SesiPraktikan;
  onPress?: () => void;
  /**
   * Hanya dikirim sisi praktikan. Klasifikasi yang gagal atau menggantung bisa
   * diulang dari daftar tanpa membuat pengajuan baru (satu pengajuan per sesi).
   */
  onKlasifikasiUlang?: () => void;
  sedangKlasifikasi?: boolean;
};

export function KartuIzin({
  izin,
  namaPraktikan,
  sesi,
  onPress,
  onKlasifikasiUlang,
  sedangKlasifikasi = false,
}: KartuIzinProps) {
  const judul = namaPraktikan ?? sesi?.namaKelas ?? 'Pengajuan izin';
  const waktuKirim = formatWaktuIzin(izin.dibuatPada);
  const waktuPutus = formatWaktuIzin(izin.diputuskanPada);
  // Hasil klasifikasi hanya bisa diubah selama pengajuan masih menunggu, sama
  // dengan batasan Security Rules.
  const bisaKlasifikasiUlang =
    Boolean(onKlasifikasiUlang) && izin.klasifikasiStatus !== 'selesai' && izin.status === 'menunggu';
  // Saran hanya ditampilkan bila sudah ada hasil, atau untuk memberi tahu bahwa
  // klasifikasi gagal. Status yang masih diproses tidak perlu blok kosong.
  const tampilkanSaranAi =
    Boolean(izin.kategoriAi?.trim()) || izin.klasifikasiStatus === 'gagal';

  const isi = (
    <>
      <View className="flex-row items-start justify-between gap-two">
        <View className="flex-1">
          <Text className="text-subtitle font-semibold text-text">{judul}</Text>
          {sesi ? (
            <Text className="mt-one text-small text-textSecondary">
              {sesi.hari}, {formatTanggal(sesi.tanggal)} · {sesi.jamMulai}–{sesi.jamSelesai}
            </Text>
          ) : null}
        </View>
        <BadgeStatusIzin className="shrink-0" status={izin.status} />
      </View>

      <Text className="mt-three text-caption font-semibold text-textSecondary">Alasan</Text>
      <Text className="mt-one text-body text-text">{izin.alasan}</Text>

      {waktuKirim ? (
        <Text className="mt-two text-small text-textSecondary">Diajukan pukul {waktuKirim}</Text>
      ) : null}

      {tampilkanSaranAi ? (
        <BadgeKlasifikasiAi
          className="mt-three"
          kategori={izin.kategoriAi}
          status={izin.klasifikasiStatus}
        />
      ) : null}

      {bisaKlasifikasiUlang ? (
        <AppButton
          className="mt-three"
          disabled={sedangKlasifikasi}
          label={sedangKlasifikasi ? 'Mengklasifikasi...' : 'Klasifikasi ulang'}
          onPress={onKlasifikasiUlang as () => void}
          variant="secondary"
        />
      ) : null}

      {waktuPutus ? (
        <Text className="mt-three border-t border-border pt-three text-small text-textSecondary">
          Diputuskan pukul {waktuPutus}
          {izin.diputuskanOleh ? ' oleh asisten pengampu' : ''}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Card accessibilityLabel={`Buka pengajuan izin ${judul}`} onPress={onPress}>
        {isi}
      </Card>
    );
  }

  return <Card>{isi}</Card>;
}
