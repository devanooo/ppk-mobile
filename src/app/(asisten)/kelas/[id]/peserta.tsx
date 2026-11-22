import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';

import { EmptyState, Screen } from '@/components/ui';
import { KelolaPesertaScreen } from '@/features/asisten/kelola-peserta-screen';
import type { UmpanBalik } from '@/features/asisten/umpan-balik';
import { useKelasAsisten } from '@/features/asisten/use-kelas-asisten';
import {
  usePraktikan,
  type Praktikan,
} from '@/features/asisten/use-praktikan';
import { db } from '@/lib/firebase';
import {
  hapusPeserta,
  tambahPeserta,
  type HasilAksi,
} from '@/lib/kelas';
import { useSession } from '@/store/session-store';

export default function KelolaPesertaRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const kelasId = Array.isArray(id) ? id[0] : id;
  const { user } = useSession();
  const [banner, setBanner] = useState<UmpanBalik | null>(null);
  const [menghapusId, setMenghapusId] = useState<string | null>(null);

  const asistenId = user?.peran === 'asisten' ? user.id : undefined;
  const hasilKelas = useKelasAsisten(db, asistenId);
  const hasilPraktikan = usePraktikan(db);

  const kelas = hasilKelas.kelas.find((item) => item.id === kelasId);

  const peserta = useMemo<Praktikan[]>(() => {
    if (!kelas) return [];

    const peta = new Map(
      hasilPraktikan.praktikan.map((praktikan) => [praktikan.id, praktikan]),
    );

    return kelas.pesertaIds
      .map((pesertaId) => peta.get(pesertaId))
      .filter((praktikan): praktikan is Praktikan => Boolean(praktikan))
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [hasilPraktikan.praktikan, kelas]);

  const kandidat = useMemo<Praktikan[]>(() => {
    if (!kelas) return [];

    const sudahTergabung = new Set(kelas.pesertaIds);

    return hasilPraktikan.praktikan.filter(
      (praktikan) => !sudahTergabung.has(praktikan.id),
    );
  }, [hasilPraktikan.praktikan, kelas]);

  function kembali() {
    router.replace({ pathname: '/(asisten)/kelas' });
  }

  async function tambah(ids: string[]): Promise<HasilAksi> {
    if (!kelas) {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Data kelas belum tersedia.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    }

    if (ids.length === 0) {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Pilih minimal satu mahasiswa.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    }

    try {
      for (const praktikanId of ids) {
        const hasil = await tambahPeserta({
          db,
          kelasId: kelas.id,
          praktikanId,
        });

        if (!hasil.ok) {
          setBanner({ jenis: 'gagal', pesan: hasil.pesan });
          return hasil;
        }
      }

      const pesan = `${ids.length} peserta berhasil ditambahkan.`;
      setBanner({ jenis: 'sukses', pesan });

      return { ok: true, pesan };
    } catch {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Peserta gagal ditambahkan. Periksa koneksi lalu coba lagi.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    }
  }

  async function hapus(praktikan: Praktikan): Promise<HasilAksi> {
    if (!kelas) {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Data kelas belum tersedia.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    }

    setMenghapusId(praktikan.id);

    try {
      const hasil = await hapusPeserta({
        db,
        kelasId: kelas.id,
        praktikanId: praktikan.id,
      });

      setBanner({
        jenis: hasil.ok ? 'sukses' : 'gagal',
        pesan: hasil.ok
          ? `${praktikan.nama} dihapus dari kelas.`
          : hasil.pesan,
      });

      return hasil;
    } catch {
      const hasilGagal: HasilAksi = {
        ok: false,
        pesan: 'Peserta gagal dihapus. Periksa koneksi lalu coba lagi.',
      };

      setBanner({ jenis: 'gagal', pesan: hasilGagal.pesan });
      return hasilGagal;
    } finally {
      setMenghapusId(null);
    }
  }

  if (!asistenId) {
    return (
      <Screen>
        <EmptyState
          judul="Akun asisten belum aktif"
          deskripsi="Gunakan akun asisten untuk mengelola peserta kelas."
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

  if (hasilKelas.status === 'gagal') {
    return (
      <Screen>
        <EmptyState
          deskripsi={hasilKelas.pesanGalat}
          judul="Data kelas gagal dimuat"
          tone="gagal"
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
    <KelolaPesertaScreen
      banner={banner}
      menghapusId={menghapusId}
      kandidat={kandidat}
      kelas={kelas}
      onHapus={hapus}
      onKembali={kembali}
      onTambah={tambah}
      onTutupBanner={() => setBanner(null)}
      pesanGalat={hasilPraktikan.pesanGalat}
      peserta={peserta}
      status={hasilPraktikan.status}
    />
  );
}
