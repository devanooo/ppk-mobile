import type { SesiPraktikan } from '@/lib/izin-sesi';

const LABEL: Record<SesiPraktikan['status'], string> = {
  'belum-dibuka': 'Belum dibuka',
  dibuka: 'Dibuka',
  ditutup: 'Ditutup',
};

export function labelStatusSesi(status: SesiPraktikan['status']): string {
  return LABEL[status] ?? 'Status tidak dikenal';
}
