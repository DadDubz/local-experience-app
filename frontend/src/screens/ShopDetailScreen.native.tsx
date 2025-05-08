// ShopDetailScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NativeMap from '../../components/NativeMap';

const shop = {
  name: 'Bait & Tackle Pro',
  latitude: 44.942,
  longitude: -91.398,
  description: 'Your one-stop shop for fishing gear and tips.'
};

const ShopDetailScreen: React.FC = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>{shop.name}</Text>
    <Text style={styles.description}>{shop.description}</Text>
    <NativeMap spot={shop} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  description: { fontSize: 16, marginBottom: 16 },
});

export default ShopDetailScreen;