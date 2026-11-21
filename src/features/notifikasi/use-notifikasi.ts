import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { db } from '@/lib/firebase';
import {
  ambilTokenPerangkat,
  hapusTokenPerangkat,
  mintaIzinNotifikasi,
  simpanTokenPerangkat,
} from '@/lib/notifikasi';

/**
 * Mendaftarkan token Expo Push saat pengguna masuk, dan menghapusnya saat
 * keluar. Izin hanya diminta sekali per sesi login.
 */
export function useNotifikasi(userId: string | null): void {
  const tokenAktif = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' || !userId) return;

    const uid = userId;
    let dibatalkan = false;

    async function daftarkan() {
      const diizinkan = await mintaIzinNotifikasi();
      if (!diizinkan || dibatalkan) return;

      const token = await ambilTokenPerangkat();
      if (!token || dibatalkan) return;

      const tersimpan = await simpanTokenPerangkat(db, uid, token);
      if (tersimpan) tokenAktif.current = token.token;
    }

    void daftarkan();

    return () => {
      dibatalkan = true;
    };
  }, [userId]);

  useEffect(() => {
    if (Platform.OS === 'web' || userId) return;

    const token = tokenAktif.current;
    if (!token) return;

    tokenAktif.current = null;
    void hapusTokenPerangkat(db, token);
  }, [userId]);
}
