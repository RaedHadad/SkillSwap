// apps/mobile/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthProvider, { useAuth } from './src/auth/authprovider';
import LoginScreen from './src/screens/loginscreen';
import SignupScreen from './src/screens/signupscreen';
import DashboardScreen from './src/screens/dashboardscreen';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { token, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack.Navigator
      initialRouteName={token ? 'Dashboard' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      {token ? (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
