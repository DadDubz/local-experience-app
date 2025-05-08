// frontend/src/screens/MarineConditionsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationContext } from '../context/LocationContext';
import { weatherApi } from '../services/api';

const MarineConditionsScreen = () => {
  const [marineData, setMarineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { location } = useLocationContext();

  useEffect(() => {
    if (location) {
      fetchMarineConditions();
    }
  }, [location]);

  const fetchMarineConditions = async () => {
    try {
      setLoading(true);
      const response = await weatherApi.getMarineConditions(
        location.latitude,
        location.longitude
      );
      setMarineData(response.data);
    } catch (error) {
      console.error('Error fetching marine conditions:', error);
      Alert.alert('Error', 'Failed to load marine conditions');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMarineConditions();
    setRefreshing(false);
  };

  const getTideDirection = (tideData) => {
    if (tideData.type === 'rising') {
      return 'arrow-up';
    }
    return 'arrow-down';
  };

  const getWaveHeightColor = (height) => {
    if (height < 2) return '#4CAF50';
    if (height < 4) return '#FFC107';
    if (height < 6) return '#FF9800';
    return '#F44336';
  };

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
      {marineData && (
        <>
          {/* Current Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Conditions</Text>
            <View style={styles.conditionsGrid}>
              <View style={styles.conditionItem}>
                <MaterialCommunityIcons name="thermometer" size={32} color="#666" />
                <Text style={styles.conditionValue}>
                  {marineData.waterTemp}°F
                </Text>
                <Text style={styles.conditionLabel}>Water Temp</Text>
              </View>

              <View style={styles.conditionItem}>
                <MaterialCommunityIcons name="waves" size={32} color="#666" />
                <Text style={styles.conditionValue}>
                  {marineData.waveHeight}ft
                </Text>
                <Text style={styles.conditionLabel}>Wave Height</Text>
              </View>

              <View style={styles.conditionItem}>
                <MaterialCommunityIcons name="weather-windy" size={32} color="#666" />
                <Text style={styles.conditionValue}>
                  {marineData.windSpeed}mph
                </Text>
                <Text style={styles.conditionLabel}>Wind Speed</Text>
              </View>

              <View style={styles.conditionItem}>
                <MaterialCommunityIcons name="compass" size={32} color="#666" />
                <Text style={styles.conditionValue}>
                  {marineData.windDirection}°
                </Text>
                <Text style={styles.conditionLabel}>Wind Direction</Text>
              </View>
            </View>
          </View>

          {/* Tide Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tide Schedule</Text>
            {marineData.tides.map((tide, index) => (
              <View key={index} style={styles.tideItem}>
                <MaterialCommunityIcons
                  name={getTideDirection(tide)}
                  size={24}
                  color="#666"
                />
                <View style={styles.tideInfo}>
                  <Text style={styles.tideType}>
                    {tide.type.charAt(0).toUpperCase() + tide.type.slice(1)} Tide
                  </Text>
                  <Text style={styles.tideTime}>
                    {new Date(tide.time).toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.tideHeight}>{tide.height}ft</Text>
              </View>
            ))}
          </View>

          {/* Wave Forecast */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wave Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {marineData.waveForecast.map((forecast, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveForecastItem,
                    { borderLeftColor: getWaveHeightColor(forecast.height) }
                  ]}
                >
                  <Text style={styles.forecastTime}>
                    {new Date(forecast.time).toLocaleTimeString()}
                  </Text>
                  <Text style={styles.waveHeight}>{forecast.height}ft</Text>
                  <Text style={styles.wavePeriod}>
                    Period: {forecast.period}s
                  </Text>
                  <Text style={styles.waveDirection}>
                    {forecast.direction}°
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Water Quality */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Water Quality</Text>
            <View style={styles.qualityGrid}>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityLabel}>Visibility</Text>
                <Text style={styles.qualityValue}>
                  {marineData.waterQuality.visibility}ft
                </Text>
              </View>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityLabel}>Salinity</Text>
                <Text style={styles.qualityValue}>
                  {marineData.waterQuality.salinity}ppt
                </Text>
              </View>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityLabel}>Dissolved Oxygen</Text>
                <Text style={styles.qualityValue}>
                  {marineData.waterQuality.oxygen}mg/L
                </Text>
              </View>
            </View>
          </View>
        </>
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
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conditionItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  conditionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  conditionLabel: {
    color: '#666',
  },
  tideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tideInfo: {
    flex: 1,
    marginLeft: 10,
  },
  tideType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tideTime: {
    color: '#666',
  },
  tideHeight: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  waveForecastItem: {
    width: 120,
    padding: 15,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 1,
  },
  forecastTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  waveHeight: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  wavePeriod: {
    fontSize: 14,
    color: '#666',
  },
  waveDirection: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  qualityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  qualityLabel: {
    color: '#666',
    marginBottom: 5,
  },
  qualityValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MarineConditionsScreen;