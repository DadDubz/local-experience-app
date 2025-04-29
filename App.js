import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./frontend/src/navigation/MainNavigator";
import AuthNavigator from "./frontend/src/navigation/AuthNavigator";

const Stack = createStackNavigator();

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://54203e5fcfaa42c92bc3fc685c9d1ce3@o4509009671815168.ingest.us.sentry.io/4509136637067264",
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
