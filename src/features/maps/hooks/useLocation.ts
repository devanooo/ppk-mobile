
import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { LocationObjectCoords } from 'expo-location';

// ========================================
// TYPES
export type LocationStatus =
  | 'idle'
  | 'requesting-permission'
  | 'permission-denied'
  | 'gps-disabled'
  | 'locating'
  | 'tracking'
  | 'error';

interface UseLocationReturn {
  location: LocationObjectCoords | null;
  loading: boolean;
  status: LocationStatus;
  error: string | null;
  permissionGranted: boolean;
  retry: () => void;
}

// ========================================
// CUSTOM HOOK

export function useLocation(): UseLocationReturn {
  const [location, setLocation] =
    useState<LocationObjectCoords | null>(null);
  const [status, setStatus] =
    useState<LocationStatus>('idle');
  const [error, setError] =
    useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] =
    useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retry = useCallback(() => {
    setLocation(null);
    setError(null);
    setPermissionGranted(false);
    setStatus('idle');
    setRetryCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let subscription: Location.LocationSubscription | null = null;

    async function startLocationTracking() {
      try {
        setStatus('requesting-permission');
        setError(null);
        // 1. Periksa dan minta izin lokasi
        const currentPermission =
          await Location.getForegroundPermissionsAsync();
        let permission = currentPermission;
        if (permission.status !== 'granted') {
          permission =
            await Location.requestForegroundPermissionsAsync();
        }

        if (!isMounted) return;

        if (permission.status !== 'granted') {
          setPermissionGranted(false);
          setStatus('permission-denied');
          setError(
            'Izin lokasi diperlukan untuk menampilkan posisi Anda.',
          );
          return;
        }

        setPermissionGranted(true);

        // 2. Periksa layanan lokasi perangkat
        const providerStatus =
          await Location.getProviderStatusAsync();

        if (!isMounted) return;

        if (!providerStatus.locationServicesEnabled) {
          setStatus('gps-disabled');
          setError(
            'Layanan lokasi perangkat belum aktif. Aktifkan GPS untuk melanjutkan.',
          );
          return;
        }

        // 3. Ambil lokasi awal
        setStatus('locating');

        const initialLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        if (!isMounted) return;

        setLocation(initialLocation.coords);
        setStatus('tracking');

        // 4. Pantau perubahan lokasi pengguna
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
          },
          (newLocation) => {
            if (!isMounted) return;

            setLocation(newLocation.coords);
            setStatus('tracking');
            setError(null);
          },
        );

      } catch (err) {
        if (!isMounted) return;

        console.error('[useLocation] Error:', err);

        setStatus('error');
        setError(
          'Lokasi tidak dapat diperoleh. Periksa GPS dan koneksi perangkat Anda.',
        );
      }
    }

    startLocationTracking();

    // 5. Cleanup subscription
    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [retryCount]);

  const loading =
    status === 'requesting-permission' ||
    status === 'locating';

  return {
    location,
    loading,
    status,
    error,
    permissionGranted,
    retry,
  };
}
