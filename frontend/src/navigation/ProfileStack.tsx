import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfileInfoScreen from '@screens/ProfileInfoScreen';
import ProfilePostsScreen from '@screens/ProfilePostsScreen';
import MyCatchesMapScreen from '@screens/MyCatchesMapScreen';

const Tab = createMaterialTopTabNavigator();

const ProfileStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
      }}
    >
      <Tab.Screen name="Info" component={ProfileInfoScreen} />
      <Tab.Screen name="My Posts" component={ProfilePostsScreen} />
      <Tab.Screen name="Catches Map" component={MyCatchesMapScreen} />
    </Tab.Navigator>
  );
};

export default ProfileStack;

