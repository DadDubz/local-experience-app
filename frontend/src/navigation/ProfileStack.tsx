// frontend/src/navigation/ProfileStack.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '@screens/ProfileScreen';
import AccountInfoScreen from '@screens/AccountInfoScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
