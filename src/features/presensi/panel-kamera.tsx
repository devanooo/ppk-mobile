import { CameraView } from 'expo-camera';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type PanelKameraProps = {
  izinDiberikan: boolean;
  memuatIzin: boolean;
  senter: boolean;
  zoom: number;
  onPutarSenter: () => void;
  onTambahZoom: () => void;
  onKurangiZoom: () => void;
  onTerdeteksi: (teks: string) => void;
  terkunci: boolean;
};

/** Sudut bingkai pindai, digambar dengan border agar tidak butuh aset baru. */
function SudutBingkai({ posisi }: { posisi: 'kiriAtas' | 'kananAtas' | 'kiriBawah' | 'kananBawah' }) {
  const tema = useTheme();
  const gaya = {
    kiriAtas: 'left-0 top-0 border-l-2 border-t-2 rounded-tl-md',
    kananAtas: 'right-0 top-0 border-r-2 border-t-2 rounded-tr-md',
    kiriBawah: 'left-0 bottom-0 border-l-2 border-b-2 rounded-bl-md',
    kananBawah: 'right-0 bottom-0 border-r-2 border-b-2 rounded-br-md',
  }[posisi];

  return (
    <View
      style={{ borderColor: tema.textInverse, width: 28, height: 28 }}
      className={`absolute ${gaya}`}
    />
  );
}

/**
 * Panel kamera sesuai referensi 03-qr-scanner: kotak navy gelap membulat.
 * Tanpa izin, panel menampilkan ikon kamera dan teks "Akses kamera diperlukan".
 * Dengan izin, panel menampilkan viewfinder, tombol senter, dan kontrol zoom.
 */
export function PanelKamera({
  izinDiberikan,
  memuatIzin,
  senter,
  zoom,
  onPutarSenter,
  onTambahZoom,
  onKurangiZoom,
  onTerdeteksi,
  terkunci,
}: PanelKameraProps) {
  const tema = useTheme();

  return (
    <View className="overflow-hidden rounded-xl bg-overlay">
      <View className="aspect-square w-full items-center justify-center">
        {izinDiberikan && !memuatIzin ? (
          <>
            <CameraView
              // `className` tidak dipetakan NativeWind ke komponen native pihak
              // ketiga tanpa `cssInterop`, jadi pratinjau diberi ukuran lewat
              // `style`. Tanpa ini kamera berukuran nol dan tetap bisa memindai.
              style={StyleSheet.absoluteFill}
              enableTorch={senter}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={
                terkunci
                  ? undefined
                  : (hasil) => {
                      onTerdeteksi(hasil.data);
                    }
              }
              zoom={zoom}
            />

            {/* Lapisan pandu di atas pratinjau kamera. */}
            <View
              accessible={false}
              className="absolute inset-0 items-center justify-center"
              pointerEvents="none"
            >
              <View className="relative h-2/5 w-3/5">
                <SudutBingkai posisi="kiriAtas" />
                <SudutBingkai posisi="kananAtas" />
                <SudutBingkai posisi="kiriBawah" />
                <SudutBingkai posisi="kananBawah" />

                <View
                  className="absolute left-0 right-0 top-1/2 h-half"
                  style={{ backgroundColor: tema.textInverse }}
                />
              </View>
            </View>

            <Pressable
              accessibilityLabel={senter ? 'Matikan senter' : 'Nyalakan senter'}
              accessibilityRole="button"
              onPress={onPutarSenter}
              className="absolute right-three top-three h-touch w-touch items-center justify-center rounded-md bg-overlay/40 active:scale-95"
            >
              <SymbolView
                name={
                  senter
                    ? { ios: 'lightbulb.fill', android: 'flashlight_on', web: 'flashlight_on' }
                    : { ios: 'lightbulb.slash', android: 'flashlight_off', web: 'flashlight_off' }
                }
                size={20}
                tintColor={tema.textInverse}
              />
            </Pressable>

            <View className="absolute bottom-three left-0 right-0 items-center">
              <View className="flex-row items-center gap-three">
                <Pressable
                  accessibilityLabel="Kurangi zoom"
                  accessibilityRole="button"
                  onPress={onKurangiZoom}
                  className="h-touch w-touch items-center justify-center rounded-pill bg-overlay/40 active:scale-95"
                >
                  <Text className="text-body font-semibold text-textInverse">−</Text>
                </Pressable>

                <Text className="w-12 text-center text-small font-semibold text-textInverse">
                  {Math.round(zoom * 100)}%
                </Text>

                <Pressable
                  accessibilityLabel="Tambah zoom"
                  accessibilityRole="button"
                  onPress={onTambahZoom}
                  className="h-touch w-touch items-center justify-center rounded-pill bg-overlay/40 active:scale-95"
                >
                  <Text className="text-body font-semibold text-textInverse">+</Text>
                </Pressable>
              </View>

              <Text className="mt-two text-small text-textInverse">
                Tempatkan QR di dalam bingkai
              </Text>
            </View>
          </>
        ) : (
          <View className="items-center px-four">
            <SymbolView
              name={{ ios: 'camera', android: 'photo_camera', web: 'photo_camera' }}
              size={44}
              tintColor={tema.textInverse}
            />

            <Text className="mt-four text-body font-semibold text-textInverse">
              Akses kamera diperlukan
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export type { PanelKameraProps };
