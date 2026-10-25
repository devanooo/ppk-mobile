import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Card, EmptyState, Screen, StatusBadge } from '@/components/ui';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSession } from '@/store/session-store';

function formatTanggal(tanggal: string) {
  const [tahun, bulan, hari] = tanggal.split('-').map(Number);

  const namaBulan = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  return `${hari} ${namaBulan[bulan - 1]} ${tahun}`;
}

export default function RekapAsistenScreen() {
  const { user, sesiUntuk, rekapSesi } = useSession();

  const daftarSesi = useMemo(() => {
    if (!user || user.peran !== 'asisten') {
      return [];
    }

    return [...sesiUntuk(user)].sort((a, b) => {
      const waktuA = `${a.tanggal}T${a.jamMulai}`;
      const waktuB = `${b.tanggal}T${b.jamMulai}`;

      return waktuA.localeCompare(waktuB);
    });
  }, [user, sesiUntuk]);

  if (!user || user.peran !== 'asisten') {
    return (
      <Screen>
        <Card>
          <EmptyState
            judul="Akun asisten belum aktif"
            deskripsi="Gunakan akun asisten untuk melihat rekap sesi."
          />
        </Card>
      </Screen>
    );
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
              Rekap Sesi
            </Text>

            <Text className="mt-one text-body text-textSecondary">
              Ringkasan pelaksanaan praktikum dan kehadiran peserta.
            </Text>
          </View>

          <MenuProfilAsisten />
        </View>

        {daftarSesi.length === 0 ? (
          <Card>
            <EmptyState
              judul="Belum ada data rekap"
              deskripsi="Data rekap sesi akan muncul di sini."
            />
          </Card>
        ) : (
          <IsiRekap daftarSesi={daftarSesi} rekapSesi={rekapSesi} />
        )}
      </ScrollView>
    </Screen>
  );
}

function IsiRekap({
  daftarSesi,
  rekapSesi,
}: {
  daftarSesi: ReturnType<
    ReturnType<typeof useSession>['sesiUntuk']
  >;
  rekapSesi: ReturnType<typeof useSession>['rekapSesi'];
}) {
  const jumlahSesi = daftarSesi.length;

  const sesiSelesai = daftarSesi.filter(
    (item) => item.status === 'ditutup',
  );

  const sesiBerjalan = daftarSesi.filter(
    (item) => item.status === 'dibuka',
  ).length;

  const sesiBelumDibuka = daftarSesi.filter(
    (item) => item.status === 'belum-dibuka',
  ).length;

  const totalPesertaSelesai = sesiSelesai.reduce(
    (total, item) => total + item.pesertaIds.length,
    0,
  );

  const totalHadir = sesiSelesai.reduce(
    (total, item) => total + rekapSesi(item.id).length,
    0,
  );

  const persentaseKehadiran =
    totalPesertaSelesai > 0
      ? Math.round((totalHadir / totalPesertaSelesai) * 100)
      : 0;

  const statistik = [
    { label: 'Total sesi', nilai: jumlahSesi },
    { label: 'Sesi selesai', nilai: sesiSelesai.length },
    { label: 'Sedang dibuka', nilai: sesiBerjalan },
    { label: 'Belum dibuka', nilai: sesiBelumDibuka },
  ];

  return (
    <>
      <View className="mb-three flex-row flex-wrap gap-three">
        {statistik.map((item) => (
          <View key={item.label} className="min-w-0 flex-1">
            <Card>
              <Text className="text-small text-textSecondary">
                {item.label}
              </Text>

              <Text className="mt-two text-title font-bold text-text">
                {item.nilai}
              </Text>
            </Card>
          </View>
        ))}
      </View>

      <Card className="mb-four">
        <Text className="text-subtitle font-semibold text-text">
          Ringkasan Kehadiran
        </Text>

        <View className="mt-three flex-row items-center justify-between">
          <Text className="text-body text-textSecondary">
            Total presensi sesi selesai
          </Text>

          <Text className="text-body font-semibold text-text">
            {totalHadir}
          </Text>
        </View>

        <View className="mt-two flex-row items-center justify-between">
          <Text className="text-body text-textSecondary">
            Total peserta sesi selesai
          </Text>

          <Text className="text-body font-semibold text-text">
            {totalPesertaSelesai}
          </Text>
        </View>

        <View className="mt-three border-t border-border pt-three">
          <Text className="text-small text-textSecondary">
            Persentase kehadiran
          </Text>

          <Text className="mt-one text-title font-bold text-text">
            {persentaseKehadiran}%
          </Text>

          <View className="mt-two h-two overflow-hidden rounded-pill bg-backgroundSelected">
            <View
              className="h-full rounded-pill bg-primary"
              style={{ width: `${persentaseKehadiran}%` }}
            />
          </View>
        </View>
      </Card>

      <Text className="mb-three text-subtitle font-semibold text-text">
        Rekap Per Sesi
      </Text>

      {daftarSesi.map((item) => {
        const jumlahHadir = rekapSesi(item.id).length;
        const sesiSudahDibuka = item.status !== 'belum-dibuka';

        const persentase =
          sesiSudahDibuka && item.pesertaIds.length > 0
            ? Math.round(
                (jumlahHadir / item.pesertaIds.length) * 100,
              )
            : 0;

        return (
          <Card
            key={item.id}
            className="mb-three"
            onPress={() =>
              router.push({
                pathname: '/(asisten)/jadwal/[id]',
                params: {
                  id: item.id,
                  from: 'rekap',
                },
              })
            }
            accessibilityLabel={`Lihat detail sesi ${item.namaPraktikum}`}
          >
            <View className="flex-row items-start justify-between gap-two">
              <View className="flex-1">
                <Text className="text-subtitle font-semibold text-text">
                  {item.namaPraktikum}
                </Text>

                <Text className="mt-one text-small text-textSecondary">
                  Kelas {item.kelas} · {item.lab}
                </Text>
              </View>

              <StatusBadge status={item.status} />
            </View>

            <View className="mt-three border-t border-border pt-three">
              <Text className="text-body text-text">
                {item.hari}, {formatTanggal(item.tanggal)}
              </Text>

              <Text className="mt-one text-small text-textSecondary">
                {item.jamMulai}–{item.jamSelesai}
              </Text>

              {sesiSudahDibuka ? (
                <>
                  <View className="mt-three flex-row items-center justify-between">
                    <Text className="text-body text-textSecondary">
                      Kehadiran
                    </Text>

                    <Text className="text-body font-semibold text-text">
                      {jumlahHadir} dari {item.pesertaIds.length} peserta
                    </Text>
                  </View>

                  <Text className="mt-one text-small text-textSecondary">
                    Persentase kehadiran: {persentase}%
                  </Text>

                  <View className="mt-two h-two overflow-hidden rounded-pill bg-backgroundSelected">
                    <View
                      className="h-full rounded-pill bg-primary"
                      style={{ width: `${persentase}%` }}
                    />
                  </View>
                </>
              ) : (
                <Text className="mt-three text-small text-textSecondary">
                  Sesi belum dibuka. Kehadiran akan tampil setelah sesi dibuka.
                </Text>
              )}
            </View>

            <Text className="mt-three text-small font-medium text-text">
              Lihat detail sesi →
            </Text>
          </Card>
        );
      })}
    </>
  );
}