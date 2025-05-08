// CampingScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NativeMap from '@components/NativeMap';

const campingSpot = {
  name: 'Whispering Pines Campground',
  latitude: 44.935,
  longitude: -91.39,
  description: 'Great spot for weekend camping with family.'
};

const CampingScreen: React.FC = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>{campingSpot.name}</Text>
    <Text style={styles.description}>{campingSpot.description}</Text>
    <NativeMap spot={campingSpot} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 16 },
});

export default CampingScreen;