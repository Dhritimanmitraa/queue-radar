const env = process.env as Record<string, string | undefined>;
export const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID
};
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  if (__DEV__) {
    console.warn('Missing EXPO_PUBLIC_FIREBASE_* env vars. Using placeholders in development.');
    firebaseConfig.apiKey = firebaseConfig.apiKey || 'dev-placeholder-api-key';
    firebaseConfig.projectId = firebaseConfig.projectId || 'dev-placeholder-project';
    firebaseConfig.appId = firebaseConfig.appId || '1:000000000000:web:devplaceholder';
    firebaseConfig.authDomain = firebaseConfig.authDomain || 'localhost';
    firebaseConfig.storageBucket = firebaseConfig.storageBucket || 'dev-placeholder.appspot.com';
    firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || '000000000000';
  } else {
    throw new Error('Missing required EXPO_PUBLIC_FIREBASE_* env vars. See SECURITY_SETUP.md.');
  }
}
if (__DEV__) {
  console.log('🔧 Firebase Config Debug:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 20)}...` : 'MISSING',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    envVars: {
      EXPO_PUBLIC_FIREBASE_API_KEY: env.EXPO_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING',
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING'
    }
  });
  const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.warn(`Missing Firebase config env vars for: ${missing.join(', ')}. ` + 'Set EXPO_PUBLIC_FIREBASE_* environment variables to initialize Firebase.');
  }
}