// frontend/src/screens/ProfileScreen.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';
import MyPostsScreen from './MyPostsScreen';
import { useAuth } from '../context/AuthContext';

const Tab = createMaterialTopTabNavigator();

const AccountInfoScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.label}>Joined: {new Date(user?.createdAt).toLocaleDateString()}</Text>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Account Info" component={AccountInfoScreen} />
      <Tab.Screen name="My Posts" component={MyPostsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
});

export default ProfileScreen;
