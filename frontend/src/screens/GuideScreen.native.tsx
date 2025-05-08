// GuideScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NativeMap from '@components/NativeMap';

const guideArea = {
  name: 'Chippewa River Guide Zone',
  latitude: 44.941,
  longitude: -91.397,
  description: 'Where guides are currently available.'
};

const GuideScreen: React.FC = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>{guideArea.name}</Text>
    <Text style={styles.description}>{guideArea.description}</Text>
    <NativeMap spot={guideArea} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  description: { fontSize: 16, marginBottom: 16 },
});

export default GuideScreen;