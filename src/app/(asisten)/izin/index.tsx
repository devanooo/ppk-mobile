import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import { MenuProfilAsisten } from '@/features/asisten/menu-profil-asisten';
import { DaftarIzinAsisten } from '@/features/izin/daftar-izin-asisten';
import { urutkanIzin } from '@/features/izin/format-izin';
import { useIzinAsisten } from '@/features/izin/use-izin-asisten';
import { useSesiAsisten } from '@/features/izin/use-sesi-asisten';
import type { Izin, StatusIzin } from '@/features/izin/types';
import { ambilDbSementara } from '@/lib/db-sementara';
import { bacaNamaPraktikan } from '@/lib/izin-sesi';
import { useSession } from '@/store/session-store';

/**
 * TODO(p1): ganti `ambilDbSementara()` dengan `db` dari `@/lib/firebase`
 * begitu T-016 merge, lalu hapus `src/lib/db-sementara.ts`.
 */
const db = ambilDbSementara();

export default function IzinAsistenScreen() {
  const { user } = useSession();
  const router = useRouter();
  const asistenId = user?.peran === 'asisten' ? user.id : undefined;

  const [filter, setFilter] = useState<StatusIzin | 'semua'>('menunggu');
  const [namaPraktikan, setNamaPraktikan] = useState<Map<string, string>>(new Map());

  const { sesi, status: statusSesi, pesanGalat: galatSesi } = useSesiAsisten(db, asistenId);
  const sesiIds = useMemo(() => sesi.map((item) => item.id), [sesi]);
  const { izin, status, pesanGalat } = useIzinAsisten(db, asistenId, sesiIds);

  const sesiById = useMemo(() => new Map(sesi.map((item) => [item.id, item])), [sesi]);

  const daftar = useMemo(() => {
    const terurut = urutkanIzin(izin);

    return filter === 'semua' ? terurut : terurut.filter((item) => item.status === filter);
  }, [izin, filter]);

  const idPraktikan = useMemo(
    () => [...new Set(izin.map((item) => item.praktikanId))].sort().join(','),
    [izin],
  );

  useEffect(() => {
    if (!db || !idPraktikan) return;

    let dibatalkan = false;

    bacaNamaPraktikan(db, idPraktikan.split(',')).then((peta) => {
      if (!dibatalkan) setNamaPraktikan(peta);
    });

    return () => {
      dibatalkan = true;
    };
  }, [idPraktikan]);

  if (!user || user.peran !== 'asisten') {
    return null;
  }

  function bukaIzin(item: Izin) {
    router.push({
      pathname: '/(asisten)/izin/[id]',
      params: { id: item.sesiId, praktikanId: item.praktikanId },
    });
  }

  return (
    <DaftarIzinAsisten
      daftarIzin={daftar}
      filter={filter}
      namaPraktikan={namaPraktikan}
      onBukaIzin={bukaIzin}
      onUbahFilter={setFilter}
      pesanGalat={statusSesi === 'gagal' ? galatSesi : pesanGalat}
      profil={<MenuProfilAsisten />}
      sesiById={sesiById}
      status={statusSesi === 'gagal' ? 'gagal' : status}
    />
  );
}
