import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import './services/firebase';

import RoleGate from './screens/RoleGate.native';
import CustomerHome from './screens/CustomerHome.native';
import BarberDashboard from './screens/BarberDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="RoleGate" component={RoleGate} />
          <Stack.Screen name="CustomerHome" component={CustomerHome} />
          <Stack.Screen name="BarberDashboard" component={BarberDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}         