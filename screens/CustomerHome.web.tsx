import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import 'leaflet/dist/leaflet.css';
// Leaflet + React-Leaflet (fallback map)
import { MapContainer, TileLayer, Marker as LMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { fetchNearbySalons, type NearbySalonPlace } from '../services/places';
import { fetchNearbySalonsOSM } from '../services/osm';

const containerStyle = { width: '100%', height: '100vh' };

export default function CustomerHome() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<NearbySalonPlace[]>([]);
  const [selected, setSelected] = useState<NearbySalonPlace | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiKey = (process as any).env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: apiKey ?? 'DUMMY_KEY' });

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(c);
        try {
          const res = await fetchNearbySalons(c.lat, c.lng, 4000);
          setPlaces(res);
        } catch (e: any) {
          // Fallback to OSM fetch+Leaflet-like data if Google fails
          try {
            const osm = await fetchNearbySalonsOSM(c.lat, c.lng, 4000);
            setPlaces(osm as unknown as NearbySalonPlace[]);
          } catch (oe: any) {
            setError(e?.message ?? 'Failed fetching nearby salons');
          }
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  if (!center) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {isLoaded && apiKey ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13} options={{ streetViewControl: false }}>
          <Marker position={center} icon={{ url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png' }} />
          {places.map((p) => (
            <Marker key={p.place_id} position={{ lat: p.geometry.location.lat, lng: p.geometry.location.lng }} onClick={() => setSelected(p)} />
          ))}
          {selected ? (
            <InfoWindow position={{ lat: selected.geometry.location.lat, lng: selected.geometry.location.lng }} onCloseClick={() => setSelected(null)}>
              <div style={{ maxWidth: 220 }}>
                <div style={{ fontWeight: 700 }}>{selected.name}</div>
                {selected.vicinity ? <div style={{ color: '#666' }}>{selected.vicinity}</div> : null}
                {typeof selected.rating === 'number' ? (
                  <div style={{ marginTop: 4 }}>{selected.rating.toFixed(1)} ⭐ ({selected.user_ratings_total ?? 0})</div>
                ) : null}
                {selected.opening_hours?.open_now != null ? (
                  <div style={{ color: selected.opening_hours.open_now ? '#34C759' : '#FF3B30', marginTop: 4 }}>
                    {selected.opening_hours.open_now ? 'Open now' : 'Closed'}
                  </div>
                ) : null}
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      ) : (
        <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <LMarker position={center} icon={L.icon({ iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png', iconSize: [24, 24] })}>
            <Popup>You are here</Popup>
          </LMarker>
          {places.map((p) => (
            <LMarker key={p.place_id} position={{ lat: p.geometry.location.lat, lng: p.geometry.location.lng }}>
              <Popup>
                <div style={{ maxWidth: 220 }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  {p.vicinity ? <div style={{ color: '#666' }}>{p.vicinity}</div> : null}
                </div>
              </Popup>
            </LMarker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, height: '100vh', justifyContent: 'center', alignItems: 'center' },
  error: { color: '#FF3B30', marginTop: 8 },
});
