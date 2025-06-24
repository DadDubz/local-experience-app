// frontend/App.tsx
import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext'; // ✅ Make sure this path is right
import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

const Stack = createStackNavigator();

if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const RootNavigation = () => {
  const { user, loading } = useAuth(); // ✅ Will crash if useAuth returns undefined

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

const App = () => (
  <AuthProvider>
    <RootNavigation />
  </AuthProvider>
);

export default App;
