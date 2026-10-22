import type { Kredensial, Peran, Presensi, Sesi, User } from '@/types';

/** State aplikasi yang dimutasi lewat fungsi murni; `user` null berarti belum login. */
export type StateAplikasi = {
  user: User | null;
  sesi: Sesi[];
  presensi: Presensi[];
};

export type HasilAksi = { ok: boolean; pesan: string };

export type HasilLogin = { ok: true; user: User } | { ok: false; pesan: string };

/** Hasil transisi yang mengganti identitas aktif. */
export type HasilIdentitas =
  | { ok: true; user: User; state: StateAplikasi }
  | { ok: false; pesan: string };

/** Hasil transisi sesi dan presensi, membawa state baru saat berhasil. */
export type HasilState =
  | { ok: true; state: StateAplikasi; pesan: string }
  | { ok: false; pesan: string };

/** Teks penolakan mengikuti PRD bagian 10. */
const PESAN = {
  loginGagal: 'Username atau kata sandi salah',
  sesiBelumDibuka: 'Sesi belum dibuka',
  sesiSudahDibuka: 'Sesi sudah dibuka',
  sesiSudahDitutup: 'Sesi sudah ditutup',
  sesiTidakDitemukan: 'Sesi tidak ditemukan',
  presensiGanda: 'Presensi sudah tercatat pada sesi ini',
  tidakTerdaftar: 'Kamu tidak terdaftar pada sesi ini',
  peranTidakDikenal: 'Peran demo tidak dikenali',
};

/** Kontrak PEMBAGIAN-TUGAS bagian 4: ganti peran demo menukar akun antara dua peran. */
const PERAN_LAWAN: Record<Peran, string> = {
  asisten: 'mhs-1',
  praktikan: 'asisten-1',
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

export function masuk(
  state: StateAplikasi,
  daftarKredensial: Kredensial[],
  daftarUser: User[],
  username: string,
  password: string,
): HasilIdentitas {
  const hasil = cocokkanKredensial(daftarKredensial, daftarUser, username, password);
  if (!hasil.ok) return hasil;
  return { ok: true, user: hasil.user, state: { ...state, user: hasil.user } };
}

export function keluar(state: StateAplikasi): StateAplikasi {
  return { ...state, user: null };
}

export function gantiPeran(
  state: StateAplikasi,
  daftarUser: User[],
  userId?: string,
): HasilIdentitas {
  const tujuanId = userId ?? (state.user ? PERAN_LAWAN[state.user.peran] : null);
  const tujuan = tujuanId ? daftarUser.find((u) => u.id === tujuanId) : undefined;
  if (!tujuan) return { ok: false, pesan: PESAN.peranTidakDikenal };
  return { ok: true, user: tujuan, state: { ...state, user: tujuan } };
}

export function bukaSesi(state: StateAplikasi, sesiId: string, waktu: string): HasilState {
  const target = state.sesi.find((s) => s.id === sesiId);
  if (!target) return { ok: false, pesan: PESAN.sesiTidakDitemukan };
  if (target.status === 'dibuka') return { ok: false, pesan: PESAN.sesiSudahDibuka };
  if (target.status === 'ditutup') return { ok: false, pesan: PESAN.sesiSudahDitutup };

  const sesiBaru: Sesi = { ...target, status: 'dibuka', dibukaPada: waktu };
  return {
    ok: true,
    state: { ...state, sesi: gantiSesi(state.sesi, sesiBaru) },
    pesan: `Sesi dibuka pukul ${formatJam(waktu)}`,
  };
}

export function tutupSesi(state: StateAplikasi, sesiId: string, waktu: string): HasilState {
  const target = state.sesi.find((s) => s.id === sesiId);
  if (!target) return { ok: false, pesan: PESAN.sesiTidakDitemukan };
  if (target.status === 'belum-dibuka') return { ok: false, pesan: PESAN.sesiBelumDibuka };
  if (target.status === 'ditutup') return { ok: false, pesan: PESAN.sesiSudahDitutup };

  const sesiBaru: Sesi = { ...target, status: 'ditutup', ditutupPada: waktu };
  return {
    ok: true,
    state: { ...state, sesi: gantiSesi(state.sesi, sesiBaru) },
    pesan: `Sesi ditutup pukul ${formatJam(waktu)}`,
  };
}

export function catatPresensi(
  state: StateAplikasi,
  sesiId: string,
  praktikanId: string,
  waktu: string,
): HasilState {
  const target = state.sesi.find((s) => s.id === sesiId);
  if (!target) return { ok: false, pesan: PESAN.sesiTidakDitemukan };
  if (target.status === 'belum-dibuka') return { ok: false, pesan: PESAN.sesiBelumDibuka };
  if (target.status === 'ditutup') return { ok: false, pesan: PESAN.sesiSudahDitutup };
  if (!target.pesertaIds.includes(praktikanId)) return { ok: false, pesan: PESAN.tidakTerdaftar };

  const sudahTercatat = state.presensi.some(
    (p) => p.sesiId === sesiId && p.praktikanId === praktikanId,
  );
  if (sudahTercatat) return { ok: false, pesan: PESAN.presensiGanda };

  const presensiBaru: Presensi = { sesiId, praktikanId, waktu };
  return {
    ok: true,
    state: { ...state, presensi: [...state.presensi, presensiBaru] },
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

function gantiSesi(daftarSesi: Sesi[], sesiBaru: Sesi): Sesi[] {
  return daftarSesi.map((sesi) => (sesi.id === sesiBaru.id ? sesiBaru : sesi));
}
