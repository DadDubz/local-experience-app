import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MapStack from './MapStackNavigator';
import WeatherStack from './WeatherStackNavigator';
import GuidesStack from './GuidesStackNavigator';
import ShopsStack from './ShopsStackNavigator'; // Ensure the file './ShopsStackNavigator.tsx' exists in the same directory
import SocialStack from './SocialStackNavigator'; // ✅ Import the new stack
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Map': iconName = focused ? 'map' : 'map-outline'; break;
          case 'Weather': iconName = focused ? 'weather-sunny' : 'weather-cloudy'; break;
          case 'Guides': iconName = focused ? 'account-group' : 'account-group-outline'; break;
          case 'Shops': iconName = focused ? 'store' : 'store-outline'; break;
          case 'Social': iconName = focused ? 'fish' : 'fish-outline'; break;
          case 'Profile': iconName = focused ? 'account' : 'account-outline'; break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarStyle: { paddingBottom: 5, height: 60 },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Map" component={MapStack} />
    <Tab.Screen name="Weather" component={WeatherStack} />
    <Tab.Screen name="Guides" component={GuidesStack} />
    <Tab.Screen name="Shops" component={ShopsStack} />
    <Tab.Screen name="Social" component={SocialStack} /> {/* ✅ Uses the new stack */}
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainNavigator;
