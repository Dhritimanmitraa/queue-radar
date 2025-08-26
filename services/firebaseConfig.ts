// Firebase project configuration (loaded from environment variables)
// Note: Use EXPO_PUBLIC_* so both native and web builds can access values
const env = process.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error('Missing required EXPO_PUBLIC_FIREBASE_* env vars. See SECURITY_SETUP.md.');
}

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
