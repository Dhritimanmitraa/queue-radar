// Firebase project configuration (loaded from environment variables)
// Note: Use EXPO_PUBLIC_* so both native and web builds can access values
const env = process.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBfbClt42ZDhAfa4hlBIU1xj1z8J6cCFY8',
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'queue-radar.firebaseapp.com',
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'queue-radar',
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'queue-radar.firebasestorage.app',
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '662611543773',
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:662611543773:web:4b5d838828de81cee17d34',
};

// Optional runtime validation in dev to catch misconfiguration early
if (__DEV__) {
  console.log('🔧 Firebase Config Debug:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 20)}...` : 'MISSING',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    envVars: {
      EXPO_PUBLIC_FIREBASE_API_KEY: env.EXPO_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING',
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
    }
  });
  
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `Missing Firebase config env vars for: ${missing.join(', ')}. ` +
        'Set EXPO_PUBLIC_FIREBASE_* environment variables to initialize Firebase.'
    );
  }
}
