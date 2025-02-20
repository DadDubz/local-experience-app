import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useAuth } from '../context/AuthContext';
import { weatherApi } from '../services/api';

const TrailDetailScreen = ({ route, navigation }) => {
  const { trail } = route.params;
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchTrailData();
  }, []);

  const fetchTrailData = async () => {
    try {
      setLoading(true);
      // Fetch weather for trail location
      const weatherData = await weatherApi.getCurrentWeather(
        trail.latitude,
        trail.longitude
      );
      setWeather(weatherData);

      // Add more data fetching as needed (reviews, conditions, etc.)
      
    } catch (error) {
      console.error('Error fetching trail data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#4CAF50';
      case 'moderate':
        return '#FFC107';
      case 'difficult':
        return '#F44336';
      default:
        return '#757575';
    }
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
      {/* Trail Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: trail.latitude,
            longitude: trail.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: trail.latitude,
              longitude: trail.longitude
            }}
            title={trail.name}
          />
          {trail.path && (
            <Polyline
              coordinates={trail.path}
              strokeColor="#000"
              strokeWidth={2}
            />
          )}
        </MapView>
      </View>

      {/* Trail Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.trailName}>{trail.name}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker-distance" size={24} color="#666" />
            <Text style={styles.statText}>{trail.length} miles</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="trending-up" size={24} color="#666" />
            <Text style={styles.statText}>{trail.elevation} ft gain</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#666" />
            <Text style={styles.statText}>{trail.duration}</Text>
          </View>
        </View>

        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(trail.difficulty) }]}>
          <Text style={styles.difficultyText}>{trail.difficulty}</Text>
        </View>

        <Text style={styles.description}>{trail.description}</Text>
      </View>

      {/* Current Conditions Section */}
      {weather && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Conditions</Text>
          <View style={styles.conditionsContainer}>
            <View style={styles.weatherItem}>
              <MaterialCommunityIcons name="weather-sunny" size={24} color="#666" />
              <Text style={styles.weatherText}>{weather.current.temp}°F</Text>
            </View>
            <View style={styles.weatherItem}>
              <MaterialCommunityIcons name="water" size={24} color="#666" />
              <Text style={styles.weatherText}>{weather.current.humidity}% Humidity</Text>
            </View>
            <View style={styles.weatherItem}>
              <MaterialCommunityIcons name="weather-windy" size={24} color="#666" />
              <Text style={styles.weatherText}>{weather.current.wind_speed} mph</Text>
            </View>
          </View>
        </View>
      )}

      {/* Recent Reviews Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {user && (
            <TouchableOpacity 
              style={styles.addReviewButton}
              onPress={() => navigation.navigate('AddReview', { trailId: trail.id })}
            >
              <Text style={styles.addReviewText}>Add Review</Text>
            </TouchableOpacity>
          )}
        </View>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        ))}
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
  mapContainer: {
    height: 300,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoSection: {
    padding: 20,
  },
  trailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    marginTop: 5,
    color: '#666',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  difficultyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  conditionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherText: {
    marginTop: 5,
    color: '#333',
  },
  addReviewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewerName: {
    fontWeight: 'bold',
  },
  reviewDate: {
    color: '#666',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TrailDetailScreen;