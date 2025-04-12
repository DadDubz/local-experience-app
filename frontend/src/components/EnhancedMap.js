// frontend/src/components/EnhancedMap.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationContext } from '../context/LocationContext';
import { landsApi } from '../services/api';

const LocationTypes = {
  FISHING: 'fishing',
  TRAIL: 'trail',
  PARK: 'park',
  GUIDE: 'guide',
  SHOP: 'shop'
};

const EnhancedMap = ({ navigation }) => {
  const mapRef = useRef(null);
  const { location, updateLocation } = useLocationContext();
  const [markers, setMarkers] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    setupLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchLocations();
    }
  }, [location, selectedType]);

  const setupLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services to use this feature.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      };

      setRegion(newRegion);
      updateLocation(currentLocation.coords);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your location');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await landsApi.getAllLands(
        location.latitude,
        location.longitude,
        50, // 50-mile radius
        selectedType
      );
      setMarkers(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Error', 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case LocationTypes.FISHING:
        return 'fish';
      case LocationTypes.TRAIL:
        return 'hiking';
      case LocationTypes.PARK:
        return 'tree';
      case LocationTypes.GUIDE:
        return 'account-group';
      case LocationTypes.SHOP:
        return 'store';
      default:
        return 'map-marker';
    }
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case LocationTypes.FISHING:
        return '#2196F3';
      case LocationTypes.TRAIL:
        return '#4CAF50';
      case LocationTypes.PARK:
        return '#FFC107';
      case LocationTypes.GUIDE:
        return '#9C27B0';
      case LocationTypes.SHOP:
        return '#FF5722';
      default:
        return '#757575';
    }
  };

  const handleMarkerPress = (marker) => {
    switch (marker.type) {
      case LocationTypes.FISHING:
        navigation.navigate('FishingSpotDetail', { spot: marker });
        break;
      case LocationTypes.TRAIL:
        navigation.navigate('TrailDetail', { trail: marker });
        break;
      case LocationTypes.PARK:
        navigation.navigate('ParkDetail', { park: marker });
        break;
      case LocationTypes.GUIDE:
        navigation.navigate('GuideDetail', { guide: marker });
        break;
      case LocationTypes.SHOP:
        navigation.navigate('ShopDetail', { shop: marker });
        break;
      default:
        navigation.navigate('LocationDetail', { location: marker });
    }
  };

  const centerOnUser = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      mapRef.current?.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }, 1000);
    } catch (error) {
      console.error('Error centering map:', error);
      Alert.alert('Error', 'Unable to center on your location');
    }
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          showsScale
        >
          {markers.map((marker, index) => (
            <Marker
              key={`${marker.id}-${index}`}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              onPress={() => handleMarkerPress(marker)}
            >
              <MaterialCommunityIcons
                name={getMarkerIcon(marker.type)}
                size={30}
                color={getMarkerColor(marker.type)}
              />
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{marker.name}</Text>
                  <Text style={styles.calloutDesc}>{marker.description}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {Object.values(LocationTypes).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedType === type && styles.filterButtonActive
            ]}
            onPress={() => setSelectedType(type === selectedType ? null : type)}
          >
            <MaterialCommunityIcons
              name={getMarkerIcon(type)}
              size={24}
              color={selectedType === type ? '#fff' : '#333'}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Center on User Button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerOnUser}
      >
        <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  centerButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDesc: {
    fontSize: 14,
    color: '#666',
  },
});

export default EnhancedMap;
