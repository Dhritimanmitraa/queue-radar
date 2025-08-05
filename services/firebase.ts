import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration (queue-radar)
const firebaseConfig = {
  apiKey: 'REDACTED',
  authDomain: 'queue-radar.firebaseapp.com',
  projectId: 'queue-radar',
  storageBucket: 'queue-radar.firebasestorage.app',
  messagingSenderId: '662611543773',
  appId: '1:662611543773:web:4b5d838828de81cee17d34',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

export default app; 