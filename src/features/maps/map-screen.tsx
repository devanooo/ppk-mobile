
import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MapView, {
  Circle,
  PROVIDER_GOOGLE,
  type Region,
} from 'react-native-maps';

// Custom hooks
import { useLaboratories } from './hooks/useLaboratories';
import { useLocation } from './hooks/useLocation';

// Components
import LaboratoryMarker from './components/LaboratoryMarker';
import UserLocationMarker from './components/UserLocationMarker';
import MapControls from './components/MapControls';
import LaboratoryBottomSheet from './components/LaboratoryBottomSheet';

// Utilities
import { calculateDistance } from './utils/haversine';

// Types
import type { Laboratory } from './types/laboratory';

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
  // Map reference
  const mapRef = useRef<MapView>(null);

  // Mencegah kamera terus mengikuti GPS
  // setiap kali koordinat diperbarui.
  const hasCenteredOnUser = useRef(false);

  // Selected laboratory
  const [selectedLabId, setSelectedLabId] =
    useState<Laboratory['id'] | null>(null);

  // Firestore laboratory data
  const {
    laboratories,
    loading: labsLoading,
    error: labsError,
  } = useLaboratories();

  // Device location
  const {
    location,
    loading: locationLoading,
    status: locationStatus,
    error: locationError,
    retry,
  } = useLocation();

  // Find selected laboratory from latest Firestore data
  const selectedLab =
    laboratories.find((lab) => lab.id === selectedLabId) ?? null;

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
  // CENTER USER LOCATION BUTTON

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

  // ========================================
  // CALCULATE DISTANCE TO SELECTED LAB

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

  // ========================================
  // HANDLE LABORATORY SELECTION

  const handleSelectLab = (lab: Laboratory) => {
    setSelectedLabId(lab.id);

    mapRef.current?.animateToRegion(
      {
        latitude: lab.location.latitude,
        longitude: lab.location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      },
      500,
    );
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
        toolbarEnabled={false}
        loadingEnabled
        mapPadding={{
          top: 120,
          right: 16,
          bottom: selectedLab ? 330 : 100,
          left: 16,
        }}
      >

        {/* LABORATORY MARKERS */}

        {laboratories.map((lab) => (
        <LaboratoryMarker
            key={lab.id}
            laboratory={lab}
            selected={selectedLabId === lab.id}
            onPress={handleSelectLab}
        />
        ))}

        {/* SELECTED LAB RADIUS */}

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

        {/* USER LOCATION */}

        {location && (
          <UserLocationMarker
            latitude={location.latitude}
            longitude={location.longitude}
            accuracy={location.accuracy}
          />
        )}

      </MapView>

      {/* ==================================
          CUSTOM HEADER
      ================================== */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Peta Laboratorium
        </Text>

        <Text style={styles.headerSubtitle}>
          Lihat lokasi dan aktivitas laboratorium.
        </Text>
      </View>

      {/* ==================================
          MAP CONTROLS
      ================================== */}

      <View style={styles.controls}>
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

              <Text
                style={styles.retryText}
                onPress={retry}
              >
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
        </View>
      )}

      {/* ==================================
          SELECTED LAB BOTTOM SHEET
      ================================== */}

      {selectedLab && (
        <LaboratoryBottomSheet
          laboratory={selectedLab}
          distance={distance}
          mode={mode}
          onClose={() => setSelectedLabId(null)}
          onSelect={onSelectLocation}
        />
      )}

      {/* ==================================
          LABORATORY COUNT
      ================================== */}

      {!selectedLab && !labsLoading && (
        <View style={styles.labCount}>
          <Text style={styles.labCountText}>
            {laboratories.length} Laboratorium
          </Text>
        </View>
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

  header: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#192957',
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },

  controls: {
    position: 'absolute',
    right: 18,
    bottom: 190,
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

  labCount: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },

  labCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#192957',
  },

  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    },  
});
