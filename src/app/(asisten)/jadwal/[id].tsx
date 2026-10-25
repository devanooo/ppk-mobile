import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  AppButton,
  Banner,
  BottomSheet,
  Card,
  EmptyState,
  Screen,
  StatusBadge,
} from '@/components/ui';
import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { useSession } from '@/store/session-store';

type AksiSesi = 'buka' | 'tutup';

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

function formatWaktu(waktu?: string) {
  if (!waktu) {
    return 'Belum ada';
  }

  const tanggal = new Date(waktu);

  if (Number.isNaN(tanggal.getTime())) {
    return waktu;
  }

  return tanggal.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function DetailSesiAsistenScreen() {
  const { id, from } = useLocalSearchParams<{
    id: string;
    from?: string;
  }>();

  const {
    user,
    sesiById,
    bukaSesi,
    tutupSesi,
    rekapSesi,
  } = useSession();

  const [aksiDipilih, setAksiDipilih] =
    useState<AksiSesi | null>(null);

  const [pesan, setPesan] = useState('');

  const [jenisPesan, setJenisPesan] =
    useState<'success' | 'error'>('success');

  const sesi = sesiById(id);

  const daftarPresensi = useMemo(
    () => (sesi ? rekapSesi(sesi.id) : []),
    [sesi, rekapSesi],
  );

  function kembaliKeHalamanAsal() {
    if (from === 'rekap') {
      router.replace('/(asisten)/rekap');
      return;
    }

    router.replace('/(asisten)/jadwal');
  }

  function konfirmasiAksi() {
    if (!sesi || !aksiDipilih) {
      return;
    }

    const hasil =
      aksiDipilih === 'buka'
        ? bukaSesi(sesi.id)
        : tutupSesi(sesi.id);

    setPesan(hasil.pesan);
    setJenisPesan(hasil.ok ? 'success' : 'error');
    setAksiDipilih(null);
  }

  if (!user || user.peran !== 'asisten') {
    return (
      <Screen>
        <Card>
          <EmptyState
            judul="Akun asisten belum aktif"
            deskripsi="Gunakan akun asisten untuk melihat detail sesi."
          />
        </Card>
      </Screen>
    );
  }

  if (!sesi || sesi.asistenId !== user.id) {
    return (
      <Screen>
        <Card>
          <EmptyState
            judul="Sesi tidak ditemukan"
            deskripsi="Sesi ini tidak tersedia untuk akun asistenmu."
          />

          <AppButton
            className="mt-three"
            label={
              from === 'rekap'
                ? 'Kembali ke Rekap'
                : 'Kembali ke Jadwal'
            }
            variant="secondary"
            onPress={kembaliKeHalamanAsal}
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
        <View className="mb-four flex-row items-center justify-between">
          <Pressable
            onPress={kembaliKeHalamanAsal}
            accessibilityRole="button"
            accessibilityLabel={
              from === 'rekap'
                ? 'Kembali ke Rekap Asisten'
                : 'Kembali ke Jadwal Asisten'
            }
            hitSlop={10}
            className="flex-row items-center"
          >
            <Text className="text-title font-semibold text-primary">
              ‹
            </Text>

            <Text className="ml-two text-body font-medium text-primary">
              Kembali
            </Text>
          </Pressable>

          <MenuProfilAsisten />
        </View>

        <View className="mb-four">
          <Text className="text-title font-bold text-text">
            Detail Sesi
          </Text>

          <Text className="mt-one text-body text-textSecondary">
            Informasi praktikum dan kehadiran peserta.
          </Text>
        </View>

        {pesan ? (
          <View className="mb-three">
            <Banner
              jenis={jenisPesan === 'success' ? 'sukses' : 'gagal'}
              pesan={pesan}
              onTutup={() => setPesan('')}
            />
          </View>
        ) : null}

        <Card>
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
              {sesi.hari}, {formatTanggal(sesi.tanggal)}
            </Text>

            <Text className="mt-one text-body text-text">
              {sesi.jamMulai} - {sesi.jamSelesai}
            </Text>
          </View>

          <View className="mt-three border-t border-border pt-three">
            <Text className="text-small text-textSecondary">
              Waktu buka sesi
            </Text>

            <Text className="mt-one text-body text-text">
              {formatWaktu(sesi.dibukaPada)}
            </Text>

            <Text className="mt-three text-small text-textSecondary">
              Waktu tutup sesi
            </Text>

            <Text className="mt-one text-body text-text">
              {formatWaktu(sesi.ditutupPada)}
            </Text>
          </View>

          {sesi.status === 'belum-dibuka' ? (
            <AppButton
              className="mt-four"
              label="Buka Sesi"
              onPress={() => {
                setPesan('');
                setAksiDipilih('buka');
              }}
            />
          ) : sesi.status === 'dibuka' ? (
            <AppButton
              className="mt-four"
              label="Tutup Sesi"
              variant="danger"
              onPress={() => {
                setPesan('');
                setAksiDipilih('tutup');
              }}
            />
          ) : (
            <Text className="mt-four text-small text-textSecondary">
              Sesi sudah ditutup. Aksi buka/tutup tidak tersedia.
            </Text>
          )}
        </Card>

        <Card className="mt-three">
          <Text className="text-subtitle font-semibold text-text">
            Rekap Kehadiran
          </Text>

          <Text className="mt-one text-body text-textSecondary">
            {daftarPresensi.length} hadir dari {sesi.pesertaIds.length} peserta
          </Text>
        </Card>

        <Text className="mb-three mt-four text-subtitle font-semibold text-text">
          Daftar Peserta Hadir
        </Text>

        {daftarPresensi.length === 0 ? (
          <Card>
            <EmptyState
              judul="Belum ada presensi"
              deskripsi="Daftar peserta yang hadir akan muncul di sini."
            />
          </Card>
        ) : (
          daftarPresensi.map((item) => (
            <Card
              key={`${sesi.id}-${item.praktikan.id}`}
              className="mb-three"
            >
              <Text className="text-body font-semibold text-text">
                {item.praktikan.nama}
              </Text>

              <Text className="mt-one text-small text-textSecondary">
                {item.praktikan.nomorInduk}
              </Text>

              <Text className="mt-one text-small text-textSecondary">
                Waktu presensi: {formatWaktu(item.waktu)}
              </Text>
            </Card>
          ))
        )}
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
        onKonfirmasi={konfirmasiAksi}
        bahaya={aksiDipilih === 'tutup'}
      />
    </Screen>
  );
}
