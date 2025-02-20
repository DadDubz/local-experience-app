// frontend/src/screens/profile/SavedLocationsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { landsApi } from '../../services/api';

const SavedLocationsScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const fetchSavedLocations = async () => {
    try {
      setLoading(true);
      const response = await landsApi.getSavedLocations(user.id);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching saved locations:', error);
      Alert.alert('Error', 'Failed to load saved locations');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLocation = async (locationId) => {
    Alert.alert(
      'Remove Location',
      'Are you sure you want to remove this location from your saved list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await landsApi.removeSavedLocation(locationId);
              setLocations(locations.filter(loc => loc.id !== locationId));
            } catch (error) {
              console.error('Error removing location:', error);
              Alert.alert('Error', 'Failed to remove location');
            }
          }
        }
      ]
    );
  };

  const getLocationIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'fishing':
        return 'fish';
      case 'hiking':
        return 'hiking';
      case 'camping':
        return 'tent';
      default:
        return 'map-marker';
    }
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => navigation.navigate('LocationDetail', { location: item })}
    >
      <View style={styles.locationInfo}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={getLocationIcon(item.type)}
            size={24}
            color="#007AFF"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationType}>{item.type}</Text>
          <Text style={styles.locationAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Directions', { location: item })}
        >
          <MaterialCommunityIcons name="directions" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleRemoveLocation(item.id)}
        >
          <MaterialCommunityIcons name="heart-off" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {locations.length > 0 ? (
        <FlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="map-marker-off"
            size={64}
            color="#666"
          />
          <Text style={styles.emptyText}>
            No saved locations yet
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.exploreButtonText}>
              Explore Locations
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#999',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  actionButton: {
    padding: 8,
    marginLeft: 15,
  },
  removeButton: {
    backgroundColor: '#FFF2F2',
    borderRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SavedLocationsScreen;
