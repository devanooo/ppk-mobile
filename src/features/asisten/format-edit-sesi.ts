import {
  formatTanggalPanjang,
  keTanggal,
  keTanggalISO,
} from '@/features/praktikan/format-sesi';

/** Format simpan `HH:MM` 24 jam, sama dengan yang diterima `validasiWaktuSesi`. */
export const POLA_JAM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function tanggalValid(tanggal: string): boolean {
  const waktu = keTanggal(tanggal);

  return waktu !== null && keTanggalISO(waktu) === tanggal;
}

/** Nama hari dari tanggal ISO lokal, mis. `Rabu`. Kosong bila tanggal tidak valid. */
export function hariDariTanggal(tanggal: string): string {
  if (!tanggalValid(tanggal)) return '';

  return formatTanggalPanjang(tanggal).split(',')[0] ?? '';
}

/** Tanggal panjang tanpa nama hari, mis. `18 November 2026`. */
export function tanggalPanjang(tanggal: string): string {
  if (!tanggalValid(tanggal)) return tanggal;

  return formatTanggalPanjang(tanggal).split(', ')[1] ?? tanggal;
}

/** `YYYY-MM-DD` menjadi teks input `DD/MM/YYYY`. */
export function keInputTanggal(tanggal: string): string {
  if (!tanggalValid(tanggal)) return '';

  const [tahun, bulan, hari] = tanggal.split('-');

  return `${hari}/${bulan}/${tahun}`;
}

/** `DD/MM/YYYY` menjadi `YYYY-MM-DD`, atau `null` bila tanggal tidak nyata. */
export function dariInputTanggal(input: string): string | null {
  const cocok = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input.trim());

  if (!cocok) return null;

  const [, hari, bulan, tahun] = cocok;
  const tanggal = `${tahun}-${bulan}-${hari}`;

  return tanggalValid(tanggal) ? tanggal : null;
}

/** Menyisipkan garis miring saat mengetik, maksimal `DD/MM/YYYY`. */
export function maskTanggal(input: string): string {
  const angka = input.replace(/\D/g, '').slice(0, 8);
  const bagian = [angka.slice(0, 2), angka.slice(2, 4), angka.slice(4, 8)];

  return bagian.filter(Boolean).join('/');
}

/** Menyisipkan titik dua saat mengetik, maksimal `HH:MM`. */
export function maskJam(input: string): string {
  const angka = input.replace(/\D/g, '').slice(0, 4);

  if (angka.length <= 2) return angka;

  return `${angka.slice(0, 2)}:${angka.slice(2)}`;
}

export function jamValid(jam: string): boolean {
  return POLA_JAM.test(jam);
}

/** `HH:MM` menjadi `Date` hari ini pada jam tersebut, untuk picker native. */
export function keTanggalJam(jam: string): Date {
  const [pukul, menit] = jam.split(':').map(Number);
  const waktu = new Date();

  waktu.setHours(
    Number.isFinite(pukul) ? pukul : 0,
    Number.isFinite(menit) ? menit : 0,
    0,
    0,
  );

  return waktu;
}

export function dariTanggalJam(waktu: Date): string {
  const pukul = String(waktu.getHours()).padStart(2, '0');
  const menit = String(waktu.getMinutes()).padStart(2, '0');

  return `${pukul}:${menit}`;
}
