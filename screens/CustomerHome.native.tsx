import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getCurrentPositionAsync } from '../services/location';
import SalonMarker from '../components/SalonMarker';

export default function CustomerHome() {
  const [salons, setSalons] = useState<any[]>([]);
  const [region, setRegion] = useState<any>();

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
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

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
    <MapView style={StyleSheet.absoluteFill} region={region} provider={PROVIDER_GOOGLE}>
      {salons.map((salon) => (
        <SalonMarker key={salon.id} salon={salon} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 