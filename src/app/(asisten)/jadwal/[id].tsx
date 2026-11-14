
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  BottomSheet,
  Card,
  EmptyState,
  HomeButton,
  Screen,
  StatusBadge,
} from '@/components/ui';
import { MaxContentWidth } from '@/constants/theme';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSesiAsisten } from '@/features/asisten/use-sesi-asisten';
import { db } from '@/lib/firebase';
import {
  dengarkanPresensiSesi,
  type PresensiDetail,
} from '@/lib/presensi';
import {
  bukaSesi,
  tutupSesi,
} from '@/lib/sesi';
import { useSession } from '@/store/session-store';

type AksiSesi = 'buka' | 'tutup';
type StatusPresensi = 'memuat' | 'siap' | 'gagal';

export default function DetailSesiAsistenScreen() {
  const { id, from } = useLocalSearchParams<{
    id: string;
    from?: string;
  }>();

  const sesiId = Array.isArray(id) ? id[0] : id;
  const { user } = useSession();

  const hasilSesi = useSesiAsisten(
    db,
    user?.peran === 'asisten' ? user.id : undefined,
  );

  const sesi = hasilSesi.sesi.find(
    (item) => item.id === sesiId,
  );

  const [aksiDipilih, setAksiDipilih] =
    useState<AksiSesi | null>(null);

  const [pesan, setPesan] = useState('');
  const [jenisPesan, setJenisPesan] =
    useState<'sukses' | 'gagal'>('sukses');

  const [daftarPresensi, setDaftarPresensi] =
    useState<PresensiDetail[]>([]);

  const [statusPresensi, setStatusPresensi] =
    useState<StatusPresensi>('memuat');

  const [pesanPresensi, setPesanPresensi] = useState('');
  const [sesiPresensiId, setSesiPresensiId] = useState('');

  useEffect(() => {
    if (!sesiId || !sesi) return;

    let aktif = true;

    const berhenti = dengarkanPresensiSesi(
      db,
      sesi.id,
      (hasil) => {
        if (!aktif) return;

        setSesiPresensiId(sesi.id);

        if (hasil.ok) {
          setDaftarPresensi(hasil.data);
          setStatusPresensi('siap');
          setPesanPresensi('');
        } else {
          setStatusPresensi('gagal');
          setPesanPresensi(hasil.pesan);
        }
      },
    );

    return () => {
      aktif = false;
      berhenti();
    };
  }, [sesiId, sesi]);

  const presensiSedangDimuat =
    sesiPresensiId !== sesi?.id ||
    statusPresensi === 'memuat';

  function kembali() {
    if (from === 'rekap') {
      router.replace('/(asisten)/rekap');
      return;
    }

    router.replace('/(asisten)/jadwal');
  }

  async function konfirmasiAksi() {
    if (!sesi || !user || !aksiDipilih) return;

    const hasil =
      aksiDipilih === 'buka'
        ? await bukaSesi({
            db,
            sesiId: sesi.id,
            asistenId: user.id,
          })
        : await tutupSesi({
            db,
            sesiId: sesi.id,
            asistenId: user.id,
          });

    setPesan(hasil.pesan);
    setJenisPesan(hasil.ok ? 'sukses' : 'gagal');
    setAksiDipilih(null);
  }

  if (!user || user.peran !== 'asisten') {
    return (
      <HalamanKosong
        judul="Akun asisten belum aktif"
        deskripsi="Gunakan akun asisten untuk melihat detail sesi."
        kembali={kembali}
      />
    );
  }

  if (hasilSesi.status === 'memuat') {
    return (
      <HalamanKosong
        judul="Memuat detail sesi"
        deskripsi="Sedang mengambil data sesi dari Firebase."
        kembali={kembali}
      />
    );
  }

  if (hasilSesi.status === 'gagal') {
    return (
      <HalamanKosong
        judul="Detail sesi gagal dimuat"
        deskripsi={
          hasilSesi.pesanGalat ??
          'Terjadi kesalahan saat mengambil sesi.'
        }
        kembali={kembali}
      />
    );
  }

  if (!sesi) {
    return (
      <HalamanKosong
        judul="Sesi tidak ditemukan"
        deskripsi="Sesi ini tidak tersedia untuk akun asistenmu."
        kembali={kembali}
      />
    );
  }

  return (
    <Screen padded={false}>
      <View
        className="w-full flex-1 self-center"
        style={{ maxWidth: MaxContentWidth }}
      >
        <View className="flex-row items-center justify-between gap-two px-three pt-two">
          <HomeButton onPress={kembali} />
          <MenuProfilAsisten />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-five"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-three pt-three">
            <Text
              accessibilityRole="header"
              className="text-title font-semibold text-text"
            >
              {sesi.namaKelas}
            </Text>

            <StatusBadge
              className="mt-two"
              status={sesi.status}
            />
          </View>

          {pesan ? (
            <View className="px-three pt-three">
              <Banner
                jenis={jenisPesan}
                pesan={pesan}
                onTutup={() => setPesan('')}
              />
            </View>
          ) : null}

          <View className="px-three">
            <Card className="mt-four">
              <BarisInfo
                label="Jadwal"
                nilai={formatTanggal(sesi.hari, sesi.tanggal)}
              />

              <BarisInfo
                garis
                label="Waktu"
                nilai={`${sesi.jamMulai} - ${sesi.jamSelesai}`}
              />

              <BarisInfo
                garis
                label="Kelas"
                nilai={sesi.namaKelas}
              />

              <BarisInfo
                garis
                label="Lab"
                nilai={sesi.lab}
              />

              <BarisInfo
                garis
                label="Sesi dibuka"
                nilai={
                  sesi.dibukaPada
                    ? `Pukul ${formatWaktu(sesi.dibukaPada)}`
                    : 'Belum dibuka'
                }
              />

              <BarisInfo
                garis
                label="Sesi ditutup"
                nilai={
                  sesi.ditutupPada
                    ? `Pukul ${formatWaktu(sesi.ditutupPada)}`
                    : 'Belum ditutup'
                }
              />
            </Card>
          </View>

          <View className="gap-two px-three pt-four">
            {sesi.status === 'belum-dibuka' ? (
              <AppButton
                label="Buka Sesi"
                onPress={() => {
                  setPesan('');
                  setAksiDipilih('buka');
                }}
              />
            ) : sesi.status === 'dibuka' ? (
              <AppButton
                label="Tutup Sesi"
                variant="danger"
                onPress={() => {
                  setPesan('');
                  setAksiDipilih('tutup');
                }}
              />
            ) : (
              <Text className="text-small text-textSecondary">
                Sesi sudah ditutup. Aksi buka dan tutup tidak tersedia.
              </Text>
            )}
          </View>

          <View className="px-three pt-four">
            <Text className="text-subtitle font-semibold text-text">
              Rekap Kehadiran
            </Text>

            <Text className="mt-one text-small text-textSecondary">
              Peserta yang sudah melakukan presensi.
            </Text>

            <Card className="mt-two">
              <View className="flex-row items-center justify-between gap-two">
                <Text className="text-body text-text">
                  Peserta hadir
                </Text>

                <Text className="text-subtitle font-semibold text-text">
                  {presensiSedangDimuat
                    ? '-'
                    : `${daftarPresensi.length} / ${sesi.pesertaIds.length}`}
                </Text>
              </View>
            </Card>
          </View>

          <View className="gap-two px-three pt-four">
            <Text className="text-subtitle font-semibold text-text">
              Daftar Peserta Hadir
            </Text>

            {presensiSedangDimuat ? (
              <Card>
                <EmptyState
                  judul="Memuat presensi"
                  deskripsi="Sedang mengambil data kehadiran praktikan."
                />
              </Card>
            ) : statusPresensi === 'gagal' ? (
              <Card>
                <EmptyState
                  judul="Presensi gagal dimuat"
                  deskripsi={
                    pesanPresensi ||
                    'Terjadi kesalahan saat mengambil presensi.'
                  }
                />
              </Card>
            ) : daftarPresensi.length === 0 ? (
              <Card>
                <EmptyState
                  judul="Belum ada presensi"
                  deskripsi="Peserta yang sudah melakukan presensi akan muncul di sini."
                />
              </Card>
            ) : (
              daftarPresensi.map((item) => (
                <Card key={`${sesi.id}-${item.praktikanId}`}>
                  <Text className="text-body font-semibold text-text">
                    {item.nama}
                  </Text>

                  <Text className="mt-one text-small text-textSecondary">
                    {item.nomorInduk}
                  </Text>

                  <View className="mt-two border-t border-border pt-two">
                    <Text className="text-small text-textSecondary">
                      Waktu presensi
                    </Text>

                    <Text className="mt-one text-body text-text">
                      {formatWaktu(item.waktu)}
                    </Text>
                  </View>
                </Card>
              ))
            )}
          </View>
        </ScrollView>

        <BottomSheet
          visible={aksiDipilih !== null}
          onClose={() => setAksiDipilih(null)}
          judul={
            aksiDipilih === 'buka'
              ? 'Buka sesi praktikum?'
              : 'Tutup sesi praktikum?'
          }
          deskripsi={
            aksiDipilih === 'buka'
              ? 'Peserta dapat mulai melakukan presensi setelah sesi dibuka.'
              : 'Pastikan sesi praktikum sudah selesai sebelum menutupnya.'
          }
          labelKonfirmasi={
            aksiDipilih === 'buka'
              ? 'Ya, Buka Sesi'
              : 'Ya, Tutup Sesi'
          }
          onKonfirmasi={() => {
            void konfirmasiAksi();
          }}
          bahaya={aksiDipilih === 'tutup'}
        />
      </View>
    </Screen>
  );
}

