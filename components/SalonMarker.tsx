import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { Text, View, Button, StyleSheet, Linking } from 'react-native';

export default function SalonMarker({ salon }: { salon: any }) {
  const { location, name, queue, address, phone, hours } = salon;

  const getMarkerColor = (queueLength: number) => {
    if (queueLength === 0) return '#34C759'; // Green
    if (queueLength <= 3) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  const getQueueStatus = (queueLength: number) => {
    if (queueLength === 0) return 'No Wait';
    if (queueLength <= 3) return 'Short Wait';
    return 'Long Wait';
  };

  const handleNavigate = () => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://maps.google.com/?q=${encodedAddress}`;
      Linking.openURL(url);
    }
  };

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  return (
    <Marker
      coordinate={{ 
        latitude: location.latitude, 
        longitude: location.longitude 
      }}
      pinColor={getMarkerColor(queue)}
    >
      <Callout style={styles.callout}>
        <View style={styles.calloutContent}>
          <Text style={styles.salonName}>{name}</Text>
          
          <View style={styles.queueInfo}>
            <Text style={[styles.queueText, { color: getMarkerColor(queue) }]}>
              {queue} waiting • {getQueueStatus(queue)}
            </Text>
          </View>

          {address && (
            <Text style={styles.address}>{address}</Text>
          )}

          {hours && (
            <Text style={styles.hours}>Hours: {hours}</Text>
          )}

          <View style={styles.buttonContainer}>
            {address && (
              <Button 
                title="Navigate" 
                onPress={handleNavigate}
                color="#007AFF"
              />
            )}
            {phone && (
              <Button 
                title="Call" 
                onPress={handleCall}
                color="#34C759"
              />
            )}
          </View>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  callout: {
    width: 200,
    padding: 0,
  },
  calloutContent: {
    padding: 12,
    gap: 8,
  },
  salonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  queueInfo: {
    paddingVertical: 4,
  },
  queueText: {
    fontSize: 14,
    fontWeight: '600',
  },
  address: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  hours: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
}); 