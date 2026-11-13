
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';

import {
  getAuth,
  initializeAuth,
  type Auth,
} from 'firebase/auth';

import {
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

// ========================================
// FIREBASE CONFIGURATION

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// ========================================
// VALIDATE CONFIGURATION

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId
) {
  throw new Error('Konfigurasi Firebase belum lengkap.');
}

// ========================================
// FIREBASE APP

export const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// ========================================
// FIREBASE AUTHENTICATION

function inisialisasiAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  // Android dan iOS menggunakan AsyncStorage.
  // Firebase RN runtime menyediakan getReactNativePersistence.
  const getReactNativePersistence = (
    require('firebase/auth') as typeof import('firebase/auth') & {
      getReactNativePersistence: (
        storage: typeof AsyncStorage,
      ) => import('firebase/auth').Persistence;
    }
  ).getReactNativePersistence;

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'auth/already-initialized'
    ) {
      return getAuth(app);
    }

    throw error;
  }
}

export const auth = inisialisasiAuth();

// ========================================
// CLOUD FIRESTORE

export const db: Firestore = getFirestore(app);
