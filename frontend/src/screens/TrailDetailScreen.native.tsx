// TrailDetailScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NativeMap from '../../components/NativeMap';

const trail = {
  name: 'Eagle Ridge Trail',
  latitude: 44.94,
  longitude: -91.393,
  description: 'Scenic overlook trail with moderate elevation gain.'
};

const TrailDetailScreen: React.FC = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>{trail.name}</Text>
    <Text style={styles.description}>{trail.description}</Text>
    <NativeMap spot={trail} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 16 },
});

export default TrailDetailScreen;