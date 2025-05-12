import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { StackNavigationProp } from '@react-navigation/stack';

type CreatePostScreenNavigationProp = StackNavigationProp<any>;

const CreatePostScreen = ({ navigation }: { navigation: CreatePostScreenNavigationProp }) => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
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

  const handleSubmit = async () => {
    if (!caption || !imageUri) {
      alert("Please add a caption and image.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("location", location);
      const imageFile = {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any;

      formData.append("image", imageFile);

      await axios.post("http://your-api-url/api/posts", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Post created successfully!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      alert("Error creating post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Create a Post</Text>

        <TextInput
          style={styles.input}
          placeholder="Write a caption..."
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
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Pick an image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Posting...' : 'Post'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
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
  imageText: {
    color: '#888',
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

export default CreatePostScreen;
