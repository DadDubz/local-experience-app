// frontend/src/navigation/MainNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Main feature screens
import MapScreen from '@screens/MapScreen';
import WeatherScreen from '@screens/WeatherScreen';
import ProfileScreen from '@screens/ProfileScreen';
import ShopsScreen from '@screens/ShopsScreen';

import LocationDetailScreen from '@screens/LocationDetailScreen.web';
import TrailDetailScreen from '@screens/TrailDetailScreen.native';
import FishingSpotDetailScreen from '@FishingSpotDetailScreen';
import WeatherAlertsScreen from '@screens/WeatherAlertsScreen';
import MarineConditionsScreen from '@screens/MarineConditionsScreen';
import GuideScreen from '@screens/GuideScreen';
import GuideBookingScreen from '@screens/GuideBookingScreen';
import ShopDetailScreen from '@screens/ShopDetailScreen';
import ShopInventoryScreen from '@screens/ShopInventoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each main feature
const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MapMain"
      component={MapScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LocationDetail"
      component={LocationDetailScreen}
      options={({ route }) => ({
        title: route.params?.location?.FacilityName || 'Location Details',
        headerShown: true
      })}
    />
    <Stack.Screen
      name="TrailDetail"
      component={TrailDetailScreen}
      options={({ route }) => ({
        title: route.params?.trail?.name || 'Trail Details',
        headerShown: true
      })}
    />
    <Stack.Screen
      name="FishingSpotDetail"
      component={FishingSpotDetailScreen}
      options={({ route }) => ({
        title: route.params?.spot?.name || 'Fishing Spot Details',
        headerShown: true
      })}
    />
  </Stack.Navigator>
);

const WeatherStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="WeatherMain"
      component={WeatherScreen}
      options={{ title: 'Weather' }}
    />
    <Stack.Screen
      name="WeatherAlerts"
      component={WeatherAlertsScreen}
      options={{ title: 'Weather Alerts' }}
    />
    <Stack.Screen
      name="MarineConditions"
      component={MarineConditionsScreen}
      options={{ title: 'Marine Conditions' }}
    />
  </Stack.Navigator>
);

const GuidesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="GuidesMain"
      component={GuidesScreen}
      options={{ title: 'Guides' }}
    />
    <Stack.Screen
      name="GuideDetail"
      component={GuideDetailScreen}
      options={({ route }) => ({
        title: route.params?.guide?.name || 'Guide Details'
      })}
    />
    <Stack.Screen
      name="GuideBooking"
      component={GuideBookingScreen}
      options={{ title: 'Book Guide' }}
    />
  </Stack.Navigator>
);

const ShopsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ShopsMain"
      component={ShopsScreen}
      options={{ title: 'Shops' }}
    />
    <Stack.Screen
      name="ShopDetail"
      component={ShopDetailScreen}
      options={({ route }) => ({
        title: route.params?.shop?.name || 'Shop Details'
      })}
    />
    <Stack.Screen
      name="ShopInventory"
      component={ShopInventoryScreen}
      options={{ title: 'Inventory' }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Weather':
              iconName = focused ? 'weather-sunny' : 'weather-sunny-outline';
              break;
            case 'Guides':
              iconName = focused ? 'account-group' : 'account-group-outline';
              break;
            case 'Shops':
              iconName = focused ? 'store' : 'store-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          paddingBottom: 5,
          height: 60
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Map" component={MapStack} />
      <Tab.Screen name="Weather" component={WeatherStack} />
      <Tab.Screen name="Guides" component={GuidesStack} />
      <Tab.Screen name="Shops" component={ShopsStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;