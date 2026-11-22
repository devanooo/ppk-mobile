import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { EmptyState, Screen } from '@/components/ui';
import { EditKelasScreen } from '@/features/asisten/edit-kelas-screen';
import type { UmpanBalik } from '@/features/asisten/umpan-balik';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import { LABORATORY_OPTIONS } from '@/features/maps/constants/laboratory';
import { useLaboratories } from '@/features/maps/hooks/useLaboratories';
import {
  dariLaboratorium,
  kosongkanPilihanLaboratorium,
  usePilihanLaboratorium,
  type LabTerpilih,
} from '@/features/maps/pemilihan-lab';
import { normalisasiLaboratorium } from '@/features/maps/utils/activity';
import { db } from '@/lib/firebase';
import { ubahKelas, type HasilAksi } from '@/lib/kelas';
import { useSession } from '@/store/session-store';

export default function EditKelasRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const kelasId = Array.isArray(id) ? id[0] : id;
  const { user } = useSession();
  const [banner, setBanner] = useState<UmpanBalik | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

  const asistenId = user?.peran === 'asisten' ? user.id : undefined;
  const hasilKelas = useKelasAsisten(db, asistenId);
  const kelas = hasilKelas.kelas.find((item) => item.id === kelasId);

  const {
    laboratories,
    loading: memuatLab,
    error: galatLab,
  } = useLaboratories();
  const labTerpilih = usePilihanLaboratorium();

  useEffect(() => {
    kosongkanPilihanLaboratorium();

    return () => {
      kosongkanPilihanLaboratorium();
    };
  }, []);

  const labAwal = useMemo<LabTerpilih | null>(() => {
    if (!kelas) return null;

    const labId = normalisasiLaboratorium(kelas.lab);
    if (!labId) return null;

    const lab = laboratories.find((item) => item.id === labId);
    return lab ? dariLaboratorium(lab) : null;
  }, [kelas, laboratories]);

  function kembali() {
    router.replace({ pathname: '/(asisten)/kelas' });
  }

  async function simpan(nama: string): Promise<HasilAksi> {
    if (!kelas || !asistenId) {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Data kelas atau akun asisten belum tersedia.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    }

    const lab = labTerpilih
      ? labelUntukLab(labTerpilih.id, labTerpilih.nama)
      : kelas.lab;

    setMenyimpan(true);

    try {
      const hasil = await ubahKelas({
        db,
        kelasId: kelas.id,
        asistenId,
        nama,
        lab,
      });

      if (hasil.ok) {
        kosongkanPilihanLaboratorium();
        router.replace({
          pathname: '/(asisten)/kelas',
          params: { pesan: hasil.pesan, jenis: 'sukses' },
        });
      } else {
        setBanner({ jenis: 'gagal', pesan: hasil.pesan });
      }

      return hasil;
    } catch {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Perubahan gagal disimpan. Periksa koneksi lalu coba lagi.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    } finally {
      setMenyimpan(false);
    }
  }

  if (!asistenId) {
    return (
      <Screen>
        <EmptyState
          judul="Akun asisten belum aktif"
          deskripsi="Gunakan akun asisten untuk mengelola kelas."
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
    <EditKelasScreen
      banner={banner}
      kelas={kelas}
      labAwal={labAwal}
      labTerpilih={labTerpilih}
      menyimpan={menyimpan}
      pesanGalatLaboratorium={galatLab?.message}
      statusLaboratorium={
        memuatLab ? 'memuat' : galatLab ? 'gagal' : 'siap'
      }
      onBatal={kembali}
      onPilihDiMaps={() => {
        router.push({ pathname: '/maps', params: { mode: 'select' } });
      }}
      onSimpan={simpan}
      onTutupBanner={() => setBanner(null)}
    />
  );
}

function labelUntukLab(id: string, fallback: string): string {
  return (
    LABORATORY_OPTIONS.find((opsi) => String(opsi.id) === id)?.label ?? fallback
  );
}
