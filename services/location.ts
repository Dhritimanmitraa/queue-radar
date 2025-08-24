import * as Location from 'expo-location';
import Constants from 'expo-constants';

export async function getCurrentPositionAsync() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }
  return await Location.getCurrentPositionAsync({});
}

/**
 * Returns the best available position with graceful fallbacks so the app can render a map.
 * Order: precise current position → last known position → configured fallback center.
 */
export async function getBestEffortPositionAsync(fallback?: {
  latitude: number;
  longitude: number;
}) {
  console.log('🔍 getBestEffortPositionAsync: Starting location request...');
  console.log('📱 App ownership:', Constants.appOwnership);
  console.log('🏗️ Execution environment:', Constants.executionEnvironment);
  
  // Special handling for Expo Go which sometimes has issues with location
  const isExpoGo = Constants.appOwnership === 'expo';
  
  try {
    console.log('📋 Requesting location permissions...');
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('📋 Permission status:', status);
    
    if (status !== 'granted') {
      throw new Error(`Permission to access location was denied. Status: ${status}`);
    }

    console.log('📍 Getting current position...');
    
    // Use more aggressive settings for Expo Go
    const locationOptions = isExpoGo ? {
      accuracy: Location.Accuracy.Low, // Use lower accuracy for faster response in Expo Go
      maximumAge: 30_000, // Allow older cached location
      timeout: 8_000, // Shorter timeout for Expo Go
    } : {
      accuracy: Location.Accuracy.Balanced,
      maximumAge: 15_000,
      timeout: 10_000,
    };
    
    console.log('📍 Location options:', locationOptions);
    
    const current = await Location.getCurrentPositionAsync(locationOptions);
    console.log('✅ Current position obtained:', current.coords);
    return { coords: current.coords, source: 'current' as const };
  } catch (currentError: any) {
    console.log('⚠️ Current position failed, trying last known...', currentError.message);
    
    // Try last known cached location
    try {
      const last = await Location.getLastKnownPositionAsync();
      if (last?.coords) {
        console.log('✅ Last known position obtained:', last.coords);
        return { coords: last.coords, source: 'lastKnown' as const };
      } else {
        console.log('⚠️ No last known position available');
      }
    } catch (lastKnownError: any) {
      console.log('⚠️ Last known position failed:', lastKnownError.message);
    }

    // Fallback to provided default or a sensible global default (0,0 avoided)
    const fb = fallback ?? { latitude: 28.6139, longitude: 77.2090 }; // New Delhi downtown as a neutral default
    console.log('🎯 Using fallback location:', fb);
    
    return {
      coords: {
        latitude: fb.latitude,
        longitude: fb.longitude,
        accuracy: 5000,
        altitude: null as any,
        altitudeAccuracy: null as any,
        heading: null as any,
        speed: null as any,
      },
      source: 'fallback' as const,
    };
  }
}