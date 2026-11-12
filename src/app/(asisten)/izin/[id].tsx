import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { DetailIzinAsisten } from '@/features/izin/detail-izin-asisten';
import { useIzinSesi } from '@/features/izin/use-izin-sesi';
import { useProfilPraktikan } from '@/features/izin/use-profil-praktikan';
import { useSesiAsisten } from '@/features/izin/use-sesi-asisten';
import { ambilDbSementara } from '@/lib/db-sementara';
import { putuskanIzin } from '@/lib/izin';
import type { SesiPraktikan } from '@/lib/izin-sesi';
import { useSession } from '@/store/session-store';

/**
 * TODO(p1): ganti `ambilDbSementara()` dengan `db` dari `@/lib/firebase`
 * begitu T-016 merge, lalu hapus `src/lib/db-sementara.ts`.
 */
const db = ambilDbSementara();

export default function DetailIzinAsistenScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { id: sesiId, praktikanId } = useLocalSearchParams<{
    id: string;
    praktikanId?: string;
  }>();

  const asistenId = user?.peran === 'asisten' ? user.id : undefined;
  const { izin, status, pesanGalat } = useIzinSesi(db, sesiId, praktikanId);
  const { sesi } = useSesiAsisten(db, asistenId);
  const [sedangPutuskan, setSedangPutuskan] = useState(false);
  const [umpanBalik, setUmpanBalik] = useState<{ jenis: 'sukses' | 'gagal'; pesan: string } | null>(
    null,
  );

  const sesiAktif: SesiPraktikan | undefined = useMemo(
    () => sesi.find((item) => item.id === sesiId),
    [sesi, sesiId],
  );

  // Firestore tidak dipanggil langsung dari route (AC US-04 nomor 5).
  const profilAktif = useProfilPraktikan(db, praktikanId ?? izin?.praktikanId);

  if (!user || user.peran !== 'asisten') {
    return null;
  }

  async function putuskan(keputusan: 'disetujui' | 'ditolak') {
    if (!db || !sesiId || !praktikanId || !asistenId) {
      setUmpanBalik({ jenis: 'gagal', pesan: 'Pengajuan izin tidak ditemukan' });
      return;
    }

    setSedangPutuskan(true);

    const hasil = await putuskanIzin({
      db,
      sesiId,
      praktikanId,
      keputusan,
      asistenId,
    });

    setSedangPutuskan(false);
    setUmpanBalik({ jenis: hasil.ok ? 'sukses' : 'gagal', pesan: hasil.pesan });
  }

  return (
    <DetailIzinAsisten
      izin={izin}
      namaPraktikan={profilAktif.nama}
      nomorInduk={profilAktif.nomorInduk}
      onKembali={() => router.back()}
      onSetujui={() => putuskan('disetujui')}
      onTolak={() => putuskan('ditolak')}
      onTutupUmpanBalik={() => setUmpanBalik(null)}
      pesanGalat={pesanGalat}
      sedangPutuskan={sedangPutuskan}
      sesi={sesiAktif}
      status={status}
      umpanBalik={umpanBalik}
    />
  );
}
