import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, Polyline } from 'react-native-maps';

const TrailDetailScreen = ({ route, navigation }) => {
  const [trail, setTrail] = useState({
    name: 'Mountain Trail',
    difficulty: 'Moderate',
    length: '5.2',
    elevation: '1,200',
    type: 'Loop',
    rating: 4.5,
    reviews: 128,
    description: 'Beautiful mountain trail with scenic views...',
    coordinates: [
      { latitude: 37.7749, longitude: -122.4194 },
      // Add more coordinates for trail path
    ]
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: 'trail-image-url' }}
          style={styles.image}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{trail.name}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={24} color="#666" />
              <Text style={styles.statValue}>{trail.length} mi</Text>
              <Text style={styles.statLabel}>Length</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="height" size={24} color="#666" />
              <Text style={styles.statValue}>{trail.elevation} ft</Text>
              <Text style={styles.statLabel}>Elevation</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="timer" size={24} color="#666" />
              <Text style={styles.statValue}>2-3h</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: trail.coordinates[0].latitude,
              longitude: trail.coordinates[0].longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Polyline
              coordinates={trail.coordinates}
              strokeColor="#3498db"
              strokeWidth={3}
            />
            <Marker
              coordinate={trail.coordinates[0]}
              title="Trail Start"
            />
          </MapView>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Trail Details</Text>
          <View style={styles.detailRow}>
            <Icon name="terrain" size={20} color="#666" />
            <Text style={styles.detailText}>Difficulty: {trail.difficulty}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="loop" size={20} color="#666" />
            <Text style={styles.detailText}>Type: {trail.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="star" size={20} color="#666" />
            <Text style={styles.detailText}>Rating: {trail.rating} ({trail.reviews} reviews)</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{trail.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Icon name="directions-walk" size={20} color="#fff" />
            <Text style={styles.buttonText}>Start Trail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Icon name="share" size={20} color="#3498db" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mapContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    height: 200,
  },
  detailsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
  descriptionContainer: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#3498db',
  },
});

export default TrailDetailScreen;