import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { labelJadwal, rentangJam } from '@/features/praktikan/format-sesi';
import { formatJam } from '@/store/session-logic';
import { useSession } from '@/store/session-store';

type AksiSesi = 'buka' | 'tutup';

export default function DetailSesiAsistenScreen() {
const { id, from } = useLocalSearchParams<{
id: string;
from?: string;
}>();

const { user, sesiById, bukaSesi, tutupSesi, rekapSesi } = useSession();

const [aksiDipilih, setAksiDipilih] = useState<AksiSesi | null>(null);
const [pesan, setPesan] = useState('');
const [jenisPesan, setJenisPesan] = useState<'sukses' | 'gagal'>('sukses');

const sesi = sesiById(id);

const daftarPresensi = useMemo(
() => (sesi ? rekapSesi(sesi.id) : []),
[sesi, rekapSesi],
);

function kembali() {
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
setJenisPesan(hasil.ok ? 'sukses' : 'gagal');
setAksiDipilih(null);

}

if (!user || user.peran !== 'asisten') {
return (
<Screen>
<View
className="w-full flex-1 self-center justify-center px-three"
style={{ maxWidth: MaxContentWidth }}
>
<Card>
<EmptyState
           judul="Akun asisten belum aktif"
           deskripsi="Gunakan akun asisten untuk melihat detail sesi."
         />
</Card>
</View>
</Screen>
);
}

if (!sesi || sesi.asistenId !== user.id) {
return (
<Screen>
<View
className="w-full flex-1 self-center justify-center px-three"
style={{ maxWidth: MaxContentWidth }}
>
<Card>
<EmptyState
           judul="Sesi tidak ditemukan"
           deskripsi="Sesi ini tidak tersedia untuk akun asistenmu."
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

return (
<Screen padded={false}>
<View
className="w-full flex-1 self-center"
style={{ maxWidth: MaxContentWidth }}
>
{/* Header tetap di atas */}
<View className="flex-row items-center justify-between gap-two px-three pt-two">
<HomeButton onPress={kembali} />
<MenuProfilAsisten />
</View>

    {/* Konten dapat di-scroll */}
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-five"
      showsVerticalScrollIndicator={false}
    >
      {/* Judul dan status sesi */}
      <View className="px-three pt-three">
        <Text
          accessibilityRole="header"
          className="text-title font-semibold text-text"
        >
          {sesi.namaPraktikum}
        </Text>

        <StatusBadge className="mt-two" status={sesi.status} />
      </View>

      {/* Pesan hasil aksi */}
      {pesan ? (
        <View className="px-three pt-three">
          <Banner
            jenis={jenisPesan}
            pesan={pesan}
            onTutup={() => setPesan('')}
          />
        </View>
      ) : null}

      {/* Informasi sesi */}
      <View className="px-three">
        <Card className="mt-four">
          <BarisInfo label="Jadwal" nilai={labelJadwal(sesi)} />
          <BarisInfo garis label="Waktu" nilai={rentangJam(sesi)} />
          <BarisInfo garis label="Kelas" nilai={sesi.kelas} />
          <BarisInfo garis label="Lab" nilai={sesi.lab} />
          <BarisInfo
            garis
            label="Sesi dibuka"
            nilai={
              sesi.dibukaPada
                ? `pukul ${formatJam(sesi.dibukaPada)}`
                : 'Belum dibuka'
            }
          />
          <BarisInfo
            garis
            label="Sesi ditutup"
            nilai={
              sesi.ditutupPada
                ? `pukul ${formatJam(sesi.ditutupPada)}`
                : 'Belum ditutup'
            }
          />
        </Card>
      </View>

      {/* Tombol buka atau tutup sesi */}
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

      {/* Rekap kehadiran */}
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
              {daftarPresensi.length} / {sesi.pesertaIds.length}
            </Text>
          </View>
        </Card>
      </View>

      {/* Daftar peserta hadir */}
      <View className="gap-two px-three pt-four">
        <Text className="text-subtitle font-semibold text-text">
          Daftar Peserta Hadir
        </Text>

        {daftarPresensi.length === 0 ? (
          <Card>
            <EmptyState
              judul="Belum ada presensi"
              deskripsi="Peserta yang sudah melakukan presensi akan muncul di sini."
            />
          </Card>
        ) : (
          daftarPresensi.map((item) => (
            <Card key={`${sesi.id}-${item.praktikan.id}`}>
              <Text className="text-body font-semibold text-text">
                {item.praktikan.nama}
              </Text>

              <Text className="mt-one text-small text-textSecondary">
                {item.praktikan.nomorInduk}
              </Text>

              <View className="mt-two border-t border-border pt-two">
                <Text className="text-small text-textSecondary">
                  Waktu presensi
                </Text>

                <Text className="mt-one text-body text-text">
                  {formatJam(item.waktu)}
                </Text>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>

    {/* Konfirmasi buka atau tutup sesi */}
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
