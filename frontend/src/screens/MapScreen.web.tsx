import NativeMap from '@components/NativeMap.web';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
}

const MapScreen = () => {
  const spot = {
    latitude: 44.9362,
    longitude: -91.3925,
    name: 'Chippewa Falls',
  };

  return (
    <View style={styles.container}>
      <NativeMap spot={spot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default MapScreen;
