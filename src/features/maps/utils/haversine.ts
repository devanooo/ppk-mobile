const EARTH_RADIUS_METERS = 6_371_000;

interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Mengubah derajat menjadi radian.
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Menghitung jarak antara dua koordinat
 * menggunakan formula Haversine.
 *
 * @returns Jarak dalam meter.
 */
export function calculateDistance(
  origin: Coordinate,
  destination: Coordinate,
): number {
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);

  const deltaLat = toRadians(
    destination.latitude - origin.latitude,
  );

  const deltaLon = toRadians(
    destination.longitude - origin.longitude,
  );

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    );

  return EARTH_RADIUS_METERS * c;
}

/**
 * Memeriksa apakah pengguna berada
 * dalam radius laboratorium.
 */
export function isWithinRadius(
  userLocation: Coordinate,
  labLocation: Coordinate,
  radiusMeters: number,
): boolean {
  if (!Number.isFinite(radiusMeters) || radiusMeters <= 0) {
    return false;
  }

  const distance = calculateDistance(
    userLocation,
    labLocation,
  );

  return distance <= radiusMeters;
}
