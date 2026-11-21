import { router, useLocalSearchParams } from 'expo-router';

import { EmptyState, Screen } from '@/components/ui';
import { FormSesi, type DataSesiForm } from '@/features/asisten/form-sesi';
import { HeaderAsisten } from '@/features/asisten/header-asisten';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import { db } from '@/lib/firebase';
import { buatSesi, type HasilAksiSesi } from '@/lib/sesi';
import { useSession } from '@/store/session-store';

export default function TambahSesiRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const kelasId = Array.isArray(id) ? id[0] : id;
  const { user } = useSession();

  const asistenId =
    user?.peran === 'asisten' ? user.id : undefined;

  const hasilKelas = useKelasAsisten(db, asistenId);
  const kelas = hasilKelas.kelas.find((item) => item.id === kelasId);

  function kembali() {
    router.replace({
      pathname: '/(asisten)/kelas/[id]',
      params: { id: kelasId },
    });
  }

  async function simpan(data: DataSesiForm): Promise<HasilAksiSesi> {
    if (!kelas || !asistenId) {
      return {
        ok: false,
        pesan: 'Data kelas atau akun asisten belum tersedia.',
      };
    }

    const hasil = await buatSesi({
      db,
      kelasId: kelas.id,
      asistenId,
      ...data,
    });

    if (hasil.ok) {
      router.replace({
        pathname: '/(asisten)/kelas/[id]',
        params: { id: kelasId, pesan: hasil.pesan, jenis: 'sukses' },
      });
    }

    return hasil;
  }

  if (!asistenId) {
    return (
      <Screen>
        <EmptyState
          judul="Akun asisten belum aktif"
          deskripsi="Gunakan akun asisten untuk mengelola sesi kelas."
        />
      </Screen>
    );
  }

  if (hasilKelas.status === 'memuat') {
    return (
      <Screen>
        <EmptyState
          judul="Memuat kelas"
          deskripsi="Sedang mengambil informasi kelas."
        />
      </Screen>
    );
  }

  if (!kelas) {
    return (
      <Screen>
        <EmptyState
          judul="Kelas tidak ditemukan"
          deskripsi="Kelas mungkin sudah dihapus atau kamu tidak memiliki akses."
        />
      </Screen>
    );
  }

  return (
    <Screen backgroundClassName="bg-backgroundElement" padded={false}>
      <HeaderAsisten />
      <FormSesi
        lab={kelas.lab}
        namaKelas={kelas.nama}
        onBatal={kembali}
        onSelesai={kembali}
        onSimpan={simpan}
        sesi={null}
      />
    </Screen>
  );
}