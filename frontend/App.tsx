import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./src/navigation/MainNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";

const Stack = createStackNavigator();

import * as Sentry from "@sentry/react-native";
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
}



Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;