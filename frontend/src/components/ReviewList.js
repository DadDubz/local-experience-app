// frontend/src/components/ReviewsList.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
const ReviewsList = ({ reviews }) => {
  const handleDeleteReview = (reviewId) => {
    console.log(`Deleted review ${reviewId}`);
    // Add logic to delete the review or notify the backend
  };
  const handleHelpful = (reviewId) => {
    console.log(`Marked review ${reviewId} as helpful`);
    // Add logic to update the helpful count or notify the backend
  };
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'rating'

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={star <= rating ? '#FFC107' : '#ccc'}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewerName}>{item.userName}</Text>
          <Text style={styles.reviewDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {renderStars(item.rating)}
      </View>

      <Text style={styles.reviewText}>{item.text}</Text>

      {item.photos?.length > 0 && (
        <View style={styles.photoGrid}>
          {item.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.reviewPhoto}
            />
          ))}
        </View>
      )}

      <View style={styles.reviewFooter}>
        <TouchableOpacity
          style={styles.helpfulButton}
          onPress={() => handleHelpful(item.id)}
        >
          <MaterialCommunityIcons
            name="thumb-up-outline"
            size={16}
            color="#666"
          />
          <Text style={styles.helpfulText}>
            Helpful ({item.helpfulCount})
          </Text>
        </TouchableOpacity>

        {user?.id === item.userId && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteReview(item.id)}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={16}
              color="#FF3B30"
            />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortBy(sortBy === 'recent' ? 'rating' : 'recent')}
        >
          <MaterialCommunityIcons
            name={sortBy === 'recent' ? 'clock-outline' : 'star-outline'}
            size={20}
            color="#007AFF"
          />
          <Text style={styles.sortButtonText}>
            Sort by {sortBy === 'recent' ? 'Recent' : 'Rating'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortBy === 'recent'
          ? reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : reviews.sort((a, b) => b.rating - a.rating)
        }
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.reviewsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    marginLeft: 5,
    color: '#007AFF',
  },
  reviewsList: {
    padding: 15,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 10,
  },
  photoGrid: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    marginLeft: 5,
    color: '#666',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    marginLeft: 5,
    color: '#FF3B30',
  },
});
ReviewsList.propTypes = {
  locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      userName: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      photos: PropTypes.arrayOf(PropTypes.string),
      helpfulCount: PropTypes.number.isRequired,
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onReviewAdded: PropTypes.func,
};

export default ReviewsList;