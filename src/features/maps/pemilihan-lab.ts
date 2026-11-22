import { useSyncExternalStore } from 'react';

import type { SesiFirestore } from '@/lib/sesi';

import type { Laboratory } from './types/laboratory';

export type LabTerpilih = {
  id: string;
  nama: string;
  radiusMeters: number;
  latitude: number;
  longitude: number;
};

let pilihan: LabTerpilih | null = null;

const pendengar = new Set<() => void>();

function beritahu() {
  pendengar.forEach((fungsi) => fungsi());
}

export function dariLaboratorium(lab: Laboratory): LabTerpilih {
  return {
    id: lab.id,
    nama: lab.name,
    radiusMeters: lab.radiusMeters,
    latitude: lab.location.latitude,
    longitude: lab.location.longitude,
  };
}

export function labDariSesi(
  sesi: SesiFirestore | null | undefined,
): LabTerpilih | null {
  if (
    !sesi?.labId ||
    typeof sesi.labLatitude !== 'number' ||
    typeof sesi.labLongitude !== 'number' ||
    typeof sesi.labRadiusMeters !== 'number'
  ) {
    return null;
  }

  return {
    id: sesi.labId,
    nama: sesi.labNama ?? sesi.labId,
    radiusMeters: sesi.labRadiusMeters,
    latitude: sesi.labLatitude,
    longitude: sesi.labLongitude,
  };
}

export function pilihLaboratorium(lab: Laboratory) {
  pilihan = dariLaboratorium(lab);
  beritahu();
}

export function kosongkanPilihanLaboratorium() {
  if (pilihan === null) return;

  pilihan = null;
  beritahu();
}

export function ambilPilihanLaboratorium(): LabTerpilih | null {
  return pilihan;
}

export function usePilihanLaboratorium(): LabTerpilih | null {
  return useSyncExternalStore(
    (langganan) => {
      pendengar.add(langganan);

      return () => {
        pendengar.delete(langganan);
      };
    },
    ambilPilihanLaboratorium,
    ambilPilihanLaboratorium,
  );
}
