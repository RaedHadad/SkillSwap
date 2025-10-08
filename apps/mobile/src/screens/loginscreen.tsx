import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../auth/authprovider';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('raed@example.com');
  const [password, setPassword] = useState('pass');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    try {
      setBusy(true);
      await login(email, password);
      navigation.replace('Dashboard');
    } catch (e: any) {
      Alert.alert('Login failed', e.message || 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Login</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      <Button title={busy ? 'Signing in…' : 'Sign in'} onPress={onSubmit} />
      <Text onPress={() => navigation.navigate('Signup')} style={{ color: 'blue', marginTop: 8 }}>
        Create account
      </Text>
    </View>
  );
}
