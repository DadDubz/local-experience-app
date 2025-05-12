// App.tsx
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';

import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';

if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const AppInner = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or show a splash/loading screen

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
};

export default App;
