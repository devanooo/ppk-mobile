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
  // Pengajuan sudah tersimpan tetapi hasil AI belum masuk, jadi masih bisa diulang.
  const [perluUlangKlasifikasi, setPerluUlangKlasifikasi] = useState(false);

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
    const klasifikasi = await jalankanKlasifikasi({ sesiTerpilih, praktikanId, alasan });

    setSedangKirim(false);

    if (klasifikasi.tersimpan) {
      router.back();
      return;
    }

    // Pengajuan tetap tersimpan, tetapi hasil AI belum masuk. Banner tidak boleh
    // mengaku sukses penuh karena pengguna perlu tahu ada yang belum lengkap.
    setUmpanBalik({
      jenis: 'gagal',
      pesan: `Pengajuan izin terkirim, tetapi hasil klasifikasi AI belum tersimpan. ${klasifikasi.pesan}`,
    });
  }

  /**
   * Mengulang klasifikasi untuk pengajuan yang SUDAH tersimpan. Tidak memanggil
   * `ajukanIzin`, jadi tidak memicu penolakan duplikat dan tidak menimpa alasan.
   */
  async function ulangKlasifikasi() {
    if (!db || !sesiTerpilih || !praktikanId) return;

    setSedangKirim(true);
    setUmpanBalik(null);

    const klasifikasi = await jalankanKlasifikasi({ sesiTerpilih, praktikanId, alasan });

    setSedangKirim(false);

    if (!klasifikasi.tersimpan) {
      setUmpanBalik({ jenis: 'gagal', pesan: klasifikasi.pesan });
      return;
    }

    if (klasifikasi.kategoriOk) {
      setUmpanBalik({ jenis: 'sukses', pesan: 'Alasan berhasil diklasifikasikan ulang' });
      return;
    }

    setUmpanBalik({ jenis: 'gagal', pesan: klasifikasi.pesan });
  }

  /** Klasifikasi + simpan. Dipakai alur kirim maupun ulang, supaya hasilnya sama. */
  async function jalankanKlasifikasi({
    sesiTerpilih: sesiId,
    praktikanId: uid,
    alasan: teks,
  }: {
    sesiTerpilih: string;
    praktikanId: string;
    alasan: string;
  }) {
    if (!db) {
      return { tersimpan: false, kategoriOk: false, pesan: 'Data sesi belum tersedia' };
    }

    const kategori = await klasifikasiAlasan(teks);
    const simpan = await simpanHasilKlasifikasi({
      db,
      sesiId,
      praktikanId: uid,
      kategoriAi: kategori.ok ? kategori.kategori : undefined,
      klasifikasiStatus: kategori.ok ? 'selesai' : 'gagal',
    });

    setPerluUlangKlasifikasi(!kategori.ok || !simpan.ok);

    return {
      tersimpan: simpan.ok,
      kategoriOk: kategori.ok,
      pesan: simpan.ok ? simpan.pesan : (kategori.ok ? simpan.pesan : kategori.pesan),
    };
  }

  return (
    <>
      <FormAjukanIzin
        alasan={alasan}
        alasanNonaktif={alasanNonaktif}
        bolehCobaLagi={perluUlangKlasifikasi}
        daftarSesi={sesi}
        onAjukan={cobaAjukan}
        onCobaLagi={ulangKlasifikasi}
        onKembali={() => router.back()}
        onPilihSesi={setSesiTerpilih}
        onTutupUmpanBalik={() => setUmpanBalik(null)}
        onUbahAlasan={setAlasan}
        profil={<MenuProfilPraktikan />}
        sedangKirim={sedangKirim}
        sesiTerpilih={sesiTerpilih}
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
