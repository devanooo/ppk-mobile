import { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

import { LABORATORY_OPTIONS } from '@/features/maps/constants/laboratory';
import { useLaboratories } from '@/features/maps/hooks/useLaboratories';
import { useLocation } from '@/features/maps/hooks/useLocation';
import { labDariSesi } from '@/features/maps/pemilihan-lab';
import { calculateDistance } from '@/features/maps/utils/haversine';
import { useDetailSesiPraktikan } from '@/features/praktikan/use-detail-sesi-praktikan';
import { db } from '@/lib/firebase';
import { catatPresensi } from '@/lib/presensi';
import { PESAN_QR, bacaPayloadQr, periksaPayloadQr } from '@/lib/qr';

import type { AlasanTolak as AlasanAturan } from './aturan';
import { validasiPresensi } from './aturan';
import type { AlasanIdentitas } from './identitas';
import { validasiIdentitas } from './identitas';
import type { JenisHasil } from './dialog-hasil';
import type { StatusLokasi } from './layar-pindai';
import { cariLaboratorium, keLabPresensi, petakanLab } from './lokasi';
import { usePemindaiQr } from './use-pemindai-qr';

const DEPS = {
  bacaQr: bacaPayloadQr,
  periksaQr: periksaPayloadQr,
  pesanQr: PESAN_QR,
  hitungJarak: calculateDistance,
};

/** Alasan penolakan dipetakan ke empat dialog pada referensi 04. */
function keJenisHasil(alasan: AlasanAturan | AlasanIdentitas): JenisHasil {
  switch (alasan) {
    case 'DI_LUAR_RADIUS':
      return 'di-luar-radius';
    case 'QR_TIDAK_VALID':
    case 'QR_KEDALUWARSA':
    case 'QR_SESI_TIDAK_COCOK':
      return 'qr-tidak-valid';
    case 'PRESENSI_SUDAH_ADA':
      return 'sudah-presensi';
    default:
      return 'presensi-tidak-valid';
  }
}

/**
 * Penghubung layar pindai: izin kamera, lokasi perangkat, data sesi, dan
 * pelabuhan lab → satu hasil validasi. Data sesi tetap dibaca lewat hook yang
 * sudah ada, tidak diduplikasi di layar.
 */
export function useLayarPindai(sesiId: string, praktikanId: string) {
  const kamera = usePemindaiQr();
  const lokasi = useLocation();
  const { laboratories } = useLaboratories();
  const detail = useDetailSesiPraktikan(db, sesiId, praktikanId);

  const [hasil, setHasil] = useState<JenisHasil | null>(null);
  const [pesertaIds, setPesertaIds] = useState<string[]>([]);
  const [sudahPresensi, setSudahPresensi] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  // Peserta kelas dibaca dari dokumen kelas sesi: aturan menolak praktikan
  // yang tidak terdaftar, dan Security Rules menegakkan hal yang sama.
  // Selama sesi belum termuat, `pesertaIds` tetap kosong sehingga validasi
  // gagal-tertutup (menolak), bukan lolos tanpa pemeriksaan.
  const kelasId = detail.sesi?.kelasId;

  useEffect(() => {
    if (!kelasId) return;

    return onSnapshot(doc(db, 'kelas', kelasId), (snapshot) => {
      const daftar = snapshot.exists() ? snapshot.data().pesertaIds : [];

      setPesertaIds(Array.isArray(daftar) ? daftar : []);
    });
  }, [kelasId]);

  // Duplikasi presensi dicek dari dokumen presensi praktikan itu sendiri.
  useEffect(() => {
    if (!sesiId || !praktikanId) return;

    return onSnapshot(
      doc(db, 'sesi', sesiId, 'presensi', praktikanId),
      (snapshot) => setSudahPresensi(snapshot.exists()),
    );
  }, [praktikanId, sesiId]);

  /**
   * Sumber utama koordinat dan radius adalah dokumen sesi (`labId`,
   * `labLatitude`, `labLongitude`, `labRadiusMeters`, milik P1). Koleksi `labs`
   * hanya cadangan untuk sesi lama yang belum menyimpan data lab; dengan begitu
   * validasi tidak bergantung pada rules `labs`.
   */
  const lab = useMemo(() => {
    if (!detail.sesi) return null;

    const dariSesi = labDariSesi(detail.sesi);
    const idLab = dariSesi ? petakanLab(dariSesi.id, LABORATORY_OPTIONS) : null;

    if (dariSesi && idLab) {
      return {
        id: idLab,
        nama: dariSesi.nama,
        latitude: dariSesi.latitude,
        longitude: dariSesi.longitude,
        radiusMeter: dariSesi.radiusMeters,
      };
    }

    const dokumen = cariLaboratorium(
      laboratories,
      detail.sesi.lab,
      LABORATORY_OPTIONS,
    );

    return dokumen ? keLabPresensi(dokumen) : null;
  }, [detail.sesi, laboratories]);

  const statusLokasi: StatusLokasi = useMemo(() => {
    if (lokasi.status === 'permission-denied' || lokasi.status === 'gps-disabled') {
      return 'tidak-aktif';
    }

    if (lokasi.loading || !lokasi.location) {
      return 'mencari';
    }

    return lab ? 'lab-dikenal' : 'terdeteksi';
  }, [lab, lokasi.loading, lokasi.location, lokasi.status]);

  const terimaTeks = useCallback(
    async (teks: string) => {
      if (!detail.sesi || menyimpan) return;

      // Identitas dan duplikasi diperiksa lebih dulu: praktikan asing tidak
      // boleh menerima pesan "di luar radius".
      const hasilIdentitas = validasiIdentitas({
        praktikanId,
        pesertaIds,
        sudahPresensi,
      });

      if (!hasilIdentitas.ok) {
        setHasil(keJenisHasil(hasilIdentitas.alasan));
        return;
      }

      const hasilValidasi = validasiPresensi(
        {
          payloadTeks: teks,
          sesiId,
          statusSesi: detail.sesi.status,
          lab,
          lokasi: lokasi.location
            ? {
                latitude: lokasi.location.latitude,
                longitude: lokasi.location.longitude,
              }
            : null,
        },
        DEPS,
      );

      if (!hasilValidasi.ok) {
        setHasil(keJenisHasil(hasilValidasi.alasan));
        return;
      }

      // Validasi lolos: presensi baru dicatat sekarang, bukan saat QR terbaca
      // (NFR-05). Gagal simpan tidak boleh ditampilkan sebagai berhasil.
      setMenyimpan(true);

      try {
        const dicatat = await catatPresensi({ db, sesiId, praktikanId });

        setHasil(dicatat.ok ? 'berhasil' : 'gagal-simpan');
      } finally {
        setMenyimpan(false);
      }
    },
    [detail.sesi, lab, lokasi.location, menyimpan, pesertaIds, praktikanId, sesiId, sudahPresensi],
  );

  const onTerdeteksi = useCallback(
    (teks: string) => {
      kamera.terimaTeks(teks, terimaTeks);
    },
    [kamera, terimaTeks],
  );

  const tutupHasil = useCallback(() => {
    setHasil(null);
    kamera.bukaKunci();
  }, [kamera]);

  return {
    // Kamera
    izinKamera: kamera.izinDiberikan,
    memuatIzinKamera: kamera.memuatIzin,
    bisaMintaKamera: kamera.bisaDimintaLagi,
    onMintaKamera: kamera.mintaAkses,
    senter: kamera.senter,
    onPutarSenter: kamera.putarSenter,
    zoom: kamera.zoom,
    onTambahZoom: kamera.tambahZoom,
    onKurangiZoom: kamera.kurangiZoom,
    terkunci: kamera.terkunci,
    onTerdeteksi,

    // Lokasi
    statusLokasi,
    izinLokasi: lokasi.permissionGranted,
    bisaMintaLokasi: lokasi.status !== 'permission-denied',
    onMintaLokasi: lokasi.retry,
    namaLabTerdeteksi: lab?.nama,
    koordinatTerdeteksi: lokasi.location
      ? {
          latitude: lokasi.location.latitude,
          longitude: lokasi.location.longitude,
        }
      : undefined,

    // Sesi
    sesi: detail.sesi
      ? {
          namaKelas: detail.sesi.namaKelas,
          lab: detail.sesi.lab,
          hari: detail.sesi.hari,
          tanggal: detail.sesi.tanggal,
          jamMulai: detail.sesi.jamMulai,
          jamSelesai: detail.sesi.jamSelesai,
          status: detail.sesi.status,
        }
      : null,

    // Hasil
    hasil,
    onAksiHasil: tutupHasil,
    onTutupHasil: tutupHasil,
  };
}