function HalamanKosong({
  judul,
  deskripsi,
  kembali,
}: {
  judul: string;
  deskripsi: string;
  kembali: () => void;
}) {
  return (
    <Screen>
      <View
        className="w-full flex-1 self-center justify-center px-three"
        style={{ maxWidth: MaxContentWidth }}
      >
        <Card>
          <EmptyState
            judul={judul}
            deskripsi={deskripsi}
          />

          <AppButton
            className="mt-three"
            label="Kembali"
            variant="secondary"
            onPress={kembali}
          />
        </Card>
      </View>
    </Screen>
  );
}

function BarisInfo({
  label,
  nilai,
  garis = false,
}: {
  label: string;
  nilai: string;
  garis?: boolean;
}) {
  return (
    <View
      className={
        garis
          ? 'flex-row items-start justify-between gap-three border-t border-border py-two'
          : 'flex-row items-start justify-between gap-three py-two'
      }
    >
      <Text className="text-small text-textSecondary">
        {label}
      </Text>

      <Text className="flex-1 text-right text-body text-text">
        {nilai}
      </Text>
    </View>
  );
}

function formatTanggal(hari: string, tanggal: string): string {
  const [tahun, bulan, tanggalHari] = tanggal.split('-').map(Number);

  const tanggalObj = new Date(
    tahun,
    bulan - 1,
    tanggalHari,
  );

  const tanggalFormat = tanggalObj.toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  );

  return `${hari}, ${tanggalFormat}`;
}

function formatWaktu(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
