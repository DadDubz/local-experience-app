// App.tsx
import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';

if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
}

import { AuthProvider, useAuth } from './src/context/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

const Stack = createStackNavigator();

// Load Leaflet CSS for web
if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
}

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

// Root component to manage auth state
const RootNavigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Wrap everything with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
};

export default App;
