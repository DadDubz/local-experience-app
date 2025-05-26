import NativeMap from '@components/NativeMap.web';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

if (Platform.OS === 'web') 
  require('leaflet/dist/leaflet.css');
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons for Expo Web (Metro bundler)
// @ts-expect-error: _getIconUrl is a private property not typed in leaflet's types
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
