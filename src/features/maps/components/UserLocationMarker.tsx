
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Circle, Marker } from 'react-native-maps';

interface UserLocationMarkerProps {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export default function UserLocationMarker({
  latitude,
  longitude,
  accuracy,
}: UserLocationMarkerProps) {
  const coordinate = { latitude, longitude };

  return (
    <>
      {accuracy !== null && (
        <Circle
          center={coordinate}
          radius={Math.max(accuracy, 1)}
          strokeColor="rgba(37,99,235,0.35)"
          fillColor="rgba(37,99,235,0.13)"
          strokeWidth={1}
        />
      )}

      <Marker
        coordinate={coordinate}
        anchor={{ x: 0.5, y: 0.5 }}
        zIndex={100}
        tracksViewChanges={false}
      >
        <View style={styles.outer}>
          <View style={styles.inner} />
        </View>
      </Marker>
    </>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(37,99,235,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
