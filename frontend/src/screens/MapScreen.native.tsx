// MapScreen.native.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import NativeMap from '@components/NativeMap';

const region = {
  name: 'Explore Area',
  latitude: 44.938,
  longitude: -91.395,
  description: 'Interactive view of fishing and hiking spots.'
};

const MapScreen: React.FC = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.header}>{region.name}</Text>
    <Text>{region.description}</Text>
    <NativeMap spot={region} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
});

export default MapScreen;