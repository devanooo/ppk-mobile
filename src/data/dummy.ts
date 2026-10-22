import type { Presensi, Sesi, User } from '@/types';

export const users: User[] = [
  { id: 'mhs-1', nama: 'Ahmad', nomorInduk: '2410511001', peran: 'praktikan' },
  { id: 'mhs-2', nama: 'Citra', nomorInduk: '2410511002', peran: 'praktikan' },
  { id: 'mhs-3', nama: 'Eko', nomorInduk: '2410511003', peran: 'praktikan' },
  { id: 'mhs-4', nama: 'Fani', nomorInduk: '2410511004', peran: 'praktikan' },
  { id: 'asisten-1', nama: 'Budi', nomorInduk: '198504122010121001', peran: 'asisten' },
  { id: 'asisten-2', nama: 'Siti', nomorInduk: '199003212015042002', peran: 'asisten' },
];

// Semua sesi diampu asisten-1; asisten-2 sengaja kosong untuk menguji jadwal
// dan rekap kosong. mhs-4 juga tidak terdaftar di sesi mana pun.
export const sesi: Sesi[] = [
  {
    id: 'sesi-1',
    namaPraktikum: 'Dasar Pemrograman',
    kelas: 'A1',
    lab: 'Lab A',
    hari: 'Senin',
    tanggal: '2026-10-26',
    jamMulai: '13:00',
    jamSelesai: '15:00',
    asistenId: 'asisten-1',
    pesertaIds: ['mhs-1', 'mhs-2', 'mhs-3'],
    status: 'ditutup',
    dibukaPada: '2026-10-26T13:00:00',
    ditutupPada: '2026-10-26T15:00:00',
  },
  {
    id: 'sesi-2',
    namaPraktikum: 'Struktur Data',
    kelas: 'A2',
    lab: 'Lab B',
    hari: 'Selasa',
    tanggal: '2026-10-27',
    jamMulai: '08:00',
    jamSelesai: '10:00',
    asistenId: 'asisten-1',
    pesertaIds: ['mhs-1', 'mhs-2', 'mhs-3'],
    status: 'dibuka',
    dibukaPada: '2026-10-27T08:00:00',
  },
  {
    // Sengaja tanpa presensi: menguji rekap kosong pada sesi yang dibuka.
    id: 'sesi-3',
    namaPraktikum: 'Basis Data',
    kelas: 'E1',
    lab: 'Lab C',
    hari: 'Rabu',
    tanggal: '2026-10-28',
    jamMulai: '10:10',
    jamSelesai: '12:10',
    asistenId: 'asisten-1',
    pesertaIds: ['mhs-1', 'mhs-2', 'mhs-3'],
    status: 'dibuka',
    dibukaPada: '2026-10-28T10:10:00',
  },
  {
    id: 'sesi-4',
    namaPraktikum: 'Sistem Operasi',
    kelas: 'E2',
    lab: 'Lab D',
    hari: 'Kamis',
    tanggal: '2026-10-29',
    jamMulai: '15:40',
    jamSelesai: '17:40',
    asistenId: 'asisten-1',
    pesertaIds: ['mhs-1', 'mhs-2', 'mhs-3'],
    status: 'belum-dibuka',
  },
  {
    id: 'sesi-5',
    namaPraktikum: 'Jaringan Komputer',
    kelas: 'A1',
    lab: 'Lab AP',
    hari: 'Jumat',
    tanggal: '2026-10-30',
    jamMulai: '07:40',
    jamSelesai: '09:40',
    asistenId: 'asisten-1',
    pesertaIds: ['mhs-1', 'mhs-2', 'mhs-3'],
    status: 'belum-dibuka',
  },
];

export const presensi: Presensi[] = [
  { sesiId: 'sesi-1', praktikanId: 'mhs-1', waktu: '2026-10-26T13:04:00' },
  { sesiId: 'sesi-2', praktikanId: 'mhs-2', waktu: '2026-10-27T08:11:00' },
];
