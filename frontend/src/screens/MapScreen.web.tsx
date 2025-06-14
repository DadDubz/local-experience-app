import React from 'react';
import { View, StyleSheet } from 'react-native';
// Update the import path to the correct relative path


// ✅ Apply Leaflet CSS and fix icon issues
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LeafletMap from '@components/LeafletMap.web';

// Fix broken Leaflet icon URLs in Expo Web
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapScreen = () => {
  const spot = {
    latitude: 44.9362,
    longitude: -91.3925,
    name: 'Chippewa Falls',
  };

  return (
    <View style={styles.container}>
      <LeafletMap spot={spot} />
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
