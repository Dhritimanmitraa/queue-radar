import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { seedDemoData, DEMO_SALON_ID } from '../services/demoData';

export default function BarberDashboard() {
  const [queue, setQueue] = useState<number | null>(null);
  const [salonId, setSalonId] = useState<string>(DEMO_SALON_ID);
  const [salonName, setSalonName] = useState<string>('Demo Salon');

  useEffect(() => {
    if (!salonId) return;

    const salonRef = doc(db, 'salons', salonId);
    
    // Real-time listener for queue updates
    const unsubscribe = onSnapshot(salonRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQueue(data.queue ?? 0);
        setSalonName(data.name ?? 'Demo Salon');
      } else {
        setQueue(0);
      }
    }, (error) => {
      console.error('Error listening to salon updates:', error);
      setQueue(0);
    });

    return () => unsubscribe();
  }, [salonId]);

  const updateQueue = async (value: number) => {
    if (!salonId) return;
    
    try {
      const salonRef = doc(db, 'salons', salonId);
      await updateDoc(salonRef, { 
        queue: Math.max(value, 0), 
        lastUpdated: Date.now() 
      });
    } catch (error) {
      console.error('Error updating queue:', error);
      Alert.alert('Error', 'Failed to update queue. Please try again.');
    }
  };

  const handleSeedDemoData = async () => {
    try {
      await seedDemoData();
      Alert.alert('Success', 'Demo data has been seeded! Check the customer map.');
    } catch (error) {
      Alert.alert('Error', 'Failed to seed demo data. Please try again.');
    }
  };

  if (queue === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <Button 
          title="Seed Demo Data" 
          onPress={handleSeedDemoData}
          color="#007AFF"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.salonName}>{salonName}</Text>
      <Text style={styles.queueText}>People waiting: {queue}</Text>
      
      <View style={styles.buttonRow}>
        <Button 
          title="- Remove Person" 
          onPress={() => updateQueue(queue - 1)} 
          color="#FF3B30"
        />
        <Button 
          title="+ Add Person" 
          onPress={() => updateQueue(queue + 1)}
          color="#34C759"
        />
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.demoText}>Demo Controls:</Text>
        <Button 
          title="Seed Demo Data" 
          onPress={handleSeedDemoData}
          color="#007AFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 20,
    padding: 24,
    backgroundColor: '#f5f5f5'
  },
  salonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  queueText: { 
    fontSize: 24, 
    fontWeight: '600',
    color: '#666'
  },
  buttonRow: { 
    flexDirection: 'row', 
    gap: 20,
    marginTop: 10
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20
  },
  demoSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#e8f4fd',
    borderRadius: 10,
    alignItems: 'center',
    gap: 10
  },
  demoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF'
  }
}); 