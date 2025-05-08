// CatchReportDetailScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const report = {
  species: 'Brook Trout',
  location: 'Hidden Creek',
  notes: 'Caught early morning with spinnerbait.'
};

const CatchReportDetailScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Catch Report</Text>
    <Text><Text style={styles.label}>Species:</Text> {report.species}</Text>
    <Text><Text style={styles.label}>Location:</Text> {report.location}</Text>
    <Text><Text style={styles.label}>Notes:</Text> {report.notes}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  label: { fontWeight: 'bold' },
});

export default CatchReportDetailScreen;