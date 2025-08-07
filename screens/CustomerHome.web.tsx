import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'react-router-dom';

const CustomerHome = () => (
  <View style={{
    flex: 1, justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa'
  }}>
    <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>Customer Home (Web)</Text>
    <Text style={{ fontSize: 18, marginBottom: 32 }}>Welcome to the customer dashboard!</Text>
    <Link to="/" style={{ fontSize: 16, color: '#007AFF', textDecoration: 'underline' }}>
      ← Back to Home
    </Link>
    <Link to="/salons" style={{ fontSize: 16, color: '#34C759', textDecoration: 'underline', marginTop: 16 }}>
      View Salons
    </Link>
  </View>
);

export default CustomerHome;
