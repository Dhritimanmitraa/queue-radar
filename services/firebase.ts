import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
console.log('🔥 Initializing Firebase app...');
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');
console.log('🔐 Initializing Firebase auth...');
let auth;
try {
  let rnPersistenceFactory: any;
  try {
    rnPersistenceFactory = require('firebase/auth/react-native').getReactNativePersistence;
  } catch {}
  if (rnPersistenceFactory) {
    auth = initializeAuth(app, {
      persistence: rnPersistenceFactory(ReactNativeAsyncStorage)
    });
  } else {
    auth = initializeAuth(app);
  }
  console.log('✅ Firebase auth initialized');
} catch (error: any) {
  if (error?.code === 'auth/already-initialized') {
    console.log('ℹ️ Firebase auth already initialized, using existing instance');
    auth = getAuth(app);
  } else {
    console.error('❌ Firebase auth initialization error:', error);
    throw error;
  }
}
export { auth };
console.log('🗄️ Initializing Firestore...');
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});
import { connectFirestoreEmulator, enableNetwork } from 'firebase/firestore';
enableNetwork(db).then(() => console.log('✅ Firestore network enabled')).catch(error => console.log('⚠️ Firestore network enable failed:', error.message));
console.log('✅ Firestore initialized');