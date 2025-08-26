import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getBestEffortPositionAsync } from '../services/location';
import SalonMarker from '../components/SalonMarker.native';
import PlaceMarker from '../components/PlaceMarker.native';
import { fetchNearbySalons, type NearbySalonPlace } from '../services/places';

export default function CustomerHome() {
  const [salons, setSalons] = useState<any[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbySalonPlace[]>([]);
  const [region, setRegion] = useState<any>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const searchRadiusMeters = 4000;
  const enableMap = Platform.OS !== 'android' || !!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    (async () => {
      console.log('🚀 CustomerHome: Starting location and places fetch...');
      
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.log('⏰ Location timeout - using fallback');
        if (!region) {
          // Use a default location if we can't get user location
          setRegion({
            latitude: 28.6139, // New Delhi
            longitude: 77.2090,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setError('Could not get your location. Showing default area. Please enable location services and restart the app.');
        }
        setIsLoading(false);
      }, 15000); // 15 second timeout
      
      try {
        console.log('📍 Getting location...');
        const { coords, source } = await getBestEffortPositionAsync();
        console.log('✅ Location obtained:', {
          lat: coords.latitude,
          lng: coords.longitude,
          source,
          accuracy: coords.accuracy
        });
        
        clearTimeout(timeoutId);
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setIsLoading(false);
        
        // Set a timer to show fallback view if map doesn't load
        setTimeout(() => {
          if (!showFallback) {
            console.log('⏰ Map timeout - showing fallback view');
            setShowFallback(true);
          }
        }, 5000); // Show fallback after 5 seconds
        
        // Fire Google Places fetch in parallel
        try {
          console.log('🔍 Fetching nearby salons...');
          const places = await fetchNearbySalons(
            coords.latitude,
            coords.longitude,
            searchRadiusMeters
          );
          console.log('✅ Found places:', places.length);
          setNearbyPlaces(places);
        } catch (e: any) {
          console.error('❌ Places fetch error:', e);
          setError(`Places error: ${e?.message ?? 'Failed fetching nearby salons'}`);
        }
      } catch (e: any) {
        console.error('❌ Location error:', e);
        clearTimeout(timeoutId);
        const errorMsg = e?.message || e?.toString() || 'Unknown location error';
        setError(`Location error: ${errorMsg}`);
        
        // Use fallback location on error
        setRegion({
          latitude: 28.6139, // New Delhi
          longitude: 77.2090,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setIsLoading(false);
      }
    })();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const filteredSalons = useMemo(() => {
    if (!region || !salons?.length) return [];
    const centerLat = region.latitude;
    const centerLng = region.longitude;
    return salons.filter((s) => {
      const lat = s.location?.latitude ?? s.location?.lat;
      const lng = s.location?.longitude ?? s.location?.lng;
      if (typeof lat !== 'number' || typeof lng !== 'number') return false;
      const dKm = haversineKm(centerLat, centerLng, lat, lng);
      return dKm * 1000 <= searchRadiusMeters;
    });
  }, [region, salons]);

  useEffect(() => {
    console.log('🔥 Setting up Firebase listener for salons...');
    const q = query(collection(db, 'salons'));
    const unsub = onSnapshot(
      q, 
      (snap) => {
        const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log('✅ Firebase salons loaded:', results.length);
        setSalons(results);
      },
      (error) => {
        console.error('❌ Firebase error:', error);
        setError(`Firebase error: ${error.message}`);
      }
    );
    return () => unsub();
  }, []);

  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={{ marginTop: 16, textAlign: 'center', paddingHorizontal: 20 }}>
          Getting your location...
        </Text>
        {error ? (
          <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
            <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
          </View>
        ) : null}
        <Text style={{ marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center', paddingHorizontal: 20 }}>
          Make sure location services are enabled and you've granted permission to Expo Go
        </Text>
      </View>
    );
  }

  // Fallback view if map fails to render
  const renderFallbackView = () => (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackTitle}>📍 Your Location</Text>
      <Text style={styles.locationText}>
        Lat: {region.latitude.toFixed(6)}, Lng: {region.longitude.toFixed(6)}
      </Text>
      
      <Text style={styles.fallbackTitle}>🏪 Nearby Salons ({nearbyPlaces.length})</Text>
      {nearbyPlaces.slice(0, 5).map((place, index) => (
        <View key={place.place_id} style={styles.placeItem}>
          <Text style={styles.placeName}>{place.name}</Text>
          {place.vicinity && <Text style={styles.placeAddress}>{place.vicinity}</Text>}
          {place.rating && <Text style={styles.placeRating}>⭐ {place.rating}</Text>}
        </View>
      ))}
      
      <Text style={styles.fallbackNote}>
        📱 Map view may not work in Expo Go. Use a development build for full map functionality.
      </Text>
    </View>
  );

  return (
    <>
      {enableMap ? (
        <MapView
          style={StyleSheet.absoluteFill}
          region={region}
          showsUserLocation
          showsMyLocationButton={true}
          showsPointsOfInterest={true}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={false}
          showsIndoors={true}
          loadingEnabled={true}
          mapType="standard"
          toolbarEnabled={true}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          onMapReady={() => {
            console.log('📍 Map ready');
            setShowFallback(false);
          }}
        >
          <Circle
            center={{ latitude: region.latitude, longitude: region.longitude }}
            radius={searchRadiusMeters}
            strokeColor="rgba(10,132,255,0.6)"
            fillColor="rgba(10,132,255,0.1)"
          />
          {filteredSalons.map((salon) => (
            <SalonMarker key={salon.id} salon={salon} />
          ))}
          {nearbyPlaces.map((p) => (
            <PlaceMarker key={p.place_id} place={p} />
          ))}
        </MapView>
      ) : null}

      {showFallback || !enableMap ? renderFallbackView() : null}

      {error && !showFallback && enableMap ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255,59,48,0.9)',
    borderRadius: 8,
  },
  errorText: { color: 'white', textAlign: 'center' },
  fallbackContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  placeItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  placeRating: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
  },
  fallbackNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
}); 

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}