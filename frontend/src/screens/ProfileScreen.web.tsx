import React from 'react';
import { View, Text, Button, StyleSheet, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AccountInfoScreen from './AccountInfoScreen';
import MyPostsScreen from './MyPostsScreen'; // Create this if needed

const Stack = createStackNavigator();

const ProfileScreen = () => {
  const dimensions = useWindowDimensions();

  return (
    <NavigationContainer independent>
      <Stack.Navigator>
        <Stack.Screen name="Account Info" component={AccountInfoScreen} />
        <Stack.Screen name="My Posts" component={MyPostsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProfileScreen;
