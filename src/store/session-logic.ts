import type { Kredensial, Presensi, Sesi, User } from '@/types';

export type HasilAksi = { ok: boolean; pesan: string };

export type HasilLogin = { ok: true; user: User } | { ok: false; pesan: string };

export type HasilSesi = { ok: true; sesi: Sesi; pesan: string } | { ok: false; pesan: string };

export type HasilPresensi =
  | { ok: true; presensi: Presensi; pesan: string }
  | { ok: false; pesan: string };

/** Teks penolakan dan konfirmasi mengikuti PRD bagian 10. */
const PESAN = {
  loginGagal: 'Username atau kata sandi salah',
  sesiBelumDibuka: 'Sesi belum dibuka',
  sesiSudahDibuka: 'Sesi sudah dibuka',
  sesiSudahDitutup: 'Sesi sudah ditutup',
  presensiGanda: 'Presensi sudah tercatat pada sesi ini',
  tidakTerdaftar: 'Kamu tidak terdaftar pada sesi ini',
};

/**
 * Waktu disimpan sebagai ISO 8601 (bisa UTC) tetapi tampil sebagai jam perangkat.
 */
export function formatJam(waktu: string): string {
  const tanggal = new Date(waktu);
  const jam = String(tanggal.getHours()).padStart(2, '0');
  const menit = String(tanggal.getMinutes()).padStart(2, '0');
  return `${jam}:${menit}`;
}

export function cocokkanKredensial(
  daftarKredensial: Kredensial[],
  daftarUser: User[],
  username: string,
  password: string,
): HasilLogin {
  const kredensial = daftarKredensial.find(
    (k) => k.username.toLowerCase() === username.toLowerCase() && k.password === password,
  );
  const user = kredensial ? daftarUser.find((u) => u.id === kredensial.userId) : undefined;
  if (!user) return { ok: false, pesan: PESAN.loginGagal };
  return { ok: true, user };
}

export function bukaSesi(sesi: Sesi, waktu: string): HasilSesi {
  if (sesi.status === 'dibuka') return { ok: false, pesan: PESAN.sesiSudahDibuka };
  if (sesi.status === 'ditutup') return { ok: false, pesan: PESAN.sesiSudahDitutup };
  return {
    ok: true,
    sesi: { ...sesi, status: 'dibuka', dibukaPada: waktu },
    pesan: `Sesi dibuka pukul ${formatJam(waktu)}`,
  };
}

export function tutupSesi(sesi: Sesi, waktu: string): HasilSesi {
  if (sesi.status === 'belum-dibuka') return { ok: false, pesan: PESAN.sesiBelumDibuka };
  if (sesi.status === 'ditutup') return { ok: false, pesan: PESAN.sesiSudahDitutup };
  return {
    ok: true,
    sesi: { ...sesi, status: 'ditutup', ditutupPada: waktu },
    pesan: `Sesi ditutup pukul ${formatJam(waktu)}`,
  };
}

export function catatPresensi(
  sesi: Sesi,
  daftarPresensi: Presensi[],
  praktikanId: string,
  waktu: string,
): HasilPresensi {
  if (sesi.status === 'belum-dibuka') return { ok: false, pesan: PESAN.sesiBelumDibuka };
  if (sesi.status === 'ditutup') return { ok: false, pesan: PESAN.sesiSudahDitutup };
  if (!sesi.pesertaIds.includes(praktikanId)) return { ok: false, pesan: PESAN.tidakTerdaftar };

  const sudahTercatat = daftarPresensi.some(
    (p) => p.sesiId === sesi.id && p.praktikanId === praktikanId,
  );
  if (sudahTercatat) return { ok: false, pesan: PESAN.presensiGanda };

  return {
    ok: true,
    presensi: { sesiId: sesi.id, praktikanId, waktu },
    pesan: `Presensi tercatat pukul ${formatJam(waktu)}`,
  };
}

export function sesiUntuk(daftarSesi: Sesi[], user: User): Sesi[] {
  return user.peran === 'praktikan'
    ? daftarSesi.filter((sesi) => sesi.pesertaIds.includes(user.id))
    : daftarSesi.filter((sesi) => sesi.asistenId === user.id);
}

export function presensiSaya(daftarPresensi: Presensi[], praktikanId: string): Presensi[] {
  return daftarPresensi.filter((p) => p.praktikanId === praktikanId);
}

export function sudahPresensi(
  daftarPresensi: Presensi[],
  sesiId: string,
  praktikanId: string,
): boolean {
  return daftarPresensi.some((p) => p.sesiId === sesiId && p.praktikanId === praktikanId);
}

export function rekapSesi(
  sesiId: string,
  daftarPresensi: Presensi[],
  daftarUser: User[],
): { praktikan: User; waktu: string }[] {
  const baris = daftarPresensi
    .filter((p) => p.sesiId === sesiId)
    .map((p) => ({ praktikan: daftarUser.find((u) => u.id === p.praktikanId), waktu: p.waktu }))
    .filter((r): r is { praktikan: User; waktu: string } => r.praktikan !== undefined);

  return baris.sort((a, b) => a.waktu.localeCompare(b.waktu));
}
