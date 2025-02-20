// frontend/src/components/WeatherDisplay.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WeatherService from '../services/weatherService';
import { useLocationContext } from '../context/LocationContext';

const WeatherDisplay = ({ onAlertPress }) => {
  const { location } = useLocationContext();
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const [weatherData, alertsData] = await Promise.all([
        WeatherService.getCurrentWeather(location.latitude, location.longitude),
        WeatherService.getWeatherAlerts(location.latitude, location.longitude)
      ]);

      setWeather(weatherData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Weather fetch error:', error);
      Alert.alert('Error', 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeatherData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!weather) {
    return null;
  }

  const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Current Weather */}
      <View style={styles.currentWeather}>
        <MaterialCommunityIcons
          name={WeatherService.getWeatherIcon(weather.current.condition, isNight)}
          size={64
