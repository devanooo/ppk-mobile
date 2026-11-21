import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  IconButton,
  Screen,
  SectionHeader,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSesiAsisten } from '@/features/asisten/use-sesi-asisten';
import { useIzinAsisten } from '@/features/izin/use-izin-asisten';
import { formatTanggal } from '@/features/praktikan/format-sesi';
import { useTheme } from '@/hooks/use-theme';
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

export default function RekapSesiScreen() {
  const { sesiId } = useLocalSearchParams<{ sesiId: string }>();
  const { user } = useSession();
  const theme = useTheme();
  const asistenId = user?.peran === 'asisten' ? user.id : undefined;

  const { sesi, status, pesanGalat } = useSesiAsisten(db, asistenId);
  const terpilih = sesi.find((item) => item.id === sesiId);

  const sesiIds = useMemo(() => [sesiId], [sesiId]);
  const { izin } = useIzinAsisten(db, asistenId, sesiIds);

  const [presensiHasil, setPresensiHasil] = useState<{
    sesiId: string;
    data: PresensiDetail[];
  }>();
  const [galatPresensiHasil, setGalatPresensiHasil] = useState<{
    sesiId: string;
    pesan: string;
  }>();

  useEffect(() => {
    if (!sesiId) return;

    return dengarkanPresensiSesi(db, sesiId, (hasil) => {
      if (hasil.ok) {
        setPresensiHasil({ sesiId, data: hasil.data });
        setGalatPresensiHasil(undefined);
        return;
      }

      setGalatPresensiHasil({ sesiId, pesan: hasil.pesan });
    });
  }, [sesiId]);

  const presensi =
    presensiHasil !== undefined && presensiHasil.sesiId === sesiId
      ? presensiHasil.data
      : undefined;
  const galatPresensi =
    galatPresensiHasil !== undefined && galatPresensiHasil.sesiId === sesiId
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
            (item) => item.sesiId === sesiId && item.status === 'disetujui',
          )
          .map((item) => item.praktikanId),
      ),
    [izin, sesiId],
  );

  const jumlahHadir = pesertaIds.filter((id) => hadirSet.has(id)).length;
  const jumlahIzin = pesertaIds.filter((id) => izinSet.has(id)).length;
  const jumlahTidakHadir = terpilih
    ? Math.max(pesertaIds.length - jumlahHadir - jumlahIzin, 0)
    : 0;

  const statusKetiga: StatusPeserta =
    terpilih?.status === 'ditutup' ? 'Tidak hadir' : 'Belum tercatat';

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
          <View className="flex-row items-center justify-between gap-two pt-three">
            <IconButton
              ikon={
                <SymbolView
                  name={{ ios: 'arrow.left', android: 'arrow_back' }}
                  size={20}
                  tintColor={theme.primary}
                />
              }
              label="Kembali ke daftar sesi"
              onPress={() => router.back()}
              variant="filled"
            />

            <MenuProfilAsisten />
          </View>

          {status === 'memuat' ? (
            <Card className="mt-four" tone="muted">
              <EmptyState
                judul="Memuat ringkasan"
                deskripsi="Sedang mengambil data sesi."
              />
            </Card>
          ) : status === 'gagal' ? (
            <Card className="mt-four" tone="muted">
              <EmptyState
                judul="Ringkasan gagal dimuat"
                deskripsi={pesanGalat ?? 'Periksa koneksi lalu coba lagi.'}
              />
            </Card>
          ) : !terpilih ? (
            <Card className="mt-four" tone="muted">
              <EmptyState
                judul="Sesi tidak ditemukan"
                deskripsi="Sesi ini mungkin sudah dihapus."
              />
            </Card>
          ) : (
            <>
              <Text
                accessibilityRole="header"
                className="mt-four text-title font-bold text-text"
              >
                Ringkasan kehadiran.
              </Text>

              <Text className="mt-two text-small text-textSecondary">
                {terpilih.namaKelas} · {terpilih.lab || 'Lab belum diisi'}
              </Text>

              <Text className="mt-one text-small text-textSecondary">
                {terpilih.hari}, {formatTanggal(terpilih.tanggal)} ·{' '}
                {terpilih.jamMulai}–{terpilih.jamSelesai}
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
                  nilai={jumlahTidakHadir}
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
                    router.replace({
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
                        {indeks > 0 ? <View className="h-half bg-border" /> : null}

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
