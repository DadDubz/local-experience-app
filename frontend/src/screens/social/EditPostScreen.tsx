import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EditPostScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // Define the type for route.params
    const { post } = route.params as { post: { caption: string; location: string; image: string; _id: string } };

  const [caption, setCaption] = useState(post.caption);
  const [location, setLocation] = useState(post.location);
  const [imageUri, setImageUri] = useState(post.image);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!caption || !imageUri) {
      alert("Please provide both a caption and image.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("location", location);

      if (imageUri !== post.image) {
        const imageFile = {
          uri: imageUri,
          name: 'updated.jpg',
          type: 'image/jpeg',
        } as any;

        formData.append("image", imageFile);
      }

      await axios.put(`http://your-api-url/api/posts/${post._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert("Success", "Post updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Could not update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Edit Post</Text>

        <TextInput
          style={styles.input}
          placeholder="Caption"
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Location (optional)"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.disabledButton]}
          onPress={handleUpdate}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Updating...' : 'Update Post'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  imagePicker: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditPostScreen;
