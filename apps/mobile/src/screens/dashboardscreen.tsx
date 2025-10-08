import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../auth/authprovider';

export default function DashboardScreen() {
  const { token, logout } = useAuth();

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Dashboard</Text>
      <Text selectable>Token (first 24): {token?.slice(0, 24)}...</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
