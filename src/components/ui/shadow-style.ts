import { Shadow } from '@/constants/theme';

/**
 * Satu-satunya bayangan proyek: dropdown profil dan bottom sheet (design.md
 * baris 591). React Native tidak membaca bayangan lewat className, jadi nilai
 * token dipasang sebagai style, bukan ditulis ulang di komponen.
 */
export const gayaBayangan = {
  shadowColor: Shadow.color,
  shadowOffset: { width: Shadow.offsetX, height: Shadow.offsetY },
  shadowOpacity: Shadow.opacity,
  shadowRadius: Shadow.radius,
  elevation: Shadow.elevation,
};
