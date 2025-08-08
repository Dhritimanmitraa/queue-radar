import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoleGateNative() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Queue Radar</Text>
        <Text style={styles.subtitle}>Skip the wait, find your cut</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="I'm a Customer"
            onPress={() => navigation.navigate('CustomerHome')}
            color="#007AFF"
          />
          <Text style={styles.buttonDescription}>
            Find nearby salons with live queue information
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="I'm a Barber"
            onPress={() => navigation.navigate('BarberDashboard')}
            color="#34C759"
          />
          <Text style={styles.buttonDescription}>
            Manage your salon's queue in real-time
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🚀 Demo Version - Real-time queue updates powered by Firebase
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  header: { alignItems: 'center', marginBottom: 60 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#666', fontStyle: 'italic' },
  buttonContainer: { width: '100%', gap: 30 },
  buttonWrapper: { alignItems: 'center', gap: 8 },
  buttonDescription: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  footer: { position: 'absolute', bottom: 40, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#999', textAlign: 'center' },
});


