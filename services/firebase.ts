import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

console.log('🔥 Initializing Firebase app...');
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');

console.log('🔐 Initializing Firebase auth...');
let auth;
try {
  // Try to initialize auth with React Native persistence if available
  try {
    const { getReactNativePersistence } = require('firebase/auth/react-native');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    // Fallback for web or if React Native persistence is not available
    auth = initializeAuth(app);
  }
  console.log('✅ Firebase auth initialized');
} catch (error: any) {
  if (error.code === 'auth/already-initialized') {
    console.log('ℹ️ Firebase auth already initialized, using existing instance');
    auth = getAuth(app);
  } else {
    console.error('❌ Firebase auth initialization error:', error);
    throw error;
  }
}
export { auth };

console.log('🗄️ Initializing Firestore...');
export const db = getFirestore(app);

// Configure Firestore settings for better connectivity
import { connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';

// Only in development, you might want to connect to Firestore emulator
// Uncomment the next lines if you're using Firestore emulator locally
// if (__DEV__ && !db._delegate._databaseId.projectId.includes('firebaseapp.com')) {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     console.log('🔧 Connected to Firestore emulator');
//   } catch (error) {
//     console.log('ℹ️ Firestore emulator already connected or not available');
//   }
// }

// Enable network (helpful for offline/online scenarios)
enableNetwork(db)
  .then(() => console.log('✅ Firestore network enabled'))
  .catch((error) => console.log('⚠️ Firestore network enable failed:', error.message));

console.log('✅ Firestore initialized');
 