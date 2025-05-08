// LocationDetailScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NativeMap from '@components/NativeMap';

const location = {
  name: 'Old Mill Park',
  latitude: 44.937,
  longitude: -91.391,
  description: 'Historic riverside location with great trails.'
};

const LocationDetailScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>{location.name}</Text>
    <Text style={styles.description}>{location.description}</Text>
    <NativeMap spot={location} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  description: { fontSize: 16, marginBottom: 12 },
});

export default LocationDetailScreen;
