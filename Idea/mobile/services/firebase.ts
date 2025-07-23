import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase project configuration (queue-radar)
// measurementId isn’t needed for the mobile app
const firebaseConfig = {
  apiKey: 'AIzaSyAG3gKIl9hnvFIBB-TOqhXrl5_l90xu9Co',
  authDomain: 'queue-radar.firebaseapp.com',
  projectId: 'queue-radar',
  storageBucket: 'queue-radar.firebasestorage.app', // verify in Firebase Console
  messagingSenderId: '662611543773',
  appId: '1:662611543773:web:4b5d838828de81cee17d34',
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