import React, { useEffect, useState } from 'react';
import { fetchNearbySalonsOSM } from '../services/osm';

const containerStyle = { width: '100%', height: '100vh' };

export default function CustomerHome() {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(c);
        
        try {
          const osm = await fetchNearbySalonsOSM(c.lat, c.lng, 4000);
          setPlaces(osm);
        } catch (e: any) {
          setError(e?.message ?? 'Failed fetching nearby salons');
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <p>Getting your location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.error}>❌ {error}</div>
      </div>
    );
  }

  if (!center) {
    return (
      <div style={styles.center}>
        <div>📍 Location not available</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🗺️ Queue Radar - Nearby Salons</h1>
      
      <div style={styles.locationInfo}>
        <h3>📍 Your Location</h3>
        <p>Latitude: {center.lat.toFixed(6)}</p>
        <p>Longitude: {center.lng.toFixed(6)}</p>
      </div>

      <div style={styles.placesContainer}>
        <h3>🏪 Nearby Salons ({places.length} found)</h3>
        {places.length === 0 ? (
          <p>No salons found in your area.</p>
        ) : (
          places.map((place, index) => (
            <div key={place.id || index} style={styles.placeCard}>
              <h4>{place.name}</h4>
              {place.address && <p style={styles.address}>📍 {place.address}</p>}
              {place.amenity && <p style={styles.amenity}>🏷️ {place.amenity}</p>}
              <p style={styles.distance}>
                📏 Distance: {calculateDistance(center.lat, center.lng, place.lat, place.lng).toFixed(2)} km
              </p>
            </div>
          ))
        )}
      </div>

      <div style={styles.note}>
        <p>💡 <strong>Note:</strong> This is a simplified web view. For full map functionality, use the native Android app!</p>
        <p>📱 Download the Android APK for interactive maps, real-time updates, and more features.</p>
      </div>
    </div>
  );
}

// Helper function to calculate distance
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const styles = {
  center: { 
    display: 'flex', 
    height: '100vh', 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column' as 'column'
  },
  error: { 
    color: '#FF3B30', 
    padding: '20px',
    textAlign: 'center' as 'center',
    fontSize: '18px'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007AFF',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 2s linear infinite',
    marginBottom: '10px'
  },
  locationInfo: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #e9ecef'
  },
  placesContainer: {
    marginBottom: '20px'
  },
  placeCard: {
    backgroundColor: '#ffffff',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  address: {
    color: '#6c757d',
    margin: '5px 0'
  },
  amenity: {
    color: '#007AFF',
    margin: '5px 0',
    fontWeight: 'bold' as 'bold'
  },
  distance: {
    color: '#28a745',
    margin: '5px 0',
    fontWeight: 'bold' as 'bold'
  },
  note: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #007AFF',
    textAlign: 'center' as 'center'
  }
};
