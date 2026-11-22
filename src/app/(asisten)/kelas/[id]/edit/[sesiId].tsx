import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { EmptyState, Screen } from '@/components/ui';
import { FormSesi, type DataSesiForm } from '@/features/asisten/form-sesi';
import { HeaderAsisten } from '@/features/asisten/header-asisten';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import {
  useSesiAsisten,
  type SesiAsisten,
} from '@/features/asisten/use-sesi-asisten';
import { useLaboratories } from '@/features/maps/hooks/useLaboratories';
import {
  dariLaboratorium,
  type LabTerpilih,
} from '@/features/maps/pemilihan-lab';
import { normalisasiLaboratorium } from '@/features/maps/utils/activity';
import { db } from '@/lib/firebase';
import { kirimEventNotifikasi } from '@/lib/notifikasi';
import { ubahSesi, type HasilAksiSesi } from '@/lib/sesi';
import { useSession } from '@/store/session-store';

export default function EditSesiRoute() {
  const { id, sesiId } = useLocalSearchParams<{
    id: string;
    sesiId: string;
  }>();
  const kelasId = Array.isArray(id) ? id[0] : id;
  const sesiIdBersih = Array.isArray(sesiId) ? sesiId[0] : sesiId;
  const { user } = useSession();

  const asistenId =
    user?.peran === 'asisten' ? user.id : undefined;

  const hasilKelas = useKelasAsisten(db, asistenId);
  const hasilSesi = useSesiAsisten(db, asistenId);

  const kelas = hasilKelas.kelas.find((item) => item.id === kelasId);
  const sesi: SesiAsisten | undefined = hasilSesi.sesi.find(
    (item) => item.id === sesiIdBersih,
  );

  const { laboratories } = useLaboratories();

  const labAwal = useMemo<LabTerpilih | null>(() => {
    if (!kelas) return null;

    const labId = normalisasiLaboratorium(kelas.lab);
    if (!labId) return null;

    const lab = laboratories.find((item) => item.id === labId);
    return lab ? dariLaboratorium(lab) : null;
  }, [kelas, laboratories]);

  function kembali() {
    router.replace({
      pathname: '/(asisten)/kelas/[id]',
      params: { id: kelasId },
    });
  }

  async function simpan(data: DataSesiForm): Promise<HasilAksiSesi> {
    if (!kelas || !asistenId || !sesiIdBersih) {
      return {
        ok: false,
        pesan: 'Data kelas, akun, atau sesi belum tersedia.',
      };
    }

    const hasil = await ubahSesi({
      db,
      sesiId: sesiIdBersih,
      asistenId,
      ...data,
    });

    if (hasil.ok) {
      void kirimEventNotifikasi({
        tipe: 'jadwal-berubah',
        sesiId: sesiIdBersih,
      });

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

  if (hasilKelas.status === 'memuat' || hasilSesi.status === 'memuat') {
    return (
      <Screen>
        <EmptyState
          judul="Memuat data"
          deskripsi="Sedang mengambil informasi kelas dan sesi."
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

  if (!sesi) {
    return (
      <Screen>
        <EmptyState
          judul="Sesi tidak ditemukan"
          deskripsi="Sesi mungkin sudah dihapus atau kamu tidak memiliki akses."
        />
      </Screen>
    );
  }

  return (
    <Screen backgroundClassName="bg-backgroundElement" padded={false}>
      <HeaderAsisten />
      <FormSesi
        lab={kelas.lab}
        labAwal={labAwal}
        namaKelas={kelas.nama}
        onBatal={kembali}
        onPilihDiMaps={() => {
          router.push({ pathname: '/maps', params: { mode: 'select' } });
        }}
        onSelesai={kembali}
        onSimpan={simpan}
        sesi={sesi}
      />
    </Screen>
  );
}