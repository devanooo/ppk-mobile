import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { AppButton } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { buatPayloadQr, encodePayloadQr } from '@/lib/qr';

type QrSesiProps = {
  sesiId: string;
  /** Nama sesi untuk keterangan di bawah QR. */
  namaSesi?: string;
  className?: string;
};

/**
 * Menampilkan QR sesi beserta masa berlakunya. QR dibuat ulang saat komponen
 * dipasang atau saat pengguna menekan tombol buat ulang setelah kedaluwarsa.
 *
 * Warna QR sengaja memakai hitam dan putih absolut dari palet terang, bukan
 * token tema, karena pemindai membutuhkan kontras penuh dan tidak membaca QR
 * dengan modul terang di atas latar gelap.
 */
export function QrSesi({ sesiId, namaSesi, className = '' }: QrSesiProps) {
  const [dibuatPada, setDibuatPada] = useState(() => Date.now());

  const payload = useMemo(
    () => buatPayloadQr({ sesiId, sekarang: new Date(dibuatPada) }),
    [sesiId, dibuatPada],
  );
  const teks = useMemo(() => encodePayloadQr(payload), [payload]);

  const [sekarang, setSekarang] = useState(() => Date.now());

  useEffect(() => {
    const pencatat = setInterval(() => setSekarang(Date.now()), 1000);

    return () => clearInterval(pencatat);
  }, []);

  const sisaDetik = Math.max(
    0,
    Math.round((Date.parse(payload.exp) - sekarang) / 1000),
  );

  const kedaluwarsa = sisaDetik <= 0;
  const menit = Math.floor(sisaDetik / 60);
  const detik = sisaDetik % 60;

  return (
    <View className={`items-center gap-three ${className}`}>
      <View className="rounded-lg bg-backgroundElement p-three">
        <QRCode
          backgroundColor={Colors.light.backgroundElement}
          color={Colors.light.text}
          ecl="M"
          size={216}
          value={teks}
        />
      </View>

      <Text className="text-center text-small text-textSecondary">
        {namaSesi ? `${namaSesi}. ` : ''}
        {kedaluwarsa
          ? 'QR sudah kedaluwarsa.'
          : `Berlaku ${menit} menit ${detik} detik lagi.`}
      </Text>

      {kedaluwarsa ? (
        <AppButton
          label="Buat QR baru"
          onPress={() => setDibuatPada(Date.now())}
          variant="secondary"
        />
      ) : null}
    </View>
  );
}

export type { QrSesiProps };
