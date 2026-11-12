import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text } from 'react-native';

import { BottomSheet } from '@/components/ui';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { FormAjukanIzin, type UmpanBalik } from '@/features/izin/form-ajukan-izin';
import { useSesiPeserta } from '@/features/izin/use-sesi-peserta';
import { useSesiPraktikan } from '@/features/izin/use-sesi-praktikan';
import { klasifikasiAlasan } from '@/lib/ai';
import { ambilDbSementara } from '@/lib/db-sementara';
import { ajukanIzin, simpanHasilKlasifikasi } from '@/lib/izin';
import { bolehDiajukan, validasiAlasan } from '@/lib/izin-aturan';
import { useSession } from '@/store/session-store';

/**
 * TODO(p1): ganti `ambilDbSementara()` dengan `db` dari `@/lib/firebase`
 * begitu T-016 merge, lalu hapus `src/lib/db-sementara.ts`.
 */
const db = ambilDbSementara();

export default function AjukanIzinScreen() {
  const router = useRouter();
  const { user } = useSession();
  const praktikanId = user?.id;
  const { sesi, status, pesanGalat } = useSesiPraktikan(db, praktikanId);
  const [sesiDipilih, setSesiTerpilih] = useState<string>();
  const [alasan, setAlasan] = useState('');
  const [sedangKirim, setSedangKirim] = useState(false);
  const [umpanBalik, setUmpanBalik] = useState<UmpanBalik | null>(null);
  const [konfirmasiTerbuka, setKonfirmasiTerbuka] = useState(false);
  const [tampilkanGalatAlasan, setTampilkanGalatAlasan] = useState(false);
  const [klasifikasiGagal, setKlasifikasiGagal] = useState(false);

  // Sesi pertama dipakai sebagai pilihan awal tanpa setState di effect, supaya
  // tidak ada render berantai saat daftar sesi tiba.
  const sesiTerpilih = sesiDipilih ?? sesi[0]?.id;

  const peserta = useSesiPeserta(db, sesiTerpilih, praktikanId);

  const sesiAktif = useMemo(
    () => sesi.find((item) => item.id === sesiTerpilih),
    [sesi, sesiTerpilih],
  );

  const periksaBoleh = useMemo(() => {
    if (!sesiAktif || !praktikanId || !peserta.siap) return undefined;

    return bolehDiajukan({
      statusSesi: sesiAktif.status,
      pesertaIds: peserta.pesertaIds,
      praktikanId,
      sudahAda: peserta.sudahAdaIzin,
    });
  }, [sesiAktif, praktikanId, peserta]);

  if (!user) {
    return null;
  }

  const alasanNonaktif =
    status === 'gagal'
      ? (pesanGalat ?? 'Data sesi gagal dimuat')
      : periksaBoleh && !periksaBoleh.ok
        ? periksaBoleh.pesan
        : undefined;

  function cobaAjukan() {
    const validasi = validasiAlasan(alasan);

    if (!validasi.ok) {
      setTampilkanGalatAlasan(true);
      setUmpanBalik({ jenis: 'gagal', pesan: validasi.pesan });
      return;
    }

    setTampilkanGalatAlasan(false);
    setUmpanBalik(null);
    setKonfirmasiTerbuka(true);
  }

  async function kirim() {
    if (!sesiTerpilih || !db || !praktikanId) {
      setKonfirmasiTerbuka(false);
      setUmpanBalik({ jenis: 'gagal', pesan: 'Data sesi belum tersedia' });
      return;
    }

    setSedangKirim(true);
    setKonfirmasiTerbuka(false);

    const hasil = await ajukanIzin({
      db,
      sesiId: sesiTerpilih,
      praktikanId,
      alasan,
    });

    if (!hasil.ok) {
      setSedangKirim(false);
      setUmpanBalik({ jenis: 'gagal', pesan: hasil.pesan });
      return;
    }

    // Pengajuan sudah tersimpan. Kegagalan AI tidak boleh membatalkannya
    // (AC US-10 nomor 4), jadi hasilnya hanya memengaruhi badge klasifikasi.
    const kategori = await klasifikasiAlasan(alasan);
    const simpan = await simpanHasilKlasifikasi({
      db,
      sesiId: sesiTerpilih,
      praktikanId,
      kategoriAi: kategori.ok ? kategori.kategori : undefined,
      klasifikasiStatus: kategori.ok ? 'selesai' : 'gagal',
    });

    setSedangKirim(false);
    setKlasifikasiGagal(!kategori.ok);

    if (simpan.ok) {
      router.back();
      return;
    }

    setUmpanBalik({ jenis: 'sukses', pesan: hasil.pesan });
  }

  return (
    <>
      <FormAjukanIzin
        alasan={alasan}
        alasanNonaktif={alasanNonaktif}
        bolehCobaLagi={klasifikasiGagal}
        daftarSesi={sesi}
        onAjukan={cobaAjukan}
        onCobaLagi={kirim}
        onKembali={() => router.back()}
        onPilihSesi={setSesiTerpilih}
        onTutupUmpanBalik={() => setUmpanBalik(null)}
        onUbahAlasan={setAlasan}
        pesanGalatSesi={pesanGalat}
        profil={<MenuProfilPraktikan />}
        sedangKirim={sedangKirim}
        sesiTerpilih={sesiTerpilih}
        statusSesi={status}
        tampilkanGalatAlasan={tampilkanGalatAlasan}
        umpanBalik={umpanBalik}
      />

      <BottomSheet
        deskripsi="Pengajuan hanya dapat dibuat satu kali untuk sesi ini. Setelah terkirim, kamu menunggu keputusan asisten."
        judul="Kirim pengajuan izin?"
        labelBatal="Batal"
        labelKonfirmasi="Kirim"
        onClose={() => setKonfirmasiTerbuka(false)}
        onKonfirmasi={kirim}
        visible={konfirmasiTerbuka}
      >
        <Text className="text-body font-semibold text-text">{sesiAktif?.namaKelas}</Text>
        <Text className="mt-one text-small text-textSecondary">{alasan.trim()}</Text>
      </BottomSheet>
    </>
  );
}
