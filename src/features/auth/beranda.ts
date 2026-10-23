import type { Href } from 'expo-router';

import type { Peran } from '@/types';

export function berandaUntuk(peran: Peran): Href {
  return (peran === 'asisten' ? '/(asisten)/jadwal' : '/(praktikan)/jadwal') as Href;
}
