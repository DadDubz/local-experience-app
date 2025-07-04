// frontend/src/navigation/MainNavigator.tsx
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Update the import path below if '@screens' alias is not configured correctly
import MapScreen from '@screens/MapScreen';
import WeatherScreen from '@screens/WeatherScreen';
import ShopsScreen from '@screens/ShopsScreen';
import SocialFeedScreen from '@screens/SocialFeedScreen';
import ProfileScreen from '@screens/ProfileScreen';

import LocationDetailScreen from '@screens/LocationDetailScreen';
import TrailDetailScreen from '@screens/TrailDetailScreen';
import FishingSpotDetailScreen from '@screens/FishingSpotDetailScreen';
import WeatherAlertsScreen from '../screens/WeatherAlertsScreen';
import MarineConditionsScreen from '@screens/MarineConditionsScreen';
// Update the path below to the correct relative path if GuideScreen exists elsewhere
// import GuideScreen from '@screens/GuideScreen';
// TODO: Update the path below to the correct relative path if GuideScreen exists elsewhere
// import GuideScreen from '../screens/GuideScreen';
import GuideBookingScreen from '@screens/GuideBookingScreen';
import GuideDetailScreen from '@screens/GuideDetailScreen';
import ShopDetailScreen from '@screens/ShopDetailScreen';
import ShopInventoryScreen from '@screens/ShopInventoryScreen';
import GuideScreen from '@screens/GuideScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MapMain" component={MapScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="LocationDetail"
      component={LocationDetailScreen}
      options={({
        route,
      }: {
        route: { params?: { location?: { FacilityName?: string } } };
      }) => ({
        title: route.params?.location?.FacilityName || 'Location Details',
        headerShown: true,
      })}
    />
<Stack.Screen name="TrailDetail" component={TrailDetailScreen} options={({ route }) => ({
  title: (route.params as { trail?: { name?: string } })?.trail?.name || 'Trail Details',
  headerShown: true,
})} />

    <Stack.Screen
      name="FishingSpotDetail"
      component={FishingSpotDetailScreen}
      options={({
        route,
      }: {
        route: { params?: { spot?: { name?: string } } };
      }) => ({
        title: route.params?.spot?.name || 'Fishing Spot Details',
        headerShown: true,
      })}
    />
  </Stack.Navigator>
);

const WeatherStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="WeatherMain" component={WeatherScreen} options={{ title: 'Weather' }} />
    <Stack.Screen name="WeatherAlerts" component={WeatherAlertsScreen} options={{ title: 'Weather Alerts' }} />
    <Stack.Screen name="MarineConditions" component={MarineConditionsScreen} options={{ title: 'Marine Conditions' }} />
  </Stack.Navigator>
);

const GuidesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="GuidesMain" component={GuideScreen} options={{ title: 'Guides' }} />
    <Stack.Screen
      name="GuideDetail"
      component={GuideDetailScreen}
      options={({
        route,
      }: {
        route: { params?: { guide?: { name?: string } } };
      }) => ({
        title: route.params?.guide?.name || 'Guide Details',
      })}
    />
    <Stack.Screen name="GuideBooking" component={GuideBookingScreen} options={{ title: 'Book Guide' }} />
  </Stack.Navigator>
);

const ShopsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ShopsMain" component={ShopsScreen} options={{ title: 'Shops' }} />
    <Stack.Screen
      name="ShopDetail"
      component={ShopDetailScreen}
      options={({
        route,
      }: {
        route: { params?: { shop?: { name?: string } } };
      }) => ({
        title: route.params?.shop?.name || 'Shop Details',
      })}
    />
    <Stack.Screen name="ShopInventory" component={ShopInventoryScreen} options={{ title: 'Inventory' }} />
  </Stack.Navigator>
);

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
          default: iconName = 'circle';
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
    <Tab.Screen name="Social" component={SocialFeedScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainNavigator;
