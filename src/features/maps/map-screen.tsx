import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import MapView, {
  Circle,
  PROVIDER_GOOGLE,
  type Region,
} from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui';
import { db } from '@/lib/firebase';
import { useSession } from '@/store/session-store';

// Custom hooks
import { useLaboratories } from './hooks/useLaboratories';
import { useLocation } from './hooks/useLocation';
import { useAktivitasLaboratorium } from './hooks/useAktivitasLaboratorium';

// Components
import LaboratoryMarker from './components/LaboratoryMarker';
import UserLocationMarker from './components/UserLocationMarker';
import MapControls from './components/MapControls';
import LaboratoryBottomSheet from './components/LaboratoryBottomSheet';
import LaboratoryPickerSheet from './components/LaboratoryPickerSheet';

// Constants
import { LABORATORY_OPTIONS } from './constants/laboratory';

// Utilities
import { calculateDistance } from './utils/haversine';

// Types
import type {
  Laboratory,
  LaboratoryId,
} from './types/laboratory';

// ========================================
// INITIAL MAP REGION

const INITIAL_REGION: Region = {
  latitude: -7.0482375,
  longitude: 110.440765625,
  latitudeDelta: 0.004,
  longitudeDelta: 0.004,
};

// ========================================
// SCREEN PROPS

interface MapsScreenProps {
  mode?: 'view' | 'select';
  onSelectLocation?: (labId: string) => void;
}

// ========================================
// MAPS SCREEN

export default function MapsScreen({
  mode = 'view',
  onSelectLocation,
}: MapsScreenProps) {
  const mapRef = useRef<MapView>(null);

  const insets = useSafeAreaInsets();
  const headerTop = insets.top + 12;
  const backTop = headerTop;

  const hasCenteredOnUser = useRef(false);

  const [selectedLabId, setSelectedLabId] =
    useState<Laboratory['id'] | null>(null);

  const [pesanPilihLab, setPesanPilihLab] =
    useState<string>();

  const { user } = useSession();

  const {
    laboratories,
    loading: labsLoading,
    error: labsError,
    retry: retryLabs,
  } = useLaboratories();

  const {
    saatIni,
    berikutnya,
    status: statusAktivitas,
    pesanGalat: pesanGalatAktivitas,
    retry: retryAktivitas,
  } = useAktivitasLaboratorium({
    db,
    userId: user?.id,
    peran: user?.peran,
    labId: selectedLabId,
  });

  const {
    location,
    loading: locationLoading,
    error: locationError,
    retry,
  } = useLocation();

  const selectedLab =
    laboratories.find((lab) => lab.id === selectedLabId) ?? null;

  const selectedLabLabel =
    LABORATORY_OPTIONS.find(
      (option) => option.id === selectedLabId,
    )?.label ?? 'laboratorium ini';

  // ========================================
  // CENTER MAP ON USER LOCATION

  useEffect(() => {
    if (!location || hasCenteredOnUser.current) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      700,
    );

    hasCenteredOnUser.current = true;
  }, [location]);

  // ========================================
  // HANDLERS

  const handleBack = () => {
    router.back();
  };

  const handleCenterUser = () => {
    if (!location) {
      retry();
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      700,
    );
  };

  const distance =
    selectedLab && location
      ? calculateDistance(
          {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          {
            latitude: selectedLab.location.latitude,
            longitude: selectedLab.location.longitude,
          },
        )
      : null;

  const handleSelectLab = (lab: Laboratory) => {
    setPesanPilihLab(undefined);
    setSelectedLabId(lab.id);

    // Delay kecil supaya state update selesai dulu sebelum animasi
    setTimeout(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: lab.location.latitude,
          longitude: lab.location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        600,
      );
    }, 50);
  };

  const handleSelectLabById = (labId: LaboratoryId) => {
    const lab = laboratories.find((item) => item.id === labId);
    const label =
      LABORATORY_OPTIONS.find((option) => option.id === labId)
        ?.label ?? 'Laboratorium';

    if (!lab) {
      setPesanPilihLab(
        `Data lokasi ${label} belum tersedia.`,
      );
      return;
    }

    handleSelectLab(lab);
  };

  // ========================================
  // RENDER

  return (
    <View style={styles.container}>

      {/* ==================================
          GOOGLE MAPS
      ================================== */}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsCompass
        showsScale
        showsUserLocation
        showsMyLocationButton
        toolbarEnabled={false}
        loadingEnabled
        mapPadding={{
          top: headerTop + 70,
          right: 16,
          bottom: selectedLab ? 380 : 250,
          left: 16,
        }}
      >

        {laboratories.map((lab) => (
          <LaboratoryMarker
            key={lab.id}
            laboratory={lab}
            selected={selectedLabId === lab.id}
            onPress={handleSelectLab}
          />
        ))}

        {selectedLab && (
          <Circle
            center={{
              latitude: selectedLab.location.latitude,
              longitude: selectedLab.location.longitude,
            }}
            radius={selectedLab.radiusMeters}
            strokeColor="rgba(25,41,87,0.8)"
            fillColor="rgba(25,41,87,0.12)"
            strokeWidth={2}
          />
        )}

        {/* UserLocationMarker diganti showsUserLocation di MapView (titik biru native) */}

      </MapView>

      {/* ==================================
          BACK BUTTON + HEADER (sejajar)
      ================================== */}

      <View style={[styles.topBar, { top: headerTop }]}>
        <Pressable
          accessibilityLabel="Kembali"
          accessibilityRole="button"
          hitSlop={8}
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <View style={styles.backIconWrap}>
            <SymbolView
              name={{
                ios: 'chevron.left',
                android: 'arrow_back',
                web: 'arrow_back',
              }}
              size={20}
              tintColor="#192957"
            />
          </View>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Peta Laboratorium</Text>
          <Text style={styles.headerSubtitle}>
            Lihat lokasi dan aktivitas laboratorium.
          </Text>
        </View>
      </View>

      {/* ==================================
          MAP CONTROLS
      ================================== */}

      <View
        style={[
          styles.controls,
          !selectedLab && styles.controlsWithPicker,
        ]}
      >
        <MapControls
          onMyLocationPress={handleCenterUser}
          disabled={!location}
        />
      </View>

      {/* ==================================
          GPS STATUS
      ================================== */}

      {!location && (
        <View style={styles.statusCard}>
          {locationLoading ? (
            <>
              <ActivityIndicator color="#192957" />
              <Text style={styles.statusText}>
                Mencari lokasi Anda...
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.statusText}>
                {locationError ?? 'Lokasi belum tersedia'}
              </Text>
              <Text style={styles.retryText} onPress={retry}>
                Coba Lagi
              </Text>
            </>
          )}
        </View>
      )}

      {/* ==================================
          FIRESTORE STATUS
      ================================== */}

      {labsLoading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#192957" />
          <Text style={styles.statusText}>
            Memuat laboratorium...
          </Text>
        </View>
      )}

      {labsError && (
        <View style={styles.errorCard}>
          <Text style={styles.statusText}>
            Gagal memuat data laboratorium.
          </Text>
          <AppButton
            className="mt-two"
            label="Coba Lagi"
            onPress={retryLabs}
            size="sm"
            variant="secondary"
          />
        </View>
      )}

      {/* ==================================
          SELECTED LAB BOTTOM SHEET
      ================================== */}

      {selectedLab && (
        <LaboratoryBottomSheet
          laboratory={{ ...selectedLab, name: selectedLabLabel }}
          distance={distance}
          mode={mode}
          aktivitas={{ saatIni, berikutnya }}
          statusAktivitas={statusAktivitas}
          pesanGalatAktivitas={pesanGalatAktivitas}
          labelLab={selectedLabLabel}
          onRetryAktivitas={retryAktivitas}
          onClose={() => setSelectedLabId(null)}
          onSelect={onSelectLocation}
        />
      )}

      {/* ==================================
          LABORATORY PICKER
      ================================== */}

      {!selectedLab && !labsLoading && !labsError && (
        <LaboratoryPickerSheet
          selectedLabId={selectedLabId}
          pesan={pesanPilihLab}
          onSelect={handleSelectLabById}
        />
      )}

    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  topBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 100,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonPressed: {
    opacity: 0.75,
  },

  backIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#192957',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  header: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#192957',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#192957',
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: '#64748B',
  },

  controls: {
    position: 'absolute',
    right: 18,
    bottom: 190,
  },

  controlsWithPicker: {
    bottom: 250,
  },

  statusCard: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
  },

  loadingCard: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
  },

  errorCard: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },

  statusText: {
    fontSize: 12,
    color: '#475569',
    flexShrink: 1,
  },

  retryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});