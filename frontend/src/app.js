import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./navigation/MainNavigator";
import AuthNavigator from "./navigation/AuthNavigator";

const Stack = createStackNavigator();
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api', protectedRoutes);

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
