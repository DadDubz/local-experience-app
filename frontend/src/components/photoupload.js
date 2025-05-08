// frontend/src/components/PhotoUpload.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UploadService from '../services/uploadService';

const PhotoUpload = ({ onPhotoUploaded, folder = 'general' }) => {
  const [uploading, setUploading] = useState(false);
  const [photo, setPhoto] = useState(null);

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
        setUploading(true);
        try {
          const fileUrl = await UploadService.uploadFile({
            name: 'photo.jpg',
            type: 'image/jpeg',
            data: result.assets[0].uri
          }, folder);

          setPhoto(fileUrl);
          onPhotoUploaded && onPhotoUploaded(fileUrl);
        } catch (error) {
          Alert.alert('Upload Failed', 'Failed to upload photo. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error('Photo selection error:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };

  return (
    <View style={styles.container}>
      {uploading ? (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : photo ? (
        <View>
          <Image source={{ uri: photo }} style={styles.photo} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={handlePhotoSelect}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePhotoSelect}
        >
          <MaterialCommunityIcons name="camera-plus" size={32} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  uploadButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadingContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changeButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
PhotoUpload.propTypes = {
  onPhotoUploaded: PropTypes.func,
  folder: PropTypes.string,
};

export default PhotoUpload;