
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

interface MapControlsProps {
  onMyLocationPress: () => void;
  disabled?: boolean;
}

export default function MapControls({
  onMyLocationPress,
  disabled = false,
}: MapControlsProps) {
  return (
    <Pressable
      style={[
        styles.button,
        disabled && styles.disabled,
      ]}
      onPress={onMyLocationPress}
      disabled={disabled}
      accessibilityLabel="Kembali ke lokasi saya"
    >
      <Text style={styles.icon}>◎</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    color: '#192957',
    fontSize: 28,
  },
});
