
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Card, EmptyState, Screen, StatusBadge } from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSesiAsisten } from '@/features/asisten/use-sesi-asisten';
import {
  dengarkanPresensiSesi,
  type PresensiDetail,
} from '@/lib/presensi';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';
import { formatTanggal } from '@/features/praktikan/format-sesi';

export default function RekapAsistenScreen() {
  const { user } = useSession();

  const { sesi, status, pesanGalat } = useSesiAsisten(
    db,
    user?.peran === 'asisten' ? user.id : undefined,
  );

  const [presensiPerSesi, setPresensiPerSesi] = useState<
    Record<string, PresensiDetail[]>
  >({});

  const [galatPresensi, setGalatPresensi] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!user || user.peran !== 'asisten') {
      return;
    }

    const berhentiMendengar = sesi.map((item) =>
      dengarkanPresensiSesi(db, item.id, (hasil) => {
        if (hasil.ok) {
          setPresensiPerSesi((sebelumnya) => ({
            ...sebelumnya,
            [item.id]: hasil.data,
          }));

          setGalatPresensi((sebelumnya) => {
            const berikutnya = { ...sebelumnya };
            delete berikutnya[item.id];
            return berikutnya;
          });
        } else {
          setGalatPresensi((sebelumnya) => ({
            ...sebelumnya,
            [item.id]: hasil.pesan,
          }));
        }
      }),
    );

    return () => {
      berhentiMendengar.forEach((berhenti) => berhenti());
    };
  }, [user, sesi]);

  const daftarSesi = useMemo(
    () =>
      [...sesi].sort((a, b) =>
        `${b.tanggal}T${b.jamMulai}`.localeCompare(
          `${a.tanggal}T${a.jamMulai}`,
        ),
      ),
    [sesi],
  );

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
    (total, item) =>
      total + (presensiPerSesi[item.id]?.length ?? 0),
    0,
  );

  const semuaPresensiDimuat = sesiSelesai.every(
    (item) =>
      Object.prototype.hasOwnProperty.call(
        presensiPerSesi,
        item.id,
      ) || Boolean(galatPresensi[item.id]),
  );

  const persentaseKehadiran =
    totalPesertaSelesai > 0
      ? Math.round((totalHadir / totalPesertaSelesai) * 100)
      : 0;

  const statistik = [
    { label: 'Total sesi', nilai: daftarSesi.length },
    { label: 'Sesi selesai', nilai: sesiSelesai.length },
    { label: 'Sedang dibuka', nilai: sesiBerjalan },
    { label: 'Belum dibuka', nilai: sesiBelumDibuka },
  ];

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pt-three pb-five"
      >
        <View
          className="w-full self-center"
          style={{ maxWidth: MaxContentWidth }}
        >
          <View className="mb-four flex-row items-start justify-between gap-three">
            <View className="flex-1">
              <Text className="text-title font-semibold text-text">
                Rekap Sesi
              </Text>

              <Text className="mt-one text-body text-textSecondary">
                Ringkasan pelaksanaan praktikum dan kehadiran peserta.
              </Text>
            </View>

            <MenuProfilAsisten />
          </View>

          {status === 'memuat' ? (
            <Card>
              <Text className="text-body text-textSecondary">
                Memuat data rekap...
              </Text>
            </Card>
          ) : status === 'gagal' ? (
            <Card>
              <EmptyState
                judul="Gagal memuat rekap"
                deskripsi={pesanGalat ?? 'Periksa koneksi dan coba lagi.'}
              />
            </Card>
          ) : daftarSesi.length === 0 ? (
            <Card>
              <EmptyState
                judul="Belum ada data rekap"
                deskripsi="Data rekap sesi akan muncul di sini."
              />
            </Card>
          ) : (
            <>
              <View className="mb-three flex-row flex-wrap gap-three">
                {statistik.map((item) => (
                  <View key={item.label} className="min-w-0 flex-1">
                    <Card>
                      <Text className="text-small text-textSecondary">
                        {item.label}
                      </Text>

                      <Text className="mt-two text-title font-semibold text-text">
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
                    {semuaPresensiDimuat ? totalHadir : 'Memuat...'}
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

                  <Text className="mt-one text-title font-semibold text-text">
                    {semuaPresensiDimuat
                      ? `${persentaseKehadiran}%`
                      : 'Memuat...'}
                  </Text>

                  <View className="mt-two h-two overflow-hidden rounded-pill bg-backgroundSelected">
                    <View
                      className="h-full rounded-pill bg-primary"
                      style={{
                        width: `${
                          semuaPresensiDimuat
                            ? persentaseKehadiran
                            : 0
                        }%`,
                      }}
                    />
                  </View>
                </View>
              </Card>

              <Text className="mb-three text-subtitle font-semibold text-text">
                Rekap Per Sesi
              </Text>

              {daftarSesi.map((item) => {
                const dataPresensi = presensiPerSesi[item.id];
                const jumlahHadir = dataPresensi?.length ?? 0;
                const jumlahPeserta = item.pesertaIds.length;

                const persentase =
                  jumlahPeserta > 0
                    ? Math.round(
                        (jumlahHadir / jumlahPeserta) * 100,
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
                    accessibilityLabel={`Lihat detail sesi ${item.namaKelas}`}
                  >
                    <View className="flex-row items-start justify-between gap-two">
                      <View className="flex-1">
                        <Text className="text-subtitle font-semibold text-text">
                          {item.namaKelas}
                        </Text>

                        <Text className="mt-one text-small text-textSecondary">
                          Lab {item.lab}
                        </Text>
                      </View>

                      <StatusBadge status={item.status} />
                    </View>

                    <View className="mt-three border-t border-border pt-three">
                      <Text className="text-body text-text">
                        {item.hari}, {formatTanggal(item.tanggal)}
                      </Text>

                      <Text className="mt-one text-small text-textSecondary">
                        {item.jamMulai} - {item.jamSelesai}
                      </Text>

                      {galatPresensi[item.id] ? (
                        <Text className="mt-three text-small text-textSecondary">
                          Gagal memuat kehadiran: {galatPresensi[item.id]}
                        </Text>
                      ) : dataPresensi === undefined ? (
                        <Text className="mt-three text-small text-textSecondary">
                          Memuat data kehadiran...
                        </Text>
                      ) : (
                        <>
                          <View className="mt-three flex-row items-center justify-between">
                            <Text className="text-body text-textSecondary">
                              Kehadiran
                            </Text>

                            <Text className="text-body font-semibold text-text">
                              {jumlahHadir} dari {jumlahPeserta} peserta
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
                      )}
                    </View>
                  </Card>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
