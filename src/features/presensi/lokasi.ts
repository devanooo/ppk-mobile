import type { Laboratory, LaboratoryId } from '../maps/types/laboratory';

export type LabPresensi = {
  id: LaboratoryId;
  nama: string;
  latitude: number;
  longitude: number;
  radiusMeter: number;
};

export type OpsiLab = {
  id: LaboratoryId;
  label: string;
  code?: string;
};

/**
 * Menyamakan penulisan nama lab: huruf kecil, tanpa spasi, titik, garis bawah,
 * atau tanda hubung. "Lab B", "lab_b", dan "LAB B" menjadi "labb".
 */
export function normalisasiNamaLab(nilai: string): string {
  return nilai.toLowerCase().replace(/[\s._-]/g, '').trim();
}

/**
 * Kunci pencarian untuk satu opsi lab: label, id, code, dan sisa label setelah
 * awalan "lab" (mis. "AP" dari "Lab AP"). Semua kunci berasal dari data opsi,
 * bukan daftar literal terpisah.
 */
function kunciOpsi(opsi: OpsiLab): string[] {
  const kunci = [opsi.label, opsi.id, opsi.code ?? '']
    .map(normalisasiNamaLab)
    .filter((nilai) => nilai.length > 0);

  const label = normalisasiNamaLab(opsi.label);

  if (label.startsWith('lab') && label.length > 3) {
    kunci.push(label.slice(3));
  }

  return kunci;
}

/**
 * Memetakan tulisan nama lab ke nilai enum `LaboratoryId`.
 *
 * Nilai enum tidak ditulis ulang di sini: sumbernya adalah `opsi` yang dioper
 * pemanggil (`LABORATORY_OPTIONS` di kode aplikasi). Dengan begitu modul ini
 * tetap murni dan bisa dijalankan Node tanpa impor runtime enum.
 *
 * Mengembalikan `null` bila nama tidak dikenali, mis. "Lab A" yang tidak ada
 * pada daftar laboratorium.
 */
export function petakanLab(
  kelasLab: string,
  opsi: readonly OpsiLab[],
): LaboratoryId | null {
  const dicari = normalisasiNamaLab(kelasLab);

  if (!dicari) return null;

  for (const item of opsi) {
    if (kunciOpsi(item).includes(dicari)) {
      return item.id;
    }
  }

  return null;
}

/**
 * Mencari dokumen laboratorium yang sesuai dengan nama lab pada kelas.
 * Bila ada beberapa dokumen dengan id sama, dokumen aktif yang dipilih.
 * Hasil konversi Firestore sudah disaring `isActive` oleh `lab-service`, jadi
 * cabang ini hanya jaring pengaman.
 */
export function cariLaboratorium(
  labs: readonly Laboratory[],
  kelasLab: string,
  opsi: readonly OpsiLab[],
): Laboratory | null {
  const id = petakanLab(kelasLab, opsi);

  if (id === null) return null;

  const kandidat = labs.filter((lab) => lab.id === id);

  if (kandidat.length === 0) return null;

  return kandidat.find((lab) => lab.isActive) ?? kandidat[0];
}

/**
 * Mengubah dokumen laboratorium menjadi bentuk angka biasa supaya aturan
 * validasi tetap murni dan bisa diuji tanpa `GeoPoint`.
 */
export function keLabPresensi(lab: Laboratory): LabPresensi {
  return {
    id: lab.id,
    nama: lab.name,
    latitude: lab.location.latitude,
    longitude: lab.location.longitude,
    radiusMeter: lab.radiusMeters,
  };
}
