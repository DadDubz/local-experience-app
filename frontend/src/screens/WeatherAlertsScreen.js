// frontend/src/screens/WeatherAlertsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationContext } from '../context/LocationContext';
import { weatherApi } from '../services/api';

const WeatherAlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { location } = useLocationContext();

  useEffect(() => {
    if (location) {
      fetchAlerts();
    }
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
      console.error('Error fetching weather alerts:', error);
      Alert.alert('Error', 'Failed to load weather alerts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
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
        return '#D32F2F';
      case 'severe':
        return '#F57C00';
      case 'moderate':
        return '#FDD835';
      default:
        return '#64B5F6';
    }
  };

  const renderAlert = (alert) => (
    <View
      key={alert.id}
      style={[
        styles.alertCard,
        { borderLeftColor: getAlertColor(alert.severity) }
      ]}
    >
      <View style={styles.alertHeader}>
        <View style={styles.severityContainer}>
          <MaterialCommunityIcons
            name={getAlertIcon(alert.severity)}
            size={24}
            color={getAlertColor(alert.severity)}
          />
          <Text style={[
            styles.severityText,
            { color: getAlertColor(alert.severity) }
          ]}>
            {alert.severity.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.alertTime}>
          {new Date(alert.time).toLocaleTimeString()}
        </Text>
      </View>

      <Text style={styles.alertTitle}>{alert.event}</Text>
      <Text style={styles.alertDescription}>{alert.description}</Text>

      <View style={styles.alertMeta}>
        <Text style={styles.alertArea}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
          {alert.area}
        </Text>
        <Text style={styles.alertDuration}>
          Until {new Date(alert.ends).toLocaleString()}
        </Text>
      </View>

      {alert.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Safety Instructions:</Text>
          <Text style={styles.instructions}>{alert.instructions}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {alerts.length > 0 ? (
        <View style={styles.alertsContainer}>
          {alerts.map(renderAlert)}
        </View>
      ) : (
        <View style={styles.noAlertsContainer}>
          <MaterialCommunityIcons
            name="weather-sunny"
            size={64}
            color="#4CAF50"
          />
          <Text style={styles.noAlertsText}>
            No active weather alerts for your area
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
  alertsContainer: {
    padding: 15,
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
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  alertTime: {
    color: '#666',
    fontSize: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 24,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  alertArea: {
    color: '#666',
    fontSize: 14,
  },
  alertDuration: {
    color: '#666',
    fontSize: 14,
  },
  instructionsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
  },
  instructionsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  instructions: {
    color: '#333',
    lineHeight: 20,
  },
  noAlertsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  noAlertsText: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WeatherAlertsScreen;
