import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Screen</Text>
      <Text>This is a placeholder for weather data.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default WeatherScreen;
