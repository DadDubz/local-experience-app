// frontend/src/screens/GuideDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { GuideService } from '../services/api';

const GuideDetailScreen = ({ route, navigation }) => {
  const { guideId } = route.params;
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuideDetails();
  }, []);

  const fetchGuideDetails = async () => {
    try {
      setLoading(true);
      const [guideDetails, guideAvailability, guideReviews] = await Promise.all([
        GuideService.getGuideDetails(guideId),
        GuideService.getGuideAvailability(guideId),
        GuideService.getGuideReviews(guideId)
      ]);
      setGuide(guideDetails.data);
      setAvailability(guideAvailability.data);
      setReviews(guideReviews.data);
    } catch (error) {
      console.error('Error fetching guide details:', error);
      Alert.alert('Error', 'Failed to load guide information');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    navigation.navigate('GuideBooking', {
      guideId,
      guideName: guide?.name,
      rates: guide?.rates
    });
  };

  const renderRating = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={20}
            color={star <= rating ? '#FFC107' : '#ccc'}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Guide Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: guide?.profileImage || '/api/placeholder/200/200' }}
          style={styles.profileImage}
        />
        <Text style={styles.guideName}>{guide?.name}</Text>
        <Text style={styles.guideSpecialty}>{guide?.specialty}</Text>
        {renderRating(guide?.rating)}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookButtonText}>Book Guide</Text>
        </TouchableOpacity>
      </View>

      {/* Experience and Certifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <Text style={styles.experienceText}>{guide?.experience}</Text>

        <Text style={styles.subsectionTitle}>Certifications</Text>
        {guide?.certifications?.map((cert, index) => (
          <View key={index} style={styles.certificationItem}>
            <MaterialCommunityIcons name="certificate" size={20} color="#4CAF50" />
            <Text style={styles.certificationText}>{cert}</Text>
          </View>
        ))}
      </View>

      {/* Services and Rates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services & Rates</Text>
        {guide?.rates?.map((rate, index) => (
          <View key={index} style={styles.rateItem}>
            <View style={styles.rateHeader}>
              <Text style={styles.rateTitle}>{rate.service}</Text>
              <Text style={styles.ratePrice}>${rate.price}</Text>
            </View>
            <Text style={styles.rateDescription}>{rate.description}</Text>
            <Text style={styles.rateDuration}>{rate.duration}</Text>
          </View>
        ))}
      </View>

      {/* Availability Calendar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availability.map((slot, index) => (
            <View key={index} style={styles.availabilitySlot}>
              <Text style={styles.slotDate}>
                {new Date(slot.date).toLocaleDateString()}
              </Text>
              <Text style={styles.slotTime}>{slot.timeSlot}</Text>
              <Text style={styles.slotSpots}>
                {slot.spotsLeft} spots left
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.userName}</Text>
              {renderRating(review.rating)}
            </View>
            <Text style={styles.reviewDate}>
              {new Date(review.date).toLocaleDateString()}
            </Text>
            <Text style={styles.reviewText}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  guideName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  guideSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  experienceText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  certificationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  rateItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  rateDescription: {
    color: '#666',
    marginBottom: 5,
  },
  rateDuration: {
    color: '#666',
    fontStyle: 'italic',
  },
  availabilitySlot: {
    width: 120,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  slotDate: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  slotTime: {
    color: '#666',
    marginBottom: 5,
  },
  slotSpots: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  reviewCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontWeight: 'bold',
  },
  reviewDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default GuideDetailScreen;