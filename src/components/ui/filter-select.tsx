import { useRef, useState, type ComponentRef } from 'react';
import { Animated, Modal, Pressable, Text, useWindowDimensions } from 'react-native';

import { Spacing } from '@/constants/theme';

import { useAnimasiMuncul } from './motion';
import { gayaBayangan } from './shadow-style';

const DURASI = 150;
const LEBAR_MENU = 220;

type FilterSelectProps = {
  /** Nama dimensi filter, mis. "Status" atau "Kategori". */
  label: string;
  nilai: string;
  opsi: { nilai: string; label: string }[];
  onPilih: (nilai: string) => void;
  className?: string;
};

/**
 * Tombol filter dengan menu dropdown, mengikuti referensi layar izin asisten.
 * Menampilkan nama dimensi, bukan nilai terpilih, sama seperti acuan. Pilihan
 * aktif ditandai centang agar tetap terbaca tanpa warna saja.
 */
export function FilterSelect({
  label,
  nilai,
  opsi,
  onPilih,
  className = '',
}: FilterSelectProps) {
  const [terbuka, setTerbuka] = useState(false);
  const [posisi, setPosisi] = useState({ atas: 0, kiri: 0 });
  const pemicu = useRef<ComponentRef<typeof Pressable>>(null);
  const { width: lebarLayar } = useWindowDimensions();
  const progres = useAnimasiMuncul(terbuka, DURASI);

  const terpilih = opsi.find((item) => item.nilai === nilai);
  const skala = progres.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] });

  function buka() {
    pemicu.current?.measureInWindow((x, y, lebar, tinggi) => {
      const kiri = Math.min(
        x,
        Math.max(Spacing.three, lebarLayar - LEBAR_MENU - Spacing.three),
      );

      setPosisi({ atas: y + tinggi + Spacing.one, kiri });
      setTerbuka(true);
    });
  }

  function pilih(nilaiBaru: string) {
    setTerbuka(false);
    onPilih(nilaiBaru);
  }

  return (
    <>
      <Pressable
        ref={pemicu}
        accessibilityLabel={`${label}. Terpilih ${terpilih?.label ?? 'semua'}`}
        accessibilityRole="button"
        accessibilityState={{ expanded: terbuka }}
        onPress={buka}
        className={`min-h-touch flex-row items-center gap-one rounded-pill bg-backgroundSelected px-three active:scale-95 ${className}`}
      >
        <Text className="text-small font-semibold text-text">{label}</Text>
        <Text className="text-small text-textSecondary">▾</Text>
      </Pressable>

      <Modal
        animationType="none"
        onRequestClose={() => setTerbuka(false)}
        statusBarTranslucent
        transparent
        visible={terbuka}
      >
        <Pressable
          accessibilityLabel={`Tutup pilihan ${label}`}
          accessibilityRole="button"
          className="absolute inset-0 bg-overlay/40"
          onPress={() => setTerbuka(false)}
        />

        <Animated.View
          accessibilityViewIsModal
          className="absolute rounded-md bg-backgroundElement p-two"
          style={[
            gayaBayangan,
            {
              top: posisi.atas,
              left: posisi.kiri,
              width: LEBAR_MENU,
              opacity: progres,
              transform: [{ scale: skala }],
            },
          ]}
        >
          {opsi.map((item) => {
            const aktif = item.nilai === nilai;

            return (
              <Pressable
                key={item.nilai}
                accessibilityLabel={item.label}
                accessibilityRole="button"
                accessibilityState={{ selected: aktif }}
                onPress={() => pilih(item.nilai)}
                className="min-h-touch flex-row items-center justify-between rounded-sm px-two active:bg-backgroundSelected"
              >
                <Text
                  className={`text-body ${aktif ? 'font-semibold text-primary' : 'text-text'}`}
                >
                  {item.label}
                </Text>

                {aktif ? <Text className="text-body text-primary">✓</Text> : null}
              </Pressable>
            );
          })}
        </Animated.View>
      </Modal>
    </>
  );
}

export type { FilterSelectProps };
