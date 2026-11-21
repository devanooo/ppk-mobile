import {
  LaboratoryId,
  LaboratoryCode,
} from '../types/laboratory';

export enum LaboratoryFilter {
  ALL = 'all',
}

export const LABORATORY_OPTIONS = [
  {
    id: LaboratoryId.LAB_B,
    code: LaboratoryCode.LAB_B,
    label: 'Lab B',
  },
  {
    id: LaboratoryId.LAB_C,
    code: LaboratoryCode.LAB_C,
    label: 'Lab C',
  },
  {
    id: LaboratoryId.LAB_D,
    code: LaboratoryCode.LAB_D,
    label: 'Lab D',
  },
  {
    id: LaboratoryId.LAB_AP,
    code: LaboratoryCode.LAB_AP,
    label: 'Lab AP',
  },
] as const;

export const LABORATORY_COLLECTION = 'labs';