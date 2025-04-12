import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Share
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { landsApi, weatherApi, reportsApi } from '../services/api';

const LocationDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [weather, setWeather] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      // Fetch location details
      const detailsResponse = await landsApi.getLocationDetails(location.id);
      setDetails(detailsResponse.data);

      // Fetch current weather
      const weatherResponse = await weatherApi.getCurrentWeather(
        location.FacilityLatitude,
        location.FacilityLongitude
      );
      setWeather(weatherResponse.data);

      // Fetch recent reports
      const reportsResponse = await reportsApi.getLocationReports(location.id);
      setReports(reportsResponse.data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${location.FacilityName} on Local Experience App!`,
        url: `https://localexp.app/location/${location.id}`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddReport = () => {
    navigation.navigate('AddReport', { locationId: location.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{location.FacilityName}</Text>
        <Text style={styles.subtitle}>{location.FacilityTypeDescription}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <MaterialCommunityIcons name="share" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>

          {user && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddReport}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Add Report</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Weather Section */}
      {weather && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Weather</Text>
          <View style={styles.weatherContainer}>
            <Text style={styles.temperature}>{weather.current.temp}°F</Text>
            <Text style={styles.weatherDescription}>
              {weather.current.weather[0].description}
            </Text>
            <Text>Wind: {weather.current.wind_speed} mph</Text>
            <Text>Humidity: {weather.current.humidity}%</Text>
          </View>
        </View>
      )}

      {/* Details Section */}
      {details && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <Text>{details.FacilityDescription}</Text>
          <Text style={styles.detailText}>
            <MaterialCommunityIcons name="directions" size={18} color="#666" />
            {details.FacilityDirections}
          </Text>
          {details.FacilityPhone && (
            <Text style={styles.detailText}>
              <MaterialCommunityIcons name="phone" size={18} color="#666" />
              {details.FacilityPhone}
            </Text>
          )}
        </View>
      )}

      {/* Recent Reports Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <Text style={styles.reportUser}>{report.user.name}</Text>
              <Text style={styles.reportDate}>
                {new Date(report.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.reportContent}>{report.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noReports}>No reports yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    color: '#007AFF',
    marginTop: 5,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weatherDescription: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  reportCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reportUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  reportContent: {
    fontSize: 16,
  },
  noReports: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});

export default LocationDetailScreen;
