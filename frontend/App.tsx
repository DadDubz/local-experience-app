import React from 'react';
import { Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';

import MainNavigator from './src/navigation/MainNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

const Stack = createStackNavigator();

// ✅ Load Leaflet CSS only for web
if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
}

// ✅ Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const App = () => {
  console.log('✅ App is rendering on platform:', Platform.OS);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Main"
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
