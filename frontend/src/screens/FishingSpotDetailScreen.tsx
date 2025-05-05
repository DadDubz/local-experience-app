import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { weatherApi, reportsApi } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  FishingSpotDetail: { spot: { id: string; name: string; latitude: number; longitude: number; type: string; description: string; requiredLicenses?: string[]; species?: string[]; amenities?: string[] } };
  AddCatchReport: { spotId: string };
};

type FishingSpotDetailScreenRouteProp = RouteProp<RootStackParamList, 'FishingSpotDetail'>;
type FishingSpotDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FishingSpotDetail'>;

const FishingSpotDetailScreen = ({ route, navigation }: { route: FishingSpotDetailScreenRouteProp; navigation: FishingSpotDetailScreenNavigationProp }) => {
  const { spot } = route.params;
  const { user } = useAuth();
  interface WeatherData {
    current: {
      wind_speed: number;
      [key: string]: any; // Add other properties as needed
    };
  }
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  interface CatchReport {
    user: { name: string };
    createdAt: string;
    species: string;
    size: number;
    weight: number;
    notes: string;
  }

  const [catchReports, setCatchReports] = useState<CatchReport[]>([]);
  const [loading, setLoading] = useState(true);
  interface WaterConditions {
    waterTemp: number;
    waterLevel: number;
    [key: string]: any; // Add other properties as needed
  }

  const [waterConditions, setWaterConditions] = useState<WaterConditions | null>(null);

  useEffect(() => {
    fetchSpotData();
  }, []);

  const fetchSpotData = async () => {
    try {
      const marineData = await weatherApi.getMarineConditions(spot.latitude, spot.longitude);
      setWaterConditions(marineData.data);
      const weatherData = await weatherApi.getCurrentWeather(spot.latitude, spot.longitude);
      const reportsData = await reportsApi.getLocationReports(spot.id);

      setWeather(weatherData.data);
      setWaterConditions(marineData.data);
      setCatchReports(reportsData.data);
    } catch (error) {
      console.error('Error fetching spot data:', error);
      Alert.alert('Error', 'Failed to load fishing spot data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = () => {
    navigation.navigate('AddCatchReport', { spotId: spot.id });
  };

  const renderMap = () => {
    if (Platform.OS === 'web') {
      const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');
      return (
        <View style={styles.mapContainer}>
          <MapContainer
            center={[spot.latitude, spot.longitude]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: 300, width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[spot.latitude, spot.longitude]}>
              <Popup>{spot.name}</Popup>
            </Marker>
          </MapContainer>
        </View>
      );
    } else {
      const { default: MapView, Marker } = require('react-native-maps');
      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: spot.latitude,
              longitude: spot.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
              title={spot.name}
            />
          </MapView>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderMap()}

      <View style={styles.infoSection}>
        <Text style={styles.spotName}>{spot.name}</Text>
        <Text style={styles.spotType}>{spot.type}</Text>
        <Text style={styles.description}>{spot.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Licenses</Text>
          {spot.requiredLicenses?.map((license, index) => (
            <View key={index} style={styles.licenseItem}>
              <MaterialCommunityIcons name="certificate" size={20} color="#666" />
              <Text style={styles.licenseText}>{license}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Species</Text>
          <View style={styles.speciesGrid}>
            {spot.species?.map((fish, index) => (
              <View key={index} style={styles.speciesItem}>
                <MaterialCommunityIcons name="fish" size={24} color="#666" />
                <Text style={styles.speciesName}>{fish}</Text>
              </View>
            ))}
          </View>
        </View>

        {weather && waterConditions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Conditions</Text>
            <View style={styles.conditionsContainer}>
              <View style={styles.conditionItem}>
                <MaterialCommunityIcons name="thermometer" size={24} color="#666" />
                <Text style={styles.conditionText}>
                  Water Temp: {waterConditions.waterTemp}°F
                </Text>
              </View>
              <View style={styles.conditionItem}>
                <MaterialCommunityIcons name="waves" size={24} color="#666" />
                <Text style={styles.conditionText}>
                  Water Level: {waterConditions.waterLevel} ft
                </Text>
              </View>
              <View style={styles.conditionItem}>
                <MaterialCommunityIcons name="weather-windy" size={24} color="#666" />
                <Text style={styles.conditionText}>
                  Wind: {weather.current.wind_speed} mph
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Catches</Text>
            {user && (
              <TouchableOpacity style={styles.addReportButton} onPress={handleAddReport}>
                <Text style={styles.addReportText}>Add Report</Text>
              </TouchableOpacity>
            )}
          </View>

          {catchReports.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reporterName}>{report.user.name}</Text>
                <Text style={styles.reportDate}>
                  {new Date(report.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.catchDetails}>
                <Text style={styles.speciesCaught}>{report.species}</Text>
                <Text style={styles.catchStats}>
                  Size: {report.size}" • Weight: {report.weight} lbs
                </Text>
              </View>
              <Text style={styles.reportNotes}>{report.notes}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Amenities</Text>
          {spot.amenities?.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapContainer: { height: 300, width: '100%' },
  map: { ...StyleSheet.absoluteFillObject },
  infoSection: { padding: 20 },
  spotName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  spotType: { fontSize: 16, color: '#666', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 20 },
  section: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  licenseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  licenseText: { marginLeft: 10, fontSize: 16, color: '#333' },
  speciesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  speciesItem: { width: '33%', alignItems: 'center', marginBottom: 15 },
  speciesName: { marginTop: 5, textAlign: 'center' },
  conditionsContainer: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10 },
  conditionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  conditionText: { marginLeft: 10, fontSize: 16 },
  addReportButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReportText: { color: '#fff', fontWeight: 'bold' },
  reportCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  reporterName: { fontWeight: 'bold' },
  reportDate: { color: '#666' },
  catchDetails: { marginBottom: 10 },
  speciesCaught: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  catchStats: { color: '#666' },
  reportNotes: { fontSize: 14, color: '#333' },
  amenityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  amenityText: { marginLeft: 10, fontSize: 16, color: '#333' },
});

export default FishingSpotDetailScreen;
