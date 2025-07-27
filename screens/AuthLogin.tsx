import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function AuthLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [pw, setPw]   = useState('');

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
      navigation.replace('BarberDashboard');
    } catch (e) { Alert.alert('Login failed', e.message); }
  }

  return (
    <View style={styles.box}>
      <TextInput placeholder="Email" autoCapitalize="none"
                 value={email} onChangeText={setEmail} style={styles.input}/>
      <TextInput placeholder="Password" secureTextEntry
                 value={pw} onChangeText={setPw} style={styles.input}/>
      <Button title="Log in" onPress={handleLogin} />
      <Button title="Need account? Register"
              onPress={() => navigation.navigate('AuthRegister')} />
    </View>);
}
const styles = StyleSheet.create({ box:{flex:1,justifyContent:'center',padding:24}, input:{borderWidth:1,padding:8,marginBottom:12}}); 