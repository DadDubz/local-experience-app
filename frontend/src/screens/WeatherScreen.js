import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { weatherApi } from '../services/api';
import { useLocation } from '../hooks/useLocation';

const WeatherScreen = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchWeather = async () => {
    try {
      const response = await weatherApi.getCurrentWeather(
        location.latitude,
        location.longitude
      );
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.title}>Current Weather</Text>
          <Text style={styles.temperature}>{weather.current.temp}°F</Text>
          <Text style={styles.description}>{weather.current.weather[0].description}</Text>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Humidity: {weather.current.humidity}%</Text>
            <Text style={styles.detailText}>Wind: {weather.current.wind_speed} mph</Text>
            <Text style={styles.detailText}>
              UV Index: {weather.current.uvi}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};