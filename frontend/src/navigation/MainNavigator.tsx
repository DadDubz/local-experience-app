import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SocialFeedScreen from '../screens/SocialFeedScreen';
import MapStack from '../navigation/MapStack';
import WeatherStack from '../navigation/WeatherStack';
import GuidesStack from '../navigation/GuidesStack';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Map': iconName = focused ? 'map' : 'map-outline'; break;
            case 'Weather': iconName = focused ? 'weather-sunny' : 'weather-cloudy'; break;
            case 'Guides': iconName = focused ? 'account-group' : 'account-group-outline'; break;
            case 'Shops': iconName = focused ? 'store' : 'store-outline'; break;
            case 'Social': iconName = focused ? 'fish' : 'fish-outline'; break;
            default: iconName = 'help-circle-outline';
          }
          return <MaterialCommunityIcons name={iconName!} size={size} color={color} />;
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
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};
