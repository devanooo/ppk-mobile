import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { EmptyState, Screen } from '@/components/ui';
import { TambahKelasScreen } from '@/features/asisten/tambah-kelas-screen';
import type { UmpanBalik } from '@/features/asisten/umpan-balik';
import { LABORATORY_OPTIONS } from '@/features/maps/constants/laboratory';
import {
  kosongkanPilihanLaboratorium,
  usePilihanLaboratorium,
} from '@/features/maps/pemilihan-lab';
import { db } from '@/lib/firebase';
import { buatKelas } from '@/lib/kelas';
import { useSession } from '@/store/session-store';

export default function TambahKelasRoute() {
  const router = useRouter();
  const { user } = useSession();
  const labTerpilih = usePilihanLaboratorium();
  const [banner, setBanner] = useState<UmpanBalik | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

  const asistenId = user?.peran === 'asisten' ? user.id : undefined;
  const opsiLab = LABORATORY_OPTIONS.find(
    (opsi) => String(opsi.id) === labTerpilih?.id,
  );

  useEffect(() => {
    kosongkanPilihanLaboratorium();

    return () => {
      kosongkanPilihanLaboratorium();
    };
  }, []);

  function kembali() {
    router.dismissTo('/(asisten)/kelas');
  }

  function pilihDiMaps() {
    router.push({
      pathname: '/maps',
      params: { mode: 'select' },
    });
  }

  async function simpan(nama: string) {
    const namaKelas = nama.trim();

    if (menyimpan || !asistenId || !namaKelas || !opsiLab) return;

    setBanner(null);
    setMenyimpan(true);

    try {
      const hasil = await buatKelas({
        db,
        nama: namaKelas,
        lab: opsiLab.label,
        asistenId,
      });

      if (!hasil.ok) {
        setBanner({ jenis: 'gagal', pesan: hasil.pesan });
        return;
      }

      router.dismissTo({
        pathname: '/(asisten)/kelas',
        params: { pesan: hasil.pesan, jenis: 'sukses' },
      });
    } catch {
      setBanner({
        jenis: 'gagal',
        pesan: 'Kelas gagal disimpan. Periksa koneksi lalu coba lagi.',
      });
    } finally {
      setMenyimpan(false);
    }
  }

  if (!asistenId) {
    return (
      <Screen>
        <EmptyState
          judul="Akun asisten belum aktif"
          deskripsi="Gunakan akun asisten untuk menambah kelas."
        />
      </Screen>
    );
  }

  return (
    <TambahKelasScreen
      banner={banner}
      labTerpilih={opsiLab ? labTerpilih : null}
      labelLab={opsiLab?.label ?? 'Belum dipilih'}
      menyimpan={menyimpan}
      onBatal={kembali}
      onPilihDiMaps={pilihDiMaps}
      onSimpan={simpan}
      onTutupBanner={() => setBanner(null)}
    />
  );
}