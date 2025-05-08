// frontend/src/screens/WeatherAlertsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationContext } from '@context/LocationContext';
import { weatherApi } from '@services/api';

const WeatherAlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { location } = useLocationContext();

  useEffect(() => {
    fetchAlerts();
  }, [location]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await weatherApi.getAlerts(
        location.latitude,
        location.longitude,
        50 // 50 mile radius
      );
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      Alert.alert('Error', 'Failed to load weather alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const getAlertIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'extreme':
        return 'alert-octagon';
      case 'severe':
        return 'alert-circle';
      case 'moderate':
        return 'alert-circle-outline';
      default:
        return 'information';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'extreme':
        return '#FF3B30';
      case 'severe':
        return '#FF9500';
      case 'moderate':
        return '#FFCC00';
      default:
        return '#34C759';
    }
  };

  const renderAlert = ({ item }) => (
    <View style={[styles.alertCard, { borderLeftColor: getAlertColor(item.severity) }]}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTypeContainer}>
          <MaterialCommunityIcons
            name={getAlertIcon(item.severity)}
            size={24}
            color={getAlertColor(item.severity)}
          />
          <Text style={[styles.alertType, { color: getAlertColor(item.severity) }]}>
            {item.severity.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.alertTime}>
          Until {new Date(item.expires).toLocaleString()}
        </Text>
      </View>

      <Text style={styles.alertTitle}>{item.title}</Text>
      <Text style={styles.alertDescription}>{item.description}</Text>

      {item.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Safety Instructions:</Text>
          <Text style={styles.instructions}>{item.instructions}</Text>
        </View>
      )}

      <View style={styles.alertMeta}>
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
          <Text style={styles.locationText}>{item.area}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => Alert.alert('Alert Details', item.description)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const NoAlerts = () => (
    <View style={styles.noAlertsContainer}>
      <MaterialCommunityIcons name="weather-sunny" size={64} color="#34C759" />
      <Text style={styles.noAlertsText}>No active weather alerts</Text>
      <Text style={styles.noAlertsSubtext}>Pull down to refresh</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.alertsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={NoAlerts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  alertsList: {
    padding: 15,
    flexGrow: 1,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertType: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  instructionsContainer: {
    backgroundColor: '#FFF9C4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  instructionsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructions: {
    color: '#333',
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    color: '#666',
  },
  detailsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  noAlertsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAlertsText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
    color: '#34C759',
  },
  noAlertsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  }
});

export default WeatherAlertsScreen;