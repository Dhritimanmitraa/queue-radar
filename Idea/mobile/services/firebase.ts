import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration (queue-radar)
const firebaseConfig = {
  apiKey: 'AIzaSyAG3gKIl9hnvFIBB-TOqhXrl5_l90xu9Co',
  authDomain: 'queue-radar.firebaseapp.com',
  projectId: 'queue-radar',
  storageBucket: 'queue-radar.firebasestorage.app',
  messagingSenderId: '662611543773',
  appId: '1:662611543773:web:4b5d838828de81cee17d34',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 