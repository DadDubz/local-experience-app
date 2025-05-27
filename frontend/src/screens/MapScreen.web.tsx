import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

if (Platform.OS === 'web') {
  require('leaflet/dist/leaflet.css');
  const L = require('leaflet');

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
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

// Dummy NativeMap component for web (replace with actual implementation if available)
const NativeMap = ({ spot }: { spot: { latitude: number; longitude: number; name: string } }) => {
  return (
    <div>
      <p>Map placeholder for {spot.name} ({spot.latitude}, {spot.longitude})</p>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default MapScreen;
