import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable, TextInput, Switch, ScrollView } from 'react-native';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { seedDemoData, DEMO_SALON_ID } from '../services/demoData';

export default function BarberDashboard() {
  const [queue, setQueue] = useState<number | null>(null);
  const [salonId, setSalonId] = useState<string>(DEMO_SALON_ID);
  const [salonName, setSalonName] = useState<string>('Demo Salon');
  const [avgMinutesPerCustomer, setAvgMinutesPerCustomer] = useState<number>(10);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [manualValue, setManualValue] = useState<string>('');

  useEffect(() => {
    if (!salonId) return;

    const salonRef = doc(db, 'salons', salonId);

    // Real-time listener for queue updates
    const unsubscribe = onSnapshot(salonRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQueue(typeof data.queue === 'number' ? data.queue : 0);
        setSalonName(data.name ?? 'Demo Salon');
        if (typeof data.avgMinutesPerCustomer === 'number') {
          setAvgMinutesPerCustomer(data.avgMinutesPerCustomer);
        }
        if (typeof data.lastUpdated === 'number') setLastUpdated(data.lastUpdated);
        if (typeof data.isOpen === 'boolean') setIsOpen(data.isOpen);
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
      await setDoc(
        salonRef,
        { queue: Math.max(value, 0), lastUpdated: Date.now() },
        { merge: true }                       // creates if missing, merges if exists
      );
    } catch (error) {
      console.error('Error updating queue:', error);
      Alert.alert('Error', 'Failed to update queue. Please try again.');
    }
  };

  const updateAvgMinutes = async (minutes: number) => {
    if (!salonId) return;
    try {
      const salonRef = doc(db, 'salons', salonId);
      await setDoc(salonRef, { avgMinutesPerCustomer: Math.max(1, Math.floor(minutes)), lastUpdated: Date.now() }, { merge: true });
      setAvgMinutesPerCustomer(Math.max(1, Math.floor(minutes)));
    } catch (error) {
      console.error('Error updating avg minutes:', error);
    }
  };

  const updateOpenClosed = async (next: boolean) => {
    if (!salonId) return;
    try {
      const salonRef = doc(db, 'salons', salonId);
      await setDoc(salonRef, { isOpen: next, lastUpdated: Date.now() }, { merge: true });
      setIsOpen(next);
    } catch (error) {
      console.error('Error updating open/closed:', error);
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
        <Pressable style={[styles.button, styles.primary]} onPress={handleSeedDemoData}>
          <Text style={styles.buttonText}>Seed Demo Data</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.salonName}>{salonName}</Text>
        <View style={styles.openRow}>
          <View style={[styles.badge, { backgroundColor: isOpen ? '#E7F8EF' : '#FDECEC' }]}>
            <Text style={[styles.badgeText, { color: isOpen ? '#1E9E62' : '#C0262D' }]}>
              {isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          <Switch value={isOpen} onValueChange={updateOpenClosed} />
        </View>
      </View>

      {/* Queue Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Queue</Text>
        <Text style={styles.queueBig}>{queue}</Text>
        <Text style={styles.subtle}>
          Est. wait ~ {Math.max(0, queue * avgMinutesPerCustomer)} min ({avgMinutesPerCustomer} min/person)
        </Text>
        {lastUpdated ? (
          <Text style={styles.subtleDim}>Last updated {new Date(lastUpdated).toLocaleTimeString()}</Text>
        ) : null}
      </View>

      {/* Quick Actions */}
      <View style={styles.grid}>
        <Pressable style={[styles.button, styles.danger]} onPress={() => updateQueue(queue - 1)}>
          <Text style={styles.buttonText}>-1</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.success]} onPress={() => updateQueue(queue + 1)}>
          <Text style={styles.buttonText}>+1</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.success]} onPress={() => updateQueue(queue + 2)}>
          <Text style={styles.buttonText}>+2</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.success]} onPress={() => updateQueue(queue + 5)}>
          <Text style={styles.buttonText}>+5</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.neutral]} onPress={() => updateQueue(0)}>
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
      </View>

      {/* Manual Set */}
      <View style={styles.row}>
        <TextInput
          value={manualValue}
          onChangeText={setManualValue}
          inputMode="numeric"
          placeholder="Set queue"
          style={styles.input}
        />
        <Pressable
          style={[styles.button, styles.primary, { minWidth: 100 }]}
          onPress={() => {
            const v = parseInt(manualValue, 10);
            if (!isNaN(v)) updateQueue(v);
          }}
        >
          <Text style={styles.buttonText}>Set</Text>
        </Pressable>
      </View>

      {/* Per-customer time */}
      <View style={styles.row}>
        <TextInput
          value={String(avgMinutesPerCustomer)}
          onChangeText={(t) => setAvgMinutesPerCustomer(isNaN(parseInt(t, 10)) ? 1 : parseInt(t, 10))}
          onBlur={() => updateAvgMinutes(avgMinutesPerCustomer)}
          inputMode="numeric"
          placeholder="Min per customer"
          style={styles.input}
        />
        <Pressable style={[styles.button, styles.secondary]} onPress={() => updateAvgMinutes(avgMinutesPerCustomer)}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>

      {/* Demo */}
      <View style={[styles.card, { gap: 12 }] }>
        <Text style={styles.cardTitle}>Demo & Utilities</Text>
        <Pressable style={[styles.button, styles.primary]} onPress={handleSeedDemoData}>
          <Text style={styles.buttonText}>Seed Demo Data</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F6F7F9',
    gap: 16,
  },
  header: { marginTop: 8, gap: 8 },
  salonName: { fontSize: 28, fontWeight: '800', color: '#1F2937' },
  openRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 8 },
  cardTitle: { fontSize: 14, color: '#6B7280', fontWeight: '700', textTransform: 'uppercase' },
  queueBig: { fontSize: 64, fontWeight: '900', color: '#111827', textAlign: 'center' },
  subtle: { textAlign: 'center', color: '#374151', fontWeight: '500' },
  subtleDim: { textAlign: 'center', color: '#6B7280' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: { flex: 1, backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontWeight: '800' },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#6366F1' },
  success: { backgroundColor: '#22C55E' },
  danger: { backgroundColor: '#EF4444' },
  neutral: { backgroundColor: '#6B7280' },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20
  },
  demoText: { fontSize: 16, fontWeight: '600', color: '#007AFF' }
}); 