import type { GeoPoint } from 'firebase/firestore';

export enum LaboratoryId {
  LAB_B = 'lab_b',
  LAB_C = 'lab_c',
  LAB_D = 'lab_d',
  LAB_AP = 'lab_ap',
}

export enum LaboratoryCode {
  LAB_B = 'LAB_B',
  LAB_C = 'LAB_C',
  LAB_D = 'LAB_D',
  LAB_AP = 'LAB_AP',
}

export interface Laboratory {
  id: LaboratoryId;
  code: LaboratoryCode;
  name: string;
  building: string;
  floor: number | null;
  location: GeoPoint;
  radiusMeters: number;
  plusCode: string;
  pointType: string;
  roomCenterVerified: boolean;
  isActive: boolean;
}