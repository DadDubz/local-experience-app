import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FishingConditionsProps {
  windSpeed: string;
  airQuality: string;
  waterTemp: string;
  biteTime: string;
}

const FishingConditionsPanel: React.FC<FishingConditionsProps> = ({
  windSpeed,
  airQuality,
  waterTemp,
  biteTime
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fishing Conditions</Text>
      <Text>Wind Speed: {windSpeed}</Text>
      <Text>Air Quality: {airQuality}</Text>
      <Text>Water Temp: {waterTemp}</Text>
      <Text>Bite Time: {biteTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default FishingConditionsPanel;