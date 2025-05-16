import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AccountInfoScreen from './AccountInfoScreen';
import MyPostsScreen from './MyPostsScreen';

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Account Info" component={AccountInfoScreen} />
      <Tab.Screen name="My Posts" component={MyPostsScreen} />
    </Tab.Navigator>
  );
};

export default ProfileScreen;
