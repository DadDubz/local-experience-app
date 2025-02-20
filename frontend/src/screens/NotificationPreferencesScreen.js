// frontend/src/screens/NotificationPreferencesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import NotificationService from '../services/notificationService';

const NotificationPreferencesScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    weatherAlerts: true,
    dailyForecast: true,
    locationBasedAlerts: true,
    catchReports: true,
    fishingConditions: true,
    severityLevels: {
      extreme: true,
      severe: true,
      moderate: true,
      minor: false
    },
    alertTypes: {
      storm: true,
      flood: true,
      wind: true,
      temperature: true
    }
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Load user preferences from backend
      const response = await user.getNotificationPreferences();
      setPreferences(response.data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleToggle = async (key, category = null) => {
    try {
      setLoading(true);
      let newPreferences = { ...preferences };

      if (category) {
        newPreferences[category] = {
          ...newPreferences[category],
          [key]: !newPreferences[category][key]
        };
      } else {
        newPreferences[key] = !newPreferences[key];
      }

      // Update preferences in backend
      await user.updateNotificationPreferences(newPreferences);
      setPreferences(newPreferences);

      // Update notification settings
      if (newPreferences.weatherAlerts) {
        await NotificationService.registerForPushNotifications();
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const renderSwitch = (label, key, description = null, category = null) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={category ? preferences[category][key] : preferences[key]}
        onValueChange={() => handleToggle(key, category)}
        disabled={loading}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Notifications</Text>
        {renderSwitch(
          'Weather Alerts',
          'weatherAlerts',
          'Receive notifications about severe weather conditions'
        )}
        {renderSwitch(
          'Daily Forecast',
          'dailyForecast',
          'Get daily weather forecasts for your area'
        )}
        {renderSwitch(
          'Location-Based Alerts',
          'locationBasedAlerts',
          'Receive alerts based on your current location'
        )}
        {renderSwitch(
          'Catch Reports',
          'catchReports',
          'Get notified about new catch reports in your area'
        )}
        {renderSwitch(
          'Fishing Conditions',
          'fishingConditions',
          'Receive updates about optimal fishing conditions'
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Severity Levels</Text>
        {renderSwitch('Extreme Alerts', 'extreme', null, 'severityLevels')}
        {renderSwitch('Severe Alerts', 'severe', null, 'severityLevels')}
        {renderSwitch('Moderate Alerts', 'moderate', null, 'severityLevels')}
        {renderSwitch('Minor Alerts', 'minor', null, 'severityLevels')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Types</Text>
        {renderSwitch('Storm Alerts', 'storm', null, 'alertTypes')}
        {renderSwitch('Flood Warnings', 'flood', null, 'alertTypes')}
        {renderSwitch('Wind Advisories', 'wind', null, 'alertTypes')}
        {renderSwitch('Temperature Alerts', 'temperature', null, 'alertTypes')}
      </View>

      <TouchableOpacity
        style={styles.testButton}
        onPress={async () => {
          try {
            await NotificationService.scheduleWeatherAlert({
              title: 'Test Alert',
              description: 'This is a test weather alert notification.'
            });
            Alert.alert('Success', 'Test notification sent!');
          } catch (error) {
            Alert.alert('Error', 'Failed to send test notification');
          }
        }}
      >
        <MaterialCommunityIcons name="bell-ring" size={20} color="#fff" />
        <Text style={styles.testButtonText}>Send Test Notification</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop
