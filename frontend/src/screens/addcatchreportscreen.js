// frontend/src/screens/AddCatchReportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import PhotoUpload from '../components/PhotoUpload';
import { reportsApi } from '../services/api';

const AddCatchReportScreen = ({ navigation, route }) => {
  const { locationId } = route.params;
  const [report, setReport] = useState({
    species: '',
    length: '',
    weight: '',
    notes: '',
    photoUrl: null
  });

  const handleSubmit = async () => {
    try {
      if (!report.species || !report.photoUrl) {
        Alert.alert('Missing Information', 'Please provide species and photo');
        return;
      }

      await reportsApi.submitReport({
        locationId,
        ...report
      });

      Alert.alert(
        'Success',
        'Report submitted successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit report');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Catch Report</Text>

      <PhotoUpload
        onPhotoUploaded={(url) => setReport(prev => ({ ...prev, photoUrl: url }))}
        folder="catch-reports"
      />

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Species</Text>
          <TextInput
            style={styles.input}
            value={report.species}
            onChangeText={(text) => setReport(prev => ({ ...prev, species: text }))}
            placeholder="Enter fish species"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Length (inches)</Text>
            <TextInput
              style={styles.input}
              value={report.length}
              onChangeText={(text) => setReport(prev => ({ ...prev, length: text }))}
              keyboardType="numeric"
              placeholder="0.0"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Weight (lbs)</Text>
            <TextInput
              style={styles.input}
              value={report.weight}
              onChangeText={(text) => setReport(prev => ({ ...prev, weight: text }))}
              keyboardType="numeric"
              placeholder="0.0"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={report.notes}
            onChangeText={(text) => setReport(prev => ({ ...prev, notes: text }))}
            placeholder="Add any additional notes"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCatchReportScreen;