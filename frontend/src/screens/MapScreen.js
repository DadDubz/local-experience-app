// src/screens/MapScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PublicLandsMap from '../components/PublicLandsMap';

const MapScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <PublicLandsMap navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;