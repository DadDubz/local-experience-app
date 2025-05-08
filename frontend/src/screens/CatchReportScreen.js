// frontend/src/screens/AddCatchReportScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { reportsApi } from '../services/api';

const AddCatchReportScreen = ({ route, navigation }) => {
  const { locationId } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    species: '',
    length: '',
    weight: '',
    bait: '',
    notes: '',
    date: new Date(),
    photos: []
  });

  const handlePhotoSelect = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setForm(prev => ({
          ...prev,
          photos: [...prev.photos, result.assets[0].uri]
        }));
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };

  const handleSubmit = async () => {
    if (!form.species || !form.length || !form.weight) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Create form data for photos
      const formData = new FormData();
      form.photos.forEach((photo, index) => {
        formData.append('photos', {
          uri: photo,
          type: 'image/jpeg',
          name: `photo${index}.jpg`
        });
      });

      // Add other form data
      Object.keys(form).forEach(key => {
        if (key !== 'photos') {
          formData.append(key, form[key]);
        }
      });

      formData.append('locationId', locationId);
      formData.append('userId', user.id);

      await reportsApi.submitReport(formData);

      Alert.alert(
        'Success',
        'Catch report submitted successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit catch report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Species Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Species *</Text>
          <TextInput
            style={styles.input}
            value={form.species}
            onChangeText={(text) => setForm(prev => ({ ...prev, species: text }))}
            placeholder="Enter fish species"
          />
        </View>

        {/* Size Inputs */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Length (inches) *</Text>
            <TextInput
              style={styles.input}
              value={form.length}
              onChangeText={(text) => setForm(prev => ({ ...prev, length: text }))}
              keyboardType="numeric"
              placeholder="0.0"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Weight (lbs) *</Text>
            <TextInput
              style={styles.input}
              value={form.weight}
              onChangeText={(text) => setForm(prev => ({ ...prev, weight: text }))}
              keyboardType="numeric"
              placeholder="0.0"
            />
          </View>
        </View>

        {/* Bait Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bait</Text>
          <TextInput
            style={styles.input}
            value={form.bait}
            onChangeText={(text) => setForm(prev => ({ ...prev, bait: text }))}
            placeholder="Enter bait used (optional)"
          />
        </View>

        {/* Notes Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={form.notes}
            onChangeText={(text) => setForm(prev => ({ ...prev, notes: text }))}
            placeholder="Additional notes (optional)"
            multiline
          />
        </View>

        {/* Photos Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photosContainer}>
            {form.photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.photo} />
            ))}
            <TouchableOpacity onPress={handlePhotoSelect} style={styles.photoPicker}>
              <MaterialCommunityIcons name="camera-plus" size={30} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  form: {
    flex: 1
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4
  },
  photoPicker: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 8
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default AddCatchReportScreen;