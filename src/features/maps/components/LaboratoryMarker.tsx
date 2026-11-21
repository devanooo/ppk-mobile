import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Marker } from 'react-native-maps';

import { LABORATORY_OPTIONS } from '../constants/laboratory';
import type { Laboratory } from '../types/laboratory';

interface LaboratoryMarkerProps {
  laboratory: Laboratory;
  selected: boolean;
  onPress: (laboratory: Laboratory) => void;
}

export default function LaboratoryMarker({
  laboratory,
  selected,
  onPress,
}: LaboratoryMarkerProps) {
  // Pakai label dari LABORATORY_OPTIONS supaya konsisten dengan picker sheet
  const label =
    LABORATORY_OPTIONS.find((opt) => opt.id === laboratory.id)?.label ??
    laboratory.code.replace('LAB_', 'Lab ');

  return (
    <Marker
      coordinate={{
        latitude: laboratory.location.latitude,
        longitude: laboratory.location.longitude,
      }}
      onPress={() => onPress(laboratory)}
      zIndex={selected ? 1000 : 1}
      tracksViewChanges={false}
    >
      <Pressable
        style={[styles.marker, selected && styles.selected]}
      >
        <Text style={[styles.markerText, selected && styles.selectedText]}>
          {label}
        </Text>
      </Pressable>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7D5E8',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 4,
  },
  selected: {
    backgroundColor: '#192957',
    borderColor: '#192957',
  },
  markerText: {
    color: '#192957',
    fontWeight: '600',
    fontSize: 12,
  },
  selectedText: {
    color: '#FFFFFF',
  },
});