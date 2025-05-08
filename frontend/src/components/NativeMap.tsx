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


// src/components/NativeMap.web.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const NativeMap = ({ spot }: { spot: Spot }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([spot.latitude, spot.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([spot.latitude, spot.longitude])
      .addTo(map)
      .bindPopup(`<b>${spot.name}</b>`) 
      .openPopup();

    return () => {
      map.remove();
    };
  }, [spot.latitude, spot.longitude, spot.name]);

  return <div ref={mapRef} style={{ height: '300px', width: '100%' }} />;
};

export default NativeMap;
