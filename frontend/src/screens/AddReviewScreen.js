// frontend/src/screens/AddReviewScreen.js
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import PhotoUpload from '../components/PhotoUpload';

const AddReviewScreen = ({ route, navigation }) => {
  const { locationId, locationType } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    text: '',
    photos: [],
    visitDate: new Date(),
    difficulty: null, // for trails only
    fishCaught: null, // for fishing spots only
    conditions: null // for weather conditions
  });

  const handleSubmit = async () => {
    if (review.rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!review.text.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    try {
      setLoading(true);

      // Upload photos first if any
      const photoUrls = await Promise.all(
        review.photos.map(photo => uploadPhoto(photo))
      );

      // Submit review
      await submitReview({
        ...review,
        photos: photoUrls,
        locationId,
        userId: user.id
      });

      Alert.alert(
        'Success',
        'Review submitted successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Submit review error:', error);
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setReview({ ...review, rating: star })}
        >
          <MaterialCommunityIcons
            name={star <= review.rating ? 'star' : 'star-outline'}
            size={40}
            color={star <= review.rating ? '#FFC107' : '#ccc'}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTrailFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trail Difficulty</Text>
      <View style={styles.difficultyButtons}>
        {['Easy', 'Moderate', 'Hard'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.difficultyButton,
              review.difficulty === level && styles.difficultyButtonActive
            ]}
            onPress={() => setReview({ ...review, difficulty: level })}
          >
            <Text style={[
              styles.difficultyButtonText,
              review.difficulty === level && styles.difficultyButtonTextActive
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFishingFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fishing Details</Text>
      <View style={styles.fishingDetails}>
        <TextInput
          style={styles.input}
          placeholder="What did you catch?"
          value={review.fishCaught}
          onChangeText={(text) => setReview({ ...review, fishCaught: text })}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Write a Review</Text>
      </View>

      {renderStarRating()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Review</Text>
        <TextInput
          style={styles.reviewInput}
          multiline
          numberOfLines={4}
          placeholder="Share your experience..."
          value={review.text}
          onChangeText={(text) => setReview({ ...review, text })}
        />
      </View>

      {locationType === 'trail' && renderTrailFields()}
      {locationType === 'fishing' && renderFishingFields()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Photos</Text>
        <View style={styles.photoGrid}>
          {review.photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => {
                  const newPhotos = [...review.photos];
                  newPhotos.splice(index, 1);
                  setReview({ ...review, photos: newPhotos });
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          {review.photos.length < 5 && (
            <PhotoUpload
              onPhotoSelected={(photo) => {
                setReview({
                  ...review,
                  photos: [...review.photos, photo]
                });
              }}
            />
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  reviewInput: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  photoContainer: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidde
