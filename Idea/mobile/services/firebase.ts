import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// Get this from: Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'queue-radar-demo.firebaseapp.com',
  projectId: 'queue-radar-demo',
  storageBucket: 'queue-radar-demo.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef123456789012345678',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// For demo purposes - connects to Firebase emulators if available
if (__DEV__ && typeof window !== 'undefined') {
  // Only connect to emulators in development and on web
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // Emulators not running - will use live Firebase
    console.log('Firebase emulators not available, using live Firebase');
  }
}

export default app; 