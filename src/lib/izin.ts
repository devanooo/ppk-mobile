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
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';

import type { Izin, IzinDokumen, KlasifikasiStatus, StatusIzin } from '@/features/izin/types';

import { PESAN_IZIN, bolehDiputuskan, pesanDariGalat, validasiAlasan } from './izin-aturan';

export { PESAN_IZIN, PANJANG_ALASAN, bolehDiajukan, bolehDiputuskan, pesanDariGalat, validasiAlasan } from './izin-aturan';
export type HasilMuat<T> = { ok: true; data: T } | { ok: false; pesan: string };

function keTanggal(nilai: unknown): Date | undefined {
  if (!nilai) return undefined;
  if (nilai instanceof Date) return nilai;

  const kandidat = nilai as { toDate?: () => Date };

  return typeof kandidat.toDate === 'function' ? kandidat.toDate() : undefined;
}

function keIzin(sesiId: string, id: string, data: Record<string, unknown>): Izin {
  return {
    id,
    sesiId,
    praktikanId: String(data.praktikanId ?? id),
    alasan: String(data.alasan ?? ''),
    status: (data.status as StatusIzin) ?? 'menunggu',
    kategoriAi: typeof data.kategoriAi === 'string' ? data.kategoriAi : undefined,
    klasifikasiStatus: (data.klasifikasiStatus as KlasifikasiStatus) ?? 'menunggu',
    diprosesPada: keTanggal(data.diprosesPada),
    dibuatPada: keTanggal(data.dibuatPada) ?? new Date(0),
    diputuskanPada: keTanggal(data.diputuskanPada),
    diputuskanOleh: typeof data.diputuskanOleh === 'string' ? data.diputuskanOleh : undefined,
  };
}

export function rujukanIzinSesi(db: Firestore, sesiId: string) {
  return collection(db, 'sesi', sesiId, 'izin');
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
        keIzin(sesiId, dokumen.id, dokumen.data() as Record<string, unknown>),
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
      doc(db, 'sesi', sesiId, 'izin', praktikanId),
      (snapshot) => {
        if (snapshot.exists()) {
          terkumpul.set(
            sesiId,
            keIzin(sesiId, snapshot.id, snapshot.data() as Record<string, unknown>),
          );
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
    const lama = await getDoc(rujukan);

    if (lama.exists()) {
      return { ok: false, pesan: PESAN_IZIN.pengajuanGanda };
    }

    const dokumen: IzinDokumen = {
      praktikanId,
      alasan: alasan.trim(),
      status: 'menunggu',
      klasifikasiStatus: 'menunggu',
      dibuatPada: serverTimestamp() as unknown as Date,
    };

    await setDoc(rujukan, dokumen);

    return { ok: true, pesan: 'Pengajuan izin terkirim' };
  } catch (galat) {
    return { ok: false, pesan: pesanDariGalat(galat, PESAN_IZIN.gagalSimpan) };
  }
}

/**
 * Menyimpan keputusan asisten. Hanya untuk pengajuan berstatus `menunggu`;
 * field yang ditulis dibatasi pada tiga field keputusan (AC US-11 nomor 3).
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
    const sekarang = await getDoc(rujukan);

    if (!sekarang.exists()) {
      return { ok: false, pesan: PESAN_IZIN.izinTidakDitemukan };
    }

    const data = sekarang.data() as { status?: StatusIzin };
    const boleh = bolehDiputuskan(data.status ?? 'menunggu');

    if (!boleh.ok) return boleh;

    await updateDoc(rujukan, {
      status: keputusan,
      diputuskanPada: serverTimestamp(),
      diputuskanOleh: asistenId,
    });

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
      ...(kategoriAi ? { kategoriAi } : {}),
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
