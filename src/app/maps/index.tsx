import { router, useLocalSearchParams } from 'expo-router';

import MapsScreen from '@/features/maps/map-screen';
import { pilihLaboratorium } from '@/features/maps/pemilihan-lab';
import type { Laboratory } from '@/features/maps/types/laboratory';

export default function MapsRoute() {
  const { mode } = useLocalSearchParams<{ mode?: string | string[] }>();
  const modePilih = (Array.isArray(mode) ? mode[0] : mode) === 'select';

  function pilihLab(lab: Laboratory) {
    pilihLaboratorium(lab);
    router.back();
  }

  return (
    <MapsScreen
      mode={modePilih ? 'select' : 'view'}
      onSelectLocation={modePilih ? pilihLab : undefined}
    />
  );
}
