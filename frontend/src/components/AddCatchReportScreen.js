// frontend/src/screens/AddCatchReportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import PhotoUpload from '../components/PhotoUpload';
import { reportsApi } from '../services/api';

const AddCatchReportScreen = ({ route, navigation }) => {
  const { locationId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [report, setReport] = useState({
    species: '',
    weight: '',
    length: '',
    date: new Date(),
    time: new Date(),
    bait: '',
    weather: '',
    waterConditions: '',
    notes: '',
    photos: []
  });

  const handleSubmit = async () => {
    if (!report.species || !report.length || !report.weight) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Create form data for photos
      const formData = new FormData();
      report.photos.forEach((photo, index) => {
        formData.append('photos', {
          uri: photo,
          type: 'image/jpeg',
          name: `catch_${index}.jpg`
        });
      });

      // Add other report data
      Object.keys(report).forEach(key => {
        if (key !== 'photos') {
          formData.append(key, report[key]);
        }
      });

      formData.append('locationId', locationId);
      formData.append('userId', user.id);

      await reportsApi.submitCatchReport(formData);

      Alert.alert(
        'Success',
        'Catch report submitted successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Submit report error:', error);
      Alert.alert('Error', 'Failed to submit catch report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Catch Report</Text>
      </View>

      {/* Species Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fish Details</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="fish" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Species *"
            value={report.species}
            onChangeText={(text) => setReport({ ...report, species: text })}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <MaterialCommunityIcons name="scale" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Weight (lbs) *"
              value={report.weight}
              onChangeText={(text) => setReport({ ...report, weight: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <MaterialCommunityIcons name="ruler" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Length (in) *"
              value={report.length}
              onChangeText={(text) => setReport({ ...report, length: text })}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Catch Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catch Details</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialCommunityIcons name="calendar" size={24} color="#666" />
          <Text style={styles.dateButtonText}>
            {report.date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="fishing" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Bait/Lure Used"
            value={report.bait}
            onChangeText={(text) => setReport({ ...report, bait: text })}
          />
        </View>
      </View>

      {/* Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conditions</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Weather Conditions"
            value={report.weather}
            onChangeText={(text) => setReport({ ...report, weather: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="waves" size={24} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Water Conditions"
            value={report.waterConditions}
            onChangeText={(text) => setReport({ ...report, waterConditions: text })}
          />
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          placeholder="Add any additional details about your catch..."
          value={report.notes}
          onChangeText={(text) => setReport({ ...report, notes: text })}
        />
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photoGrid}>
          <PhotoUpload
            onPhotoSelected={(photo) => {
              setReport({
                ...report,
                photos: [...report.photos, photo]
              });
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={report.date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setReport({ ...report, date: selectedDate });
            }
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  notesInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default AddCatchReportScreen;
