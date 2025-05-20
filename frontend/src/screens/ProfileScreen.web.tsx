import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Make sure the file exists as AccountInfoScreen.tsx or AccountInfoScreen/index.tsx in the same directory
// Update the import path below to the correct relative path where AccountInfoScreen actually exists.
// For example, if AccountInfoScreen.tsx is in the same folder as ProfileScreen.web.tsx:
// Update the import path below to the correct relative path where AccountInfoScreen actually exists.
// For example, if AccountInfoScreen.tsx is in the same folder as ProfileScreen.web.tsx:
// import AccountInfoScreen from './AccountInfoScreen';
// Or, if it is in a parent folder:
import AccountInfoScreen from './AccontInfoScreen';
// Or, if it is in a parent folder:
// import AccountInfoScreen from '../AccountInfoScreen';
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
