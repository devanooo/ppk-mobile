import { useCameraPermissions } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';

/** Langkah zoom per ketukan, mengikuti kontrol "− 0% +" pada referensi 03. */
const LANGKAH_ZOOM = 0.1;

export type HasilPindai =
  | { jenis: 'teks'; nilai: string }
  | { jenis: 'galat'; pesan: string };

/**
 * State kamera untuk layar pemindai QR.
 *
 * Satu QR hanya diteruskan sekali: `onBarcodeScanned` pada `CameraView` terus
 * memanggil callback selama kode masih di depan lensa, jadi penjaga
 * `sudahTerdeteksi` mencegah validasi berjalan berkali-kali per detik.
 */
export function usePemindaiQr() {
  const [izin, mintaIzin] = useCameraPermissions();
  const [senter, setSenter] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [terkunci, setTerkunci] = useState(false);
  const sudahTerdeteksi = useRef(false);

  const izinDiberikan = Boolean(izin?.granted);
  const bisaDimintaLagi = izin?.canAskAgain ?? true;
  const memuatIzin = izin === null;

  const putarSenter = useCallback(() => {
    setSenter((nilai) => !nilai);
  }, []);

  const tambahZoom = useCallback(() => {
    setZoom((nilai) => Math.min(1, Number((nilai + LANGKAH_ZOOM).toFixed(1))));
  }, []);

  const kurangiZoom = useCallback(() => {
    setZoom((nilai) => Math.max(0, Number((nilai - LANGKAH_ZOOM).toFixed(1))));
  }, []);

  const mintaAkses = useCallback(async () => {
    await mintaIzin();
  }, [mintaIzin]);

  const terimaTeks = useCallback(
    (nilai: string, saatTerdeteksi: (teks: string) => void | Promise<void>) => {
      if (sudahTerdeteksi.current) return;

      const teks = nilai.trim();

      if (!teks) return;

      sudahTerdeteksi.current = true;
      setTerkunci(true);
      void saatTerdeteksi(teks);
    },
    [],
  );

  /** Dipanggil setelah pengguna menutup hasil, supaya kamera bisa memindai lagi. */
  const bukaKunci = useCallback(() => {
    sudahTerdeteksi.current = false;
    setTerkunci(false);
  }, []);

  return {
    izinDiberikan,
    bisaDimintaLagi,
    memuatIzin,
    mintaAkses,
    senter,
    putarSenter,
    zoom,
    tambahZoom,
    kurangiZoom,
    terkunci,
    terimaTeks,
    bukaKunci,
  };
}

export { LANGKAH_ZOOM };
