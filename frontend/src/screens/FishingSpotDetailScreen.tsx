import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { weatherApi, reportsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MapComponent = Platform.OS === 'web' ? require('../components/LeafletMap').default : require('../components/NativeMap').default;





import { StackScreenProps } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type RootStackParamList = {
  FishingSpotDetail: { spot: { id: string; name: string; latitude: number; longitude: number; type: string; description: string; requiredLicenses?: string[]; species?: string[] } };
  AddCatchReport: { spotId: string };
};

type Props = StackScreenProps<RootStackParamList, 'FishingSpotDetail'>;

const FishingSpotDetailScreen = ({ route, navigation }: Props) => {
  const { spot } = route.params;
  const { user } = useAuth();
  const [weather, setWeather] = useState<any>(null);
  const [catchReports, setCatchReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waterConditions, setWaterConditions] = useState<any>(null);
  const window = useWindowDimensions();

  useEffect(() => {
    fetchSpotData();
  }, []);

  const fetchSpotData = async () => {
    try {
      setLoading(true);

      const weatherData = await weatherApi.getCurrentWeather(spot.latitude, spot.longitude);
      const marineData = await weatherApi.getMarineConditions(spot.latitude, spot.longitude);
      const reportsData = await reportsApi.getLocationReports(spot.id);

      setWeather(weatherData);
      setWaterConditions(marineData);
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
      const { MapContainer, TileLayer, Marker: LeafletMarker, Popup } = require('react-leaflet');
      return (
        <View style={styles.mapContainer}>
          <MapContainer
            center={[spot.latitude, spot.longitude]}
            zoom={13}
            style={{ height: 250, width: window.width - 30 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LeafletMarker position={[spot.latitude, spot.longitude]}>
              <Popup>{spot.name}</Popup>
            </LeafletMarker>
          </MapContainer>
        </View>
      );
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
          <Marker coordinate={{ latitude: spot.latitude, longitude: spot.longitude }} title={spot.name} />
        </MapView>
      </View>
    );
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
                <Text style={styles.speciesName}>{fish}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addReportButton} onPress={handleAddReport}>
        <Text style={styles.addReportText}>Add Catch Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapContainer: { margin: 15, borderRadius: 10, overflow: 'hidden' },
  map: { height: 250, width: '100%' },
  infoSection: { padding: 20 },
  spotName: { fontSize: 24, fontWeight: 'bold' },
  spotType: { fontSize: 16, color: '#666', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 20 },
  section: { marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  licenseItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  licenseText: { marginLeft: 10, fontSize: 16 },
  speciesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  speciesItem: { marginRight: 10, marginBottom: 10 },
  speciesName: { fontSize: 16, color: '#333' },
  addReportButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  addReportText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default FishingSpotDetailScreen;
