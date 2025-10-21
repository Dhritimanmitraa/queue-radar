import * as Location from 'expo-location';
import Constants from 'expo-constants';
export async function getCurrentPositionAsync() {
  const {
    status
  } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }
  return await Location.getCurrentPositionAsync({});
}
export async function getBestEffortPositionAsync(fallback?: {
  latitude: number;
  longitude: number;
}) {
  console.log('🔍 getBestEffortPositionAsync: Starting location request...');
  console.log('📱 App ownership:', Constants.appOwnership);
  console.log('🏗️ Execution environment:', Constants.executionEnvironment);
  const isExpoGo = Constants.appOwnership === 'expo';
  try {
    console.log('📋 Requesting location permissions...');
    const {
      status
    } = await Location.requestForegroundPermissionsAsync();
    console.log('📋 Permission status:', status);
    if (status !== 'granted') {
      throw new Error(`Permission to access location was denied. Status: ${status}`);
    }
    console.log('📍 Getting current position...');
    const locationOptions = isExpoGo ? {
      accuracy: Location.Accuracy.Low,
      maximumAge: 30_000,
      timeout: 8_000
    } : {
      accuracy: Location.Accuracy.Balanced,
      maximumAge: 15_000,
      timeout: 10_000
    };
    console.log('📍 Location options:', locationOptions);
    const current = await Location.getCurrentPositionAsync(locationOptions);
    console.log('✅ Current position obtained:', current.coords);
    return {
      coords: current.coords,
      source: 'current' as const
    };
  } catch (currentError: any) {
    console.log('⚠️ Current position failed, trying last known...', currentError.message);
    try {
      const last = await Location.getLastKnownPositionAsync();
      if (last?.coords) {
        console.log('✅ Last known position obtained:', last.coords);
        return {
          coords: last.coords,
          source: 'lastKnown' as const
        };
      } else {
        console.log('⚠️ No last known position available');
      }
    } catch (lastKnownError: any) {
      console.log('⚠️ Last known position failed:', lastKnownError.message);
    }
    const fb = fallback ?? {
      latitude: 28.6139,
      longitude: 77.2090
    };
    console.log('🎯 Using fallback location:', fb);
    return {
      coords: {
        latitude: fb.latitude,
        longitude: fb.longitude,
        accuracy: 5000,
        altitude: null as any,
        altitudeAccuracy: null as any,
        heading: null as any,
        speed: null as any
      },
      source: 'fallback' as const
    };
  }
}