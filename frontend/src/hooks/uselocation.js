import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { startWatching = false } = options;

  // Get current location
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permission to access location was denied');
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to use this feature.'
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        timestamp: currentLocation.timestamp,
      });
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Unable to get your current location');
    } finally {
      setLoading(false);
    }
  };

  // Watch location changes
  const startLocationUpdates = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
            timestamp: newLocation.timestamp,
          });
        }
      );

      // Return the subscription to clean up
      return subscription;
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Unable to watch location updates');
    }
  };

  useEffect(() => {
    let subscription;

    if (startWatching) {
      // If watching is enabled, start location updates
      startLocationUpdates().then((sub) => {
        subscription = sub;
      });
    } else {
      // Otherwise just get the current location once
      getCurrentLocation();
    }

    // Cleanup function
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [startWatching]);

  // Function to manually refresh location
  const refreshLocation = () => {
    getCurrentLocation();
  };

  return {
    location,
    error,
    loading,
    refreshLocation,
  };
};

// Usage example:
/*
import { useLocation } from '../hooks/useLocation';

const MyComponent = () => {
  const { location, error, loading, refreshLocation } = useLocation({
    startWatching: true // Set to true if you want continuous updates
  });

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Text>Latitude: {location?.latitude}</Text>
      <Text>Longitude: {location?.longitude}</Text>
      <Button title="Refresh Location" onPress={refreshLocation} />
    </View>
  );
};
*/
