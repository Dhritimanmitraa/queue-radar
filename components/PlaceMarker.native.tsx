import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { Text, View, StyleSheet, Linking } from 'react-native';
import type { NearbySalonPlace } from '../services/places';

export default function PlaceMarker({ place }: { place: NearbySalonPlace }) {
  const lat = place.geometry.location.lat;
  const lng = place.geometry.location.lng;

  const handleNavigate = () => {
    const encoded = encodeURIComponent(place.name + (place.vicinity ? ` ${place.vicinity}` : ''));
    const url = `https://maps.google.com/?q=${encoded}`;
    Linking.openURL(url);
  };

  return (
    <Marker coordinate={{ latitude: lat, longitude: lng }} pinColor="#0A84FF">
      <Callout onPress={handleNavigate} style={styles.callout}>
        <View style={styles.calloutContent}>
          <Text style={styles.name}>{place.name}</Text>
          {place.vicinity ? <Text style={styles.address}>{place.vicinity}</Text> : null}
          {typeof place.rating === 'number' ? (
            <Text style={styles.meta}>
              {place.rating.toFixed(1)} ⭐ ({place.user_ratings_total ?? 0})
            </Text>
          ) : null}
          {place.opening_hours?.open_now != null ? (
            <Text style={[styles.meta, { color: place.opening_hours.open_now ? '#34C759' : '#FF3B30' }]}> 
              {place.opening_hours.open_now ? 'Open now' : 'Closed'}
            </Text>
          ) : null}
          <Text style={styles.hint}>Tap to navigate</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  callout: { width: 220 },
  calloutContent: { padding: 12, gap: 6 },
  name: { fontSize: 16, fontWeight: 'bold' },
  address: { fontSize: 12, color: '#666' },
  meta: { fontSize: 12, color: '#444' },
  hint: { marginTop: 6, fontSize: 12, color: '#0A84FF' },
});


