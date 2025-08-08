import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getCurrentPositionAsync } from '../services/location';
import SalonMarker from '../components/SalonMarker.native';
import PlaceMarker from '../components/PlaceMarker.native';
import { fetchNearbySalons, type NearbySalonPlace } from '../services/places';

export default function CustomerHome() {
  const [salons, setSalons] = useState<any[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbySalonPlace[]>([]);
  const [region, setRegion] = useState<any>();
  const [error, setError] = useState<string | null>(null);
  const searchRadiusMeters = 4000;

  useEffect(() => {
    (async () => {
      try {
        const loc = await getCurrentPositionAsync();
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        // Fire Google Places fetch in parallel
        try {
          const places = await fetchNearbySalons(
            loc.coords.latitude,
            loc.coords.longitude,
            searchRadiusMeters
          );
          setNearbyPlaces(places);
        } catch (e: any) {
          setError(e?.message ?? 'Failed fetching nearby salons');
        }
      } catch (e) {
        console.warn(e);
      }
    })();
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
    const q = query(collection(db, 'salons'));
    const unsub = onSnapshot(q, (snap) => {
      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSalons(results);
    });
    return () => unsub();
  }, []);

  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
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
      {error ? (
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