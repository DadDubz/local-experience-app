// src/components/NativeMap.native.tsx
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const NativeMap = ({ spot }: { spot: Spot }) => (
  <View style={styles.container}>
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: spot.latitude,
        longitude: spot.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker coordinate={{ latitude: spot.latitude, longitude: spot.longitude }} title={spot.name} />
    </MapView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    width: '100%',
  },
});

export default NativeMap;
