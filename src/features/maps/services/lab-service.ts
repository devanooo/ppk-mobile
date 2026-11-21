import {
  collection,
  onSnapshot,
  GeoPoint,
  type DocumentData,
} from 'firebase/firestore';

import { db } from '../../../lib/firebase';

import {
  LaboratoryId,
  LaboratoryCode,
} from '../types/laboratory';

import type {
  Laboratory,
} from '../types/laboratory';

import { LABORATORY_COLLECTION } from '../constants/laboratory';

// ========================================
// VALIDATE LABORATORY DATA

function parseLaboratory(
  id: string,
  data: DocumentData,
): Laboratory | null {

  const validIds = Object.values(LaboratoryId);
  const validCodes = Object.values(LaboratoryCode);

  if (!validIds.includes(id as LaboratoryId)) {
    return null;
  }

  if (!validCodes.includes(data.code as LaboratoryCode)) {
    return null;
  }

  if (!(data.location instanceof GeoPoint)) {
    return null;
  }

  if (
    typeof data.name !== 'string' ||
    typeof data.building !== 'string' ||
    typeof data.radiusMeters !== 'number' ||
    typeof data.isActive !== 'boolean' ||
    typeof data.plusCode !== 'string' ||
    typeof data.pointType !== 'string' ||
    typeof data.roomCenterVerified !== 'boolean' ||
    !(typeof data.floor === 'number' || data.floor === null)
  ) {
    return null;
  }

  if (
    !Number.isFinite(data.radiusMeters) ||
    data.radiusMeters <= 0 ||
    data.location.latitude < -90 ||
    data.location.latitude > 90 ||
    data.location.longitude < -180 ||
    data.location.longitude > 180
  ) {
    return null;
  }

  return {
    id: id as LaboratoryId,
    code: data.code as LaboratoryCode,
    name: data.name,
    building: data.building,
    floor: data.floor,
    location: data.location,
    radiusMeters: data.radiusMeters,
    plusCode: data.plusCode,
    pointType: data.pointType,
    roomCenterVerified: data.roomCenterVerified,
    isActive: data.isActive,
  };
}

// ========================================
// REALTIME LABORATORY SUBSCRIPTION

export function subscribeLaboratories(
  onData: (laboratories: Laboratory[]) => void,
  onError?: (error: Error) => void,
) {
  const labsRef = collection(db, LABORATORY_COLLECTION);

    console.log('[Lab Service] Collection:', LABORATORY_COLLECTION);
    console.log('[Lab Service] Firebase DB:', db.app.options.projectId);

  return onSnapshot(
    labsRef,
    (snapshot) => {

    console.log(
      '[Lab Service] Total dokumen:',
      snapshot.size,
    );

      const laboratories = snapshot.docs
        .map((document) =>
          parseLaboratory(document.id, document.data()),
        )
        .filter(
          (lab): lab is Laboratory =>
            lab !== null && lab.isActive,
        );
    
    console.log(
      '[Lab Service] Laboratorium valid:',
      laboratories.length,
    );

      const order = Object.values(LaboratoryId);

      laboratories.sort(
        (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
      );

      onData(laboratories);
    },
    (error) => {
        console.error(
        '[Lab Service] Firestore error:',
        error,
        );

        console.error(
        '[Lab Service] Error code:',
        error.code,
        );

        console.error(
        '[Lab Service] Error message:',
        error.message,
        );

        onError?.(error);
    },
    );
}