/**
 * Aturan murni pengajuan dan keputusan izin (T-038).
 *
 * Dipisah dari `izin.ts` karena modul ini tidak punya impor runtime sama sekali:
 * `src/lib/izin-logic.assert.mjs` mengimpornya langsung lewat Node, yang
 * mewajibkan ekstensi `.ts` pada setiap impor relatif. Aturan yang sama juga
 * dipakai form, supaya pesan penolakan di UI dan di lapisan data tidak
 * menyimpang.
 */

import type { KlasifikasiStatus, StatusIzin } from '@/features/izin/types';

export type HasilAksi = { ok: boolean; pesan: string };

export const PANJANG_ALASAN = { minimum: 5, maksimum: 500 } as const;

export const PESAN_IZIN = {
  alasanKosong: 'Alasan izin belum diisi',
  alasanTerlaluPendek: `Alasan minimal ${PANJANG_ALASAN.minimum} karakter`,
  alasanTerlaluPanjang: `Alasan maksimal ${PANJANG_ALASAN.maksimum} karakter`,
  pengajuanGanda: 'Pengajuan izin sudah ada untuk sesi ini',
  sesiDitutup: 'Sesi sudah ditutup, pengajuan izin tidak dapat dibuat',
  bukanPeserta: 'Kamu tidak terdaftar pada sesi ini',
  sudahDiputuskan: 'Pengajuan izin ini sudah diputuskan',
  izinTidakDitemukan: 'Pengajuan izin tidak ditemukan',
  gagalSimpan: 'Pengajuan izin gagal disimpan',
  gagalMuat: 'Pengajuan izin gagal dimuat',
  gagalPutuskan: 'Keputusan izin gagal disimpan',
  gagalKlasifikasi: 'Hasil klasifikasi gagal disimpan',
} as const;

export function validasiAlasan(alasan: string): HasilAksi {
  const rapi = alasan.trim();

  if (rapi.length === 0) {
    return { ok: false, pesan: PESAN_IZIN.alasanKosong };
  }

  if (rapi.length < PANJANG_ALASAN.minimum) {
    return { ok: false, pesan: PESAN_IZIN.alasanTerlaluPendek };
  }

  if (rapi.length > PANJANG_ALASAN.maksimum) {
    return { ok: false, pesan: PESAN_IZIN.alasanTerlaluPanjang };
  }

  return { ok: true, pesan: 'Alasan izin valid' };
}

/** Keputusan hanya boleh diambil sekali (AC US-11 nomor 4). */
export function bolehDiputuskan(status: StatusIzin): HasilAksi {
  if (status !== 'menunggu') {
    return { ok: false, pesan: PESAN_IZIN.sudahDiputuskan };
  }

  return { ok: true, pesan: 'Pengajuan izin dapat diputuskan' };
}

/**
 * Pengajuan hanya untuk sesi yang belum ditutup dan oleh peserta kelasnya
 * (AC US-09 nomor 2 dan 5). Aturan yang sama tetap ditegakkan Security Rules;
 * ini hanya lapisan pesan yang ramah.
 */
export function bolehDiajukan({
  statusSesi,
  pesertaIds,
  praktikanId,
  sudahAda,
}: {
  statusSesi: 'belum-dibuka' | 'dibuka' | 'ditutup';
  pesertaIds: string[];
  praktikanId: string;
  sudahAda: boolean;
}): HasilAksi {
  if (!pesertaIds.includes(praktikanId)) {
    return { ok: false, pesan: PESAN_IZIN.bukanPeserta };
  }

  if (statusSesi === 'ditutup') {
    return { ok: false, pesan: PESAN_IZIN.sesiDitutup };
  }

  if (sudahAda) {
    return { ok: false, pesan: PESAN_IZIN.pengajuanGanda };
  }

  return { ok: true, pesan: 'Pengajuan izin dapat dibuat' };
}

/** Error Firestore dipetakan ke bahasa Indonesia (NFR-03). */
export function pesanDariGalat(galat: unknown, cadangan: string = PESAN_IZIN.gagalMuat): string {
  const kode = (galat as { code?: string })?.code;

  switch (kode) {
    case 'permission-denied':
      return 'Kamu tidak punya akses ke data izin ini';
    case 'unavailable':
      return 'Tidak dapat terhubung ke server, coba lagi';
    case 'not-found':
      return PESAN_IZIN.izinTidakDitemukan;
    default:
      return cadangan;
  }
}

export type { KlasifikasiStatus, StatusIzin };
