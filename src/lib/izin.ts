/**
 * Lapisan akses dokumen izin di Firestore (T-038).
 *
 * Kontrak koleksi mengikuti docs/sprints/sprint-2.md bagian 8.3:
 *   sesi/{sesiId}/izin/{uid}
 *     praktikanId, alasan, status, kategoriAi?, klasifikasiStatus,
 *     diprosesPada?, dibuatPada, diputuskanPada?, diputuskanOleh?
 *
 * ID dokumen sama dengan uid praktikan, jadi satu pengajuan per sesi per
 * praktikan dijamin oleh jalur tulis, bukan hanya oleh validasi UI.
 *
 * Catatan untuk P1: `db` diterima sebagai parameter, bukan diimpor dari
 * `@/lib/firebase`, karena modul itu belum ada saat berkas ini ditulis. Setelah
 * T-016 merge, layar cukup mengoper `db` dari `@/lib/firebase`; bentuk fungsi di
 * sini tidak berubah. Begitu `@/lib/konversi` menyediakan `izinConverter`
 * (T-017), pasang di `rujukanIzinSesi` lalu hapus konversi Timestamp manual di
 * `keIzin`. `pesanDariGalat` juga digantikan `petakanErrorFirestore` (T-018).
 */

import {
  collection,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';

import type { Izin, IzinDokumen, KlasifikasiStatus, StatusIzin } from '@/features/izin/types';
import { izinConverter } from '@/lib/konversi';
import type { IzinFirestore } from '@/types/firestore';

import type { HasilKlasifikasi } from './ai-pemetaan';
import { klasifikasiAlasan } from './ai';
import {
  PESAN_IZIN,
  bolehDiklasifikasiUlang,
  bolehDiputuskan,
  pesanDariGalat,
  validasiAlasan,
} from './izin-aturan';

export {
  PESAN_IZIN,
  PANJANG_ALASAN,
  bolehDiajukan,
  bolehDiklasifikasiUlang,
  bolehDiputuskan,
  pesanDariGalat,
  validasiAlasan,
} from './izin-aturan';
export type HasilMuat<T> = { ok: true; data: T } | { ok: false; pesan: string };

function keTanggal(nilai: unknown): Date | undefined {
  if (!nilai) return undefined;
  if (nilai instanceof Date) return nilai;

  const kandidat = nilai as { toDate?: () => Date };

  return typeof kandidat.toDate === 'function' ? kandidat.toDate() : undefined;
}

function keIzin(sesiId: string, id: string, data: IzinFirestore): Izin {
  return {
    id,
    sesiId,
    praktikanId: data.praktikanId,
    alasan: data.alasan,
    status: data.status,
    kategoriAi: data.kategoriAi,
    klasifikasiStatus: data.klasifikasiStatus,
    diprosesPada: keTanggal(data.diprosesPada),
    dibuatPada: keTanggal(data.dibuatPada) ?? new Date(0),
    diputuskanPada: keTanggal(data.diputuskanPada),
    diputuskanOleh: data.diputuskanOleh,
  };
}

export function rujukanIzinSesi(db: Firestore, sesiId: string) {
  return collection(db, 'sesi', sesiId, 'izin').withConverter(izinConverter);
}

function rujukanIzinPraktikan(db: Firestore, sesiId: string, praktikanId: string) {
  return doc(db, 'sesi', sesiId, 'izin', praktikanId).withConverter(izinConverter);
}

/**
 * Mendengarkan seluruh izin pada satu sesi. Mengembalikan fungsi pembersih;
 * pemanggil WAJIB memanggilnya di cleanup `useEffect` (sprint-2 bagian 8.4).
 */
export function dengarkanIzinSesi(
  db: Firestore,
  sesiId: string,
  onData: (hasil: HasilMuat<Izin[]>) => void,
): () => void {
  return onSnapshot(
    rujukanIzinSesi(db, sesiId),
    (snapshot) => {
      const data = snapshot.docs.map((dokumen) =>
        keIzin(sesiId, dokumen.id, dokumen.data()),
      );

      onData({ ok: true, data });
    },
    (galat) => onData({ ok: false, pesan: pesanDariGalat(galat) }),
  );
}

/**
 * Mendengarkan izin milik satu praktikan lintas sesi. `sesiIds` dibatasi
 * pemanggil supaya jumlah listener tetap terkendali (sprint-2 bagian 8.4).
 */
export function dengarkanIzinSaya(
  db: Firestore,
  praktikanId: string,
  sesiIds: string[],
  onData: (hasil: HasilMuat<Izin[]>) => void,
): () => void {
  const terkumpul = new Map<string, Izin>();
  let gagal = false;

  const kirim = () => {
    if (!gagal) onData({ ok: true, data: [...terkumpul.values()] });
  };

  const pembersih = sesiIds.map((sesiId) =>
    onSnapshot(
      rujukanIzinPraktikan(db, sesiId, praktikanId),
      (snapshot) => {
        if (snapshot.exists()) {
          terkumpul.set(sesiId, keIzin(sesiId, snapshot.id, snapshot.data()));
        } else {
          terkumpul.delete(sesiId);
        }

        kirim();
      },
      (galat) => {
        gagal = true;
        onData({ ok: false, pesan: pesanDariGalat(galat) });
      },
    ),
  );

  return () => pembersih.forEach((bersihkan) => bersihkan());
}

/**
 * Menyimpan pengajuan baru. ID dokumen = uid praktikan, sehingga pengajuan
 * kedua pada sesi yang sama menimpa jalur yang sama dan ditolak di sini
 * (AC US-09 nomor 3).
 *
 * Cek keberadaan dan penulisan dilakukan dalam satu transaksi. Pola getDoc lalu
 * setDoc tanpa transaksi membuka celah: dua pengajuan bersamaan sama-sama
 * membaca "belum ada", lalu saling menimpa.
 */
export async function ajukanIzin({
  db,
  sesiId,
  praktikanId,
  alasan,
}: {
  db: Firestore;
  sesiId: string;
  praktikanId: string;
  alasan: string;
}): Promise<{ ok: boolean; pesan: string }> {
  const validasi = validasiAlasan(alasan);

  if (!validasi.ok) return validasi;

  try {
    const rujukan = doc(db, 'sesi', sesiId, 'izin', praktikanId);

    const sudahAda = await runTransaction(db, async (transaksi) => {
      const lama = await transaksi.get(rujukan);

      if (lama.exists()) return true;

      const dokumen: IzinDokumen = {
        praktikanId,
        alasan: alasan.trim(),
        status: 'menunggu',
        klasifikasiStatus: 'menunggu',
        dibuatPada: serverTimestamp() as unknown as Date,
      };

      transaksi.set(rujukan, dokumen);

      return false;
    });

    if (sudahAda) {
      return { ok: false, pesan: PESAN_IZIN.pengajuanGanda };
    }

    return { ok: true, pesan: 'Pengajuan izin terkirim' };
  } catch (galat) {
    // Transaksi bisa gagal karena dokumen lebih dulu dibuat proses lain.
    if ((galat as { code?: string })?.code === 'already-exists') {
      return { ok: false, pesan: PESAN_IZIN.pengajuanGanda };
    }

    return { ok: false, pesan: pesanDariGalat(galat, PESAN_IZIN.gagalSimpan) };
  }
}

/**
 * Menyimpan keputusan asisten. Hanya untuk pengajuan berstatus `menunggu`;
 * field yang ditulis dibatasi pada tiga field keputusan (AC US-11 nomor 3).
 *
 * Pemeriksaan status dan penulisan berada dalam satu transaksi, supaya dua
 * asisten yang memutuskan bersamaan tidak saling menimpa keputusan.
 */
export async function putuskanIzin({
  db,
  sesiId,
  praktikanId,
  keputusan,
  asistenId,
}: {
  db: Firestore;
  sesiId: string;
  praktikanId: string;
  keputusan: 'disetujui' | 'ditolak';
  asistenId: string;
}): Promise<{ ok: boolean; pesan: string }> {
  try {
    const rujukan = doc(db, 'sesi', sesiId, 'izin', praktikanId);

    const hasil = await runTransaction(db, async (transaksi) => {
      const sekarang = await transaksi.get(rujukan);

      if (!sekarang.exists()) {
        return PESAN_IZIN.izinTidakDitemukan;
      }

      const data = sekarang.data() as { status?: StatusIzin };
      const boleh = bolehDiputuskan(data.status ?? 'menunggu');

      if (!boleh.ok) return boleh.pesan;

      transaksi.update(rujukan, {
        status: keputusan,
        diputuskanPada: serverTimestamp(),
        diputuskanOleh: asistenId,
      });

      return undefined;
    });

    if (hasil) {
      return { ok: false, pesan: hasil };
    }

    return {
      ok: true,
      pesan: keputusan === 'disetujui' ? 'Pengajuan izin disetujui' : 'Pengajuan izin ditolak',
    };
  } catch (galat) {
    return { ok: false, pesan: pesanDariGalat(galat, PESAN_IZIN.gagalPutuskan) };
  }
}

/**
 * Menulis hasil klasifikasi AI. Tidak pernah menyentuh `status`, karena hasil
 * AI hanya informasi pendukung (AC US-10 nomor 5).
 *
 * Saat klasifikasi gagal, `kategoriAi` lama dihapus. Tanpa itu badge akan
 * menampilkan kategori dari percobaan sebelumnya bersama status `gagal`, sehingga
 * kategori basi terbaca sebagai hasil yang masih berlaku.
 */
export async function simpanHasilKlasifikasi({
  db,
  sesiId,
  praktikanId,
  kategoriAi,
  klasifikasiStatus,
}: {
  db: Firestore;
  sesiId: string;
  praktikanId: string;
  kategoriAi?: string;
  klasifikasiStatus: KlasifikasiStatus;
}): Promise<{ ok: boolean; pesan: string }> {
  try {
    await updateDoc(doc(db, 'sesi', sesiId, 'izin', praktikanId), {
      klasifikasiStatus,
      kategoriAi: kategoriAi ?? deleteField(),
      diprosesPada: serverTimestamp(),
    });

    return {
      ok: true,
      pesan:
        klasifikasiStatus === 'selesai'
          ? 'Alasan berhasil diklasifikasikan'
          : 'Klasifikasi AI gagal',
    };
  } catch (galat) {
    return { ok: false, pesan: pesanDariGalat(galat, PESAN_IZIN.gagalKlasifikasi) };
  }
}

/**
 * Mengulang klasifikasi untuk pengajuan yang SUDAH tersimpan.
 *
 * `alasan` selalu dibaca dari dokumen, bukan dari state form. Kalau layar
 * mengirim teks yang sedang diketik, hasil AI bisa mengklasifikasi teks yang
 * berbeda dari isi pengajuan, dan `simpanHasilKlasifikasi` akan menimpanya.
 *
 * Tidak memanggil `ajukanIzin`, jadi tidak memicu penolakan duplikat dan tidak
 * menyentuh alasan.
 */
export async function klasifikasiUlangIzin({
  db,
  sesiId,
  praktikanId,
}: {
  db: Firestore;
  sesiId: string;
  praktikanId: string;
}): Promise<HasilKlasifikasi> {
  try {
    const dokumen = await getDoc(doc(db, 'sesi', sesiId, 'izin', praktikanId));

    if (!dokumen.exists()) {
      return { ok: false, pesan: PESAN_IZIN.izinTidakDitemukan };
    }

    const data = dokumen.data() as IzinDokumen;
    const boleh = bolehDiklasifikasiUlang(data.status);

    if (!boleh.ok) {
      return { ok: false, pesan: boleh.pesan };
    }

    const hasil = await klasifikasiAlasan(data.alasan);
    const simpan = await simpanHasilKlasifikasi({
      db,
      sesiId,
      praktikanId,
      kategoriAi: hasil.ok ? hasil.kategori : undefined,
      klasifikasiStatus: hasil.ok ? 'selesai' : 'gagal',
    });

    if (!simpan.ok) {
      return { ok: false, pesan: simpan.pesan };
    }

    return hasil;
  } catch (galat) {
    return { ok: false, pesan: pesanDariGalat(galat, PESAN_IZIN.gagalKlasifikasi) };
  }
}
