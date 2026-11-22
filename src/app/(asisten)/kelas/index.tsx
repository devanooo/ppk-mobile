import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { KelasAsistenScreen } from '@/features/asisten/kelas-screen';
import type { UmpanBalik } from '@/features/asisten/umpan-balik';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import { db } from '@/lib/firebase';
import { hapusKelas, type HasilAksi, type Kelas } from '@/lib/kelas';
import { useSession } from '@/store/session-store';

export default function KelasAsistenRoute() {
  const { user } = useSession();
  const params = useLocalSearchParams<{ pesan?: string; jenis?: string }>();
  const [bannerLokal, setBanner] = useState<UmpanBalik | null>(null);
  const [menghapus, setMenghapus] = useState(false);

  const asistenId = user?.peran === 'asisten' ? user.id : undefined;
  const hasil = useKelasAsisten(db, asistenId);
  const namaAsisten = user?.nama?.trim() || 'Asisten';

  const pesanRoute = typeof params.pesan === 'string' ? params.pesan : '';
  const banner: UmpanBalik | null = pesanRoute
    ? { jenis: params.jenis === 'gagal' ? 'gagal' : 'sukses', pesan: pesanRoute }
    : bannerLokal;

  function tutupBanner() {
    setBanner(null);

    if (pesanRoute) {
      router.setParams({ pesan: '', jenis: '' });
    }
  }

  async function hapus(item: Kelas): Promise<HasilAksi> {
    if (pesanRoute) tutupBanner();

    if (!asistenId) {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Identitas asisten belum tersedia.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    }

    setMenghapus(true);

    try {
      const hasilHapus = await hapusKelas({
        db,
        kelasId: item.id,
        asistenId,
      });

      setBanner({
        jenis: hasilHapus.ok ? 'sukses' : 'gagal',
        pesan: hasilHapus.pesan,
      });

      return hasilHapus;
    } catch {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Terjadi kesalahan. Silakan coba lagi.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    } finally {
      setMenghapus(false);
    }
  }

  return (
    <KelasAsistenScreen
      banner={banner}
      menghapus={menghapus}
      namaAsisten={namaAsisten}
      kelas={hasil.kelas}
      status={hasil.status}
      pesanGalat={hasil.pesanGalat}
      profil={user ? <MenuProfilAsisten /> : undefined}
      onTutupBanner={tutupBanner}
      onBukaTambah={() => {
        router.push('/(asisten)/kelas/tambah');
      }}
      onHapus={hapus}
      onEdit={(item) => {
        router.push({
          pathname: '/(asisten)/kelas/[id]/edit',
          params: { id: item.id },
        });
      }}
      onKelolaPeserta={(item) => {
        router.push({
          pathname: '/(asisten)/kelas/[id]/peserta',
          params: { id: item.id },
        });
      }}
      onKelolaSesi={(item) => {
        router.push({
          pathname: '/(asisten)/kelas/[id]',
          params: { id: item.id },
        });
      }}
    />
  );
}