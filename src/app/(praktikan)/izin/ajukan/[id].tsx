import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { FormAjukanIzin, type UmpanBalik } from '@/features/izin/form-ajukan-izin';
import { useSesiPeserta } from '@/features/izin/use-sesi-peserta';
import { useSesiPraktikan } from '@/features/izin/use-sesi-praktikan';
import { MenuProfilPraktikan } from '@/features/praktikan/menu-profil';
import { klasifikasiAlasan } from '@/lib/ai';
import { db } from '@/lib/firebase';
import { ajukanIzin, klasifikasiUlangIzin, simpanHasilKlasifikasi } from '@/lib/izin';
import { bolehDiajukan, validasiAlasan } from '@/lib/izin-aturan';
import { kirimEventNotifikasi } from '@/lib/notifikasi';
import { useSession } from '@/store/session-store';

export default function AjukanIzinDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sesiId = Array.isArray(id) ? id[0] : id;
  const { user } = useSession();
  const praktikanId = user?.id;
  const { sesi, status, pesanGalat } = useSesiPraktikan(db, praktikanId);

  const sesiAktif = useMemo(
    () => sesi.find((item) => item.id === sesiId),
    [sesi, sesiId],
  );

  const minggu = useMemo(() => {
    if (!sesiAktif) return undefined;

    const seKelas = sesi
      .filter((item) => item.kelasId === sesiAktif.kelasId)
      .sort((a, b) =>
        `${a.tanggal}T${a.jamMulai}`.localeCompare(`${b.tanggal}T${b.jamMulai}`),
      );
    const indeks = seKelas.findIndex((item) => item.id === sesiAktif.id);

    return indeks >= 0 ? indeks + 1 : undefined;
  }, [sesi, sesiAktif]);

  const peserta = useSesiPeserta(db, sesiAktif?.id, praktikanId);

  const [alasan, setAlasan] = useState('');
  const [sedangKirim, setSedangKirim] = useState(false);
  const [umpanBalik, setUmpanBalik] = useState<UmpanBalik | null>(null);
  const [konfirmasiTerbuka, setKonfirmasiTerbuka] = useState(false);
  const [tampilkanGalatAlasan, setTampilkanGalatAlasan] = useState(false);
  // Pengajuan sudah tersimpan tetapi hasil AI belum masuk, jadi masih bisa diulang.
  const [perluUlangKlasifikasi, setPerluUlangKlasifikasi] = useState(false);

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
      : status === 'memuat' || !sesiAktif
        ? 'Memeriksa data sesi...'
        : peserta.pesanGalat
          ? peserta.pesanGalat
          : !peserta.siap
            ? 'Memeriksa data sesi...'
            : periksaBoleh && !periksaBoleh.ok
              ? periksaBoleh.pesan
              : undefined;

  function kembali() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(praktikan)/izin/ajukan');
  }

  function kembaliKeDaftar() {
    router.dismissTo({ pathname: '/(praktikan)/izin', params: { terkirim: '1' } });
  }

  function cobaTinjau() {
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
    if (!sesiAktif || !praktikanId) {
      setKonfirmasiTerbuka(false);
      setUmpanBalik({ jenis: 'gagal', pesan: 'Data sesi belum tersedia' });
      return;
    }

    setSedangKirim(true);
    setKonfirmasiTerbuka(false);

    const hasil = await ajukanIzin({
      db,
      sesiId: sesiAktif.id,
      praktikanId,
      alasan,
    });

    if (!hasil.ok) {
      setSedangKirim(false);
      setUmpanBalik({ jenis: 'gagal', pesan: hasil.pesan });
      return;
    }

    void kirimEventNotifikasi({ tipe: 'izin-diajukan', sesiId: sesiAktif.id });

    // Pengajuan sudah tersimpan. Kegagalan AI tidak boleh membatalkannya
    // (AC US-10 nomor 4), jadi hasilnya hanya memengaruhi badge klasifikasi.
    const klasifikasi = await jalankanKlasifikasi({
      sesiId: sesiAktif.id,
      praktikanId,
      alasan,
    });

    setSedangKirim(false);

    if (klasifikasi.tersimpan) {
      kembaliKeDaftar();
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
   * Mengulang klasifikasi untuk pengajuan yang SUDAH tersimpan.
   *
   * `klasifikasiUlangIzin` membaca `alasan` dari dokumen, bukan dari state form.
   * Bila memakai teks form, hasil AI bisa mengklasifikasi teks yang berbeda dari
   * isi pengajuan setelah pengguna mengedit field.
   */
  async function ulangKlasifikasi() {
    if (!sesiAktif || !praktikanId) return;

    setSedangKirim(true);
    setUmpanBalik(null);

    const hasil = await klasifikasiUlangIzin({
      db,
      sesiId: sesiAktif.id,
      praktikanId,
    });

    setSedangKirim(false);

    if (hasil.ok) {
      kembaliKeDaftar();
      return;
    }

    setPerluUlangKlasifikasi(true);
    setUmpanBalik({ jenis: 'gagal', pesan: hasil.pesan });
  }

  /** Klasifikasi + simpan. Dipakai alur kirim maupun ulang, supaya hasilnya sama. */
  async function jalankanKlasifikasi({
    sesiId: sesiUntukKlasifikasi,
    praktikanId: uid,
    alasan: teks,
  }: {
    sesiId: string;
    praktikanId: string;
    alasan: string;
  }) {
    const kategori = await klasifikasiAlasan(teks);
    const simpan = await simpanHasilKlasifikasi({
      db,
      sesiId: sesiUntukKlasifikasi,
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
    <FormAjukanIzin
      alasan={alasan}
      alasanNonaktif={alasanNonaktif}
      bolehCobaLagi={perluUlangKlasifikasi}
      konfirmasiTerbuka={konfirmasiTerbuka}
      minggu={minggu}
      onCobaLagi={ulangKlasifikasi}
      onKembali={kembali}
      onKirim={kirim}
      onTinjau={cobaTinjau}
      onTutupKonfirmasi={() => setKonfirmasiTerbuka(false)}
      onTutupUmpanBalik={() => setUmpanBalik(null)}
      onUbahAlasan={setAlasan}
      pesanGalatSesi={pesanGalat}
      profil={<MenuProfilPraktikan />}
      sedangKirim={sedangKirim}
      sesi={sesiAktif}
      statusSesi={status}
      tampilkanGalatAlasan={tampilkanGalatAlasan}
      umpanBalik={umpanBalik}
    />
  );
}
