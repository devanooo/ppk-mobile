import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  ProfileMenu,
  Screen,
  StatusBadge,
  teksKosong,
} from '@/components/ui';
import { useSession } from '@/store/session-store';
import type { Sesi } from '@/types';

function formatTanggal(tanggal: string) {
  const bagian = tanggal.split('-');

  if (bagian.length !== 3) {
    return tanggal;
  }

  const [tahun, bulan, hari] = bagian;

  const namaBulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const nomorBulan = Number(bulan) - 1;

  if (!namaBulan[nomorBulan]) {
    return tanggal;
  }

  return `${Number(hari)} ${namaBulan[nomorBulan]} ${tahun}`;
}

function KartuJadwal({ sesi }: { sesi: Sesi }) {
  return (
    <Card
      onPress={() =>
        router.push({
          pathname: '/(asisten)/jadwal/[id]',
          params: { id: sesi.id },
        })
      }
      accessibilityLabel={`Lihat detail sesi ${sesi.namaPraktikum}`}
      className="mb-three"
    >
      <View className="flex-row items-start justify-between gap-two">
        <View className="flex-1">
          <Text className="text-subtitle font-semibold text-text">
            {sesi.namaPraktikum}
          </Text>

          <Text className="mt-one text-small text-textSecondary">
            Kelas {sesi.kelas} · {sesi.lab}
          </Text>
        </View>

        <StatusBadge status={sesi.status} />
      </View>

      <View className="mt-three border-t border-border pt-three">
        <Text className="text-body text-text">
          {formatTanggal(sesi.tanggal)}
        </Text>

        <Text className="mt-one text-small text-textSecondary">
          {sesi.jamMulai}–{sesi.jamSelesai}
        </Text>
      </View>

      <Text className="mt-three text-small font-medium text-action">
        Lihat detail sesi →
      </Text>
    </Card>
  );
}

export default function JadwalAsistenScreen() {
  const { user, sesiUntuk, gantiPeranDemo, logout } = useSession();

  const jadwal = useMemo(() => {
    if (!user || user.peran !== 'asisten') {
      return [];
    }

    return [...sesiUntuk(user)].sort((a, b) => {
      const waktuA = `${a.tanggal}T${a.jamMulai}`;
      const waktuB = `${b.tanggal}T${b.jamMulai}`;

      return waktuA.localeCompare(waktuB);
    });
  }, [user, sesiUntuk]);

  function gantiPeran() {
    const penggunaBaru = gantiPeranDemo();

    if (penggunaBaru) {
      router.replace('/');
    }
  }

  function keluarAkun() {
    logout();
    router.replace('/');
  }

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        <View className="mb-four flex-row items-start justify-between gap-three">
          <View className="flex-1">
            <Text className="text-title font-bold text-text">
              Jadwal Asisten
            </Text>

            <Text className="mt-one text-body text-textSecondary">
              Lihat sesi praktikum yang menjadi tanggung jawabmu.
            </Text>
          </View>

          {user ? (
            <ProfileMenu
              user={user}
              onHome={() => router.replace('/')}
              onSwitchRole={gantiPeran}
              onLogout={keluarAkun}
            />
          ) : null}
        </View>

        {user?.peran !== 'asisten' ? (
          <Card>
            <EmptyState
              judul="Akun asisten belum aktif"
              deskripsi="Gunakan akun asisten untuk melihat jadwal."
            />
          </Card>
        ) : jadwal.length === 0 ? (
          <Card>
            <EmptyState
              judul={teksKosong.jadwal.judul}
              deskripsi={teksKosong.jadwal.deskripsi}
            />
          </Card>
        ) : (
          <>
            <Text className="mb-three text-small text-textSecondary">
              {jadwal.length} sesi praktikum
            </Text>

            {jadwal.map((item) => (
              <KartuJadwal key={item.id} sesi={item} />
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}