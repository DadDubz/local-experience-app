// src/screens/FishingSpotDetailScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NativeMap from '@components/NativeMap.native';

interface Spot {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

const spot: Spot = {
  name: 'Hidden Creek',
  latitude: 44.9362,
  longitude: -91.3925,
  description: 'A peaceful trout stream in the woods.'
};

const FishingSpotDetailScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{spot.name}</Text>
      <Text style={styles.description}>{spot.description}</Text>
      <NativeMap spot={spot} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 16 },
});

export default FishingSpotDetailScreen;