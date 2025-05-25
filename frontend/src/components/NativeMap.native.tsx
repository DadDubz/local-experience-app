// src/components/NativeMap.native.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const NativeMap = ({ spot }: { spot: Spot }) => (
  <View style={styles.mapContainer}>
    <MapView
  style={styles.map}
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
  mapContainer: { height: 300, width: '100%' },
  map: { ...StyleSheet.absoluteFillObject },
});

export default NativeMap;


