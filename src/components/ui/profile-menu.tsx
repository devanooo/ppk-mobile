import { useRef, useState, type ComponentRef } from 'react';
import { Animated, Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { Peran, User } from '@/types';

import { useAnimasiMuncul } from './motion';
import { gayaBayangan } from './shadow-style';

const DURASI = 150;

const LABEL_PERAN: Record<Peran, string> = {
  praktikan: 'Praktikan',
  asisten: 'Asisten',
};

type ProfileMenuProps = {
  user: User;
  onHome: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
};

export function ProfileMenu({ user, onHome, onSwitchRole, onLogout }: ProfileMenuProps) {
  const [terbuka, setTerbuka] = useState(false);
  const [posisi, setPosisi] = useState({ atas: 0, kanan: 0 });
  const pemicu = useRef<ComponentRef<typeof Pressable>>(null);
  const { width: lebarLayar } = useWindowDimensions();
  const progres = useAnimasiMuncul(terbuka, DURASI);

  function bukaMenu() {
    pemicu.current?.measureInWindow((x, y, lebar, tinggi) => {
      setPosisi({ atas: y + tinggi + Spacing.one, kanan: lebarLayar - (x + lebar) });
      setTerbuka(true);
    });
  }

  function tutupLalu(aksi: () => void) {
    setTerbuka(false);
    aksi();
  }

  const skala = progres.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });

  return (
    <>
      <Pressable
        ref={pemicu}
        accessibilityLabel="Menu profil"
        accessibilityRole="button"
        onPress={bukaMenu}
        className="h-touch w-touch items-center justify-center rounded-pill bg-primary active:scale-95"
      >
        <Text className="text-body font-semibold text-primaryText">
          {user.nama.trim().charAt(0).toUpperCase()}
        </Text>
      </Pressable>

      <Modal
        animationType="none"
        onRequestClose={() => setTerbuka(false)}
        statusBarTranslucent
        transparent
        visible={terbuka}
      >
        <Pressable
          accessibilityLabel="Tutup menu profil"
          accessibilityRole="button"
          className="absolute inset-0"
          onPress={() => setTerbuka(false)}
        />

        <Animated.View
          className="absolute w-menuWidth rounded-md bg-backgroundElement p-two"
          style={[gayaBayangan, { top: posisi.atas, right: posisi.kanan, opacity: progres, transform: [{ scale: skala }] }]}
        >
          <View className="px-two pb-three pt-two">
            <Text className="text-body font-semibold text-text">{user.nama}</Text>
            <Text className="mt-half text-caption text-textSecondary">
              {user.nomorInduk} · {LABEL_PERAN[user.peran]}
            </Text>
          </View>

          <View className="my-two h-half bg-border" />

          <ItemMenu label="Beranda" onPress={() => tutupLalu(onHome)} />
          <ItemMenu label="Ganti peran (demo)" onPress={() => tutupLalu(onSwitchRole)} />
          <ItemMenu label="Keluar akun" onPress={() => tutupLalu(onLogout)} bahaya />
        </Animated.View>
      </Modal>
    </>
  );
}

function ItemMenu({
  label,
  onPress,
  bahaya = false,
}: {
  label: string;
  onPress: () => void;
  bahaya?: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-touch justify-center rounded-sm px-two active:scale-95"
    >
      <Text className={`text-body ${bahaya ? 'text-danger' : 'text-text'}`}>{label}</Text>
    </Pressable>
  );
}

export type { ProfileMenuProps };
