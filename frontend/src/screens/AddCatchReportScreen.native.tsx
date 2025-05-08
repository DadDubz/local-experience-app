// AddCatchReportScreen.native.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';

const AddCatchReportScreen: React.FC = () => {
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const submitReport = () => {
    console.log('Catch report submitted:', { species, location, notes });
    setSpecies(''); setLocation(''); setNotes('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Fish Species</Text>
      <TextInput value={species} onChangeText={setSpecies} style={styles.input} />
      <Text style={styles.label}>Location</Text>
      <TextInput value={location} onChangeText={setLocation} style={styles.input} />
      <Text style={styles.label}>Notes</Text>
      <TextInput value={notes} onChangeText={setNotes} style={styles.input} multiline numberOfLines={4} />
      <Button title="Submit Catch" onPress={submitReport} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});

export default AddCatchReportScreen;