import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppHeader,
  Card,
  EmptyState,
  FilterSelect,
  Screen,
  SectionHeader,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSesiAsisten } from '@/features/asisten/use-sesi-asisten';
import { useIzinAsisten } from '@/features/izin/use-izin-asisten';
import { formatTanggal } from '@/features/praktikan/format-sesi';
import { db } from '@/lib/firebase';
import { bacaNamaPraktikan } from '@/lib/izin-sesi';
import { dengarkanPresensiSesi, type PresensiDetail } from '@/lib/presensi';
import { useSession } from '@/store/session-store';

type StatusPeserta = 'Hadir' | 'Izin' | 'Tidak hadir' | 'Belum tercatat';

const TONE_PESERTA: Record<
  StatusPeserta,
  'success' | 'neutral' | 'danger' | 'warning'
> = {
  Hadir: 'success',
  Izin: 'neutral',
  'Tidak hadir': 'danger',
  'Belum tercatat': 'warning',
};

export default function RekapAsistenScreen() {
  const { user } = useSession();

  const { sesi, status, pesanGalat } = useSesiAsisten(
    db,
    user?.peran === 'asisten' ? user.id : undefined,
  );

  const daftarSesi = useMemo(
    () =>
      [...sesi].sort((a, b) =>
        `${b.tanggal}T${b.jamMulai}`.localeCompare(`${a.tanggal}T${a.jamMulai}`),
      ),
    [sesi],
  );

  const sesiIds = useMemo(() => daftarSesi.map((item) => item.id), [daftarSesi]);

  const { izin } = useIzinAsisten(
    db,
    user?.peran === 'asisten' ? user.id : undefined,
    sesiIds,
  );

  const [idPilihan, setIdPilihan] = useState<string>();

  const idDefault = useMemo(() => {
    const selesai = daftarSesi.find((item) => item.status === 'ditutup');
    return (selesai ?? daftarSesi[0])?.id;
  }, [daftarSesi]);

  const idTerpilih = daftarSesi.some((item) => item.id === idPilihan)
    ? idPilihan
    : idDefault;

  const terpilih = daftarSesi.find((item) => item.id === idTerpilih);

  const [presensiHasil, setPresensiHasil] = useState<{
    sesiId: string;
    data: PresensiDetail[];
  }>();
  const [galatPresensiHasil, setGalatPresensiHasil] = useState<{
    sesiId: string;
    pesan: string;
  }>();

  useEffect(() => {
    if (!idTerpilih) return;

    return dengarkanPresensiSesi(db, idTerpilih, (hasil) => {
      if (hasil.ok) {
        setPresensiHasil({ sesiId: idTerpilih, data: hasil.data });
        setGalatPresensiHasil(undefined);
        return;
      }

      setGalatPresensiHasil({ sesiId: idTerpilih, pesan: hasil.pesan });
    });
  }, [idTerpilih]);

  const presensi =
    presensiHasil !== undefined && presensiHasil.sesiId === idTerpilih
      ? presensiHasil.data
      : undefined;
  const galatPresensi =
    galatPresensiHasil !== undefined &&
    galatPresensiHasil.sesiId === idTerpilih
      ? galatPresensiHasil.pesan
      : undefined;

  const pesertaIds = useMemo(
    () => terpilih?.pesertaIds ?? [],
    [terpilih],
  );
  const kunciPeserta = pesertaIds.join(',');

  const [namaHasil, setNamaHasil] = useState<{
    kunci: string;
    peta: Map<string, string>;
  }>();

  useEffect(() => {
    if (!kunciPeserta) return;

    let dibatalkan = false;

    bacaNamaPraktikan(db, pesertaIds).then((peta) => {
      if (!dibatalkan) setNamaHasil({ kunci: kunciPeserta, peta });
    });

    return () => {
      dibatalkan = true;
    };
  }, [kunciPeserta, pesertaIds]);

  const namaPeserta =
    namaHasil?.kunci === kunciPeserta
      ? namaHasil.peta
      : new Map<string, string>();

  const hadirSet = useMemo(
    () => new Set((presensi ?? []).map((item) => item.praktikanId)),
    [presensi],
  );

  const izinSet = useMemo(
    () =>
      new Set(
        izin
          .filter(
            (item) => item.sesiId === idTerpilih && item.status === 'disetujui',
          )
          .map((item) => item.praktikanId),
      ),
    [izin, idTerpilih],
  );

  const jumlahHadir = pesertaIds.filter((id) => hadirSet.has(id)).length;
  const jumlahIzin = pesertaIds.filter((id) => izinSet.has(id)).length;
  const jumlahTidakHadir = terpilih
    ? Math.max(pesertaIds.length - jumlahHadir - jumlahIzin, 0)
    : 0;

  const statusKetiga: StatusPeserta =
    terpilih?.status === 'ditutup' ? 'Tidak hadir' : 'Belum tercatat';
  const nilaiKetiga = jumlahTidakHadir;

  const opsiSesi = daftarSesi.map((item) => ({
    nilai: item.id,
    label: `${item.namaKelas} · ${formatTanggal(item.tanggal)}`,
  }));

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
    <Screen padded={false}>
      <ScrollView
        contentContainerClassName="pb-five"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full self-center px-three"
          style={{ maxWidth: MaxContentWidth }}
        >
          <AppHeader aksi={<MenuProfilAsisten />} className="pt-three" peran="asisten" />

          <Text
            accessibilityRole="header"
            className="mt-four text-title font-bold text-text"
          >
            Ringkasan kehadiran.
          </Text>

          {status === 'memuat' ? (
            <Card className="mt-four">
              <EmptyState
                judul="Memuat rekap"
                deskripsi="Sedang mengambil data sesi."
              />
            </Card>
          ) : status === 'gagal' ? (
            <Card className="mt-four">
              <EmptyState
                judul="Rekap gagal dimuat"
                deskripsi={pesanGalat ?? 'Periksa koneksi lalu coba lagi.'}
              />
            </Card>
          ) : daftarSesi.length === 0 ? (
            <Card className="mt-four">
              <EmptyState
                judul="Belum ada data rekap"
                deskripsi="Rekap akan muncul setelah kamu memiliki sesi."
              />
            </Card>
          ) : (
            <>
              <FilterSelect
                className="mt-four"
                label="Sesi"
                nilai={idTerpilih ?? ''}
                opsi={opsiSesi}
                onPilih={setIdPilihan}
                tampilkanNilai
              />

              {terpilih ? (
                <>
                  <Text className="mt-three text-small text-textSecondary">
                    {terpilih.namaKelas} · {terpilih.lab || 'Lab belum diisi'}
                  </Text>

                  <View className="mt-two">
                    <StatusBadge status={terpilih.status} />
                  </View>

                  <View className="mt-four flex-row items-start gap-four">
                    <AngkaRingkas
                      label="Hadir"
                      nilai={jumlahHadir}
                      warna="text-success"
                    />
                    <AngkaRingkas
                      label="Izin"
                      nilai={jumlahIzin}
                      warna="text-primary"
                    />
                    <AngkaRingkas
                      label={statusKetiga}
                      nilai={nilaiKetiga}
                      warna={
                        statusKetiga === 'Tidak hadir'
                          ? 'text-danger'
                          : 'text-textSecondary'
                      }
                    />
                  </View>

                  <Text className="mt-two text-small text-textSecondary">
                    {pesertaIds.length} praktikan terdaftar
                  </Text>

                  <View className="mt-four h-half bg-border" />

                  <SectionHeader
                    aksi={{
                      label: 'Detail sesi',
                      onPress: () =>
                        router.push({
                          pathname: '/(asisten)/jadwal/[id]',
                          params: { id: terpilih.id, from: 'rekap' },
                        }),
                    }}
                    className="mt-four"
                    judul="Daftar praktikan"
                  />

                  {galatPresensi ? (
                    <Text className="mt-three text-small text-textSecondary">
                      Gagal memuat kehadiran: {galatPresensi}
                    </Text>
                  ) : presensi === undefined ? (
                    <Text className="mt-three text-small text-textSecondary">
                      Memuat kehadiran...
                    </Text>
                  ) : pesertaIds.length === 0 ? (
                    <Text className="mt-three text-small text-textSecondary">
                      Belum ada praktikan terdaftar pada sesi ini.
                    </Text>
                  ) : (
                    <View className="mt-two">
                      {pesertaIds.map((praktikanId, indeks) => {
                        const hadir = hadirSet.has(praktikanId);
                        const izinDisetujui = izinSet.has(praktikanId);

                        const statusPeserta: StatusPeserta = hadir
                          ? 'Hadir'
                          : izinDisetujui
                            ? 'Izin'
                            : terpilih.status === 'ditutup'
                              ? 'Tidak hadir'
                              : 'Belum tercatat';

                        const waktu = presensi.find(
                          (item) => item.praktikanId === praktikanId,
                        )?.waktu;

                        return (
                          <View key={praktikanId}>
                            {indeks > 0 ? (
                              <View className="h-half bg-border" />
                            ) : null}

                            <View className="flex-row items-start justify-between gap-two py-three">
                              <View className="flex-1">
                                <Text className="text-body font-bold text-text">
                                  {namaPeserta.get(praktikanId) ?? 'Praktikan'}
                                </Text>

                                <Text className="mt-half text-small text-textSecondary">
                                  {hadir && waktu
                                    ? `Tercatat pukul ${formatJam(waktu)}`
                                    : statusPeserta === 'Izin'
                                      ? 'Izin disetujui'
                                      : 'Tidak tercatat'}
                                </Text>
                              </View>

                              <StatusBadge
                                className="shrink-0"
                                label={statusPeserta}
                                tone={TONE_PESERTA[statusPeserta]}
                              />
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

function AngkaRingkas({
  label,
  nilai,
  warna,
}: {
  label: string;
  nilai: number;
  warna: string;
}) {
  return (
    <View className="flex-1">
      <Text className={`text-display font-bold ${warna}`}>{nilai}</Text>
      <Text className="mt-one text-small text-textSecondary">{label}</Text>
    </View>
  );
}

function formatJam(waktu: Date): string {
  return waktu.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
