import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Laboratory } from '../types/laboratory';

interface LaboratoryBottomSheetProps {
  laboratory: Laboratory;
  distance: number | null;
  mode: 'view' | 'select';
  onClose: () => void;
  onSelect?: (labId: string) => void;
}

export default function LaboratoryBottomSheet({
  laboratory,
  distance,
  mode,
  onClose,
  onSelect,
}: LaboratoryBottomSheetProps) {
  return (
    <View style={styles.container}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.title}>
            {laboratory.name}
          </Text>

          <Text style={styles.subtitle}>
            {laboratory.building}
            {laboratory.floor !== null
              ? ` · Lantai ${laboratory.floor}`
              : ''}
          </Text>
        </View>

        <Pressable onPress={onClose} hitSlop={12}>
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Radius laboratorium
        </Text>
        <Text style={styles.value}>
          {laboratory.radiusMeters} meter
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Jarak Anda
        </Text>
        <Text style={styles.value}>
          {distance !== null
            ? `${Math.round(distance)} meter`
            : 'Lokasi tidak tersedia'}
        </Text>
      </View>

      {mode === 'select' && (
        <Pressable
          style={styles.selectButton}
          onPress={() => onSelect?.(laboratory.id)}
        >
          <Text style={styles.selectText}>
            Pilih Lokasi Ini
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#192957',
  },
  subtitle: {
    marginTop: 5,
    fontSize: 12,
    color: '#64748B',
  },
  close: {
    fontSize: 28,
    color: '#64748B',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#192957',
  },
  selectButton: {
    marginTop: 16,
    backgroundColor: '#192957',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
