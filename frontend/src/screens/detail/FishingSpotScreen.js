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
import MapView, { Marker } from 'react-native-maps';

const FishingSpotScreen = ({ route, navigation }) => {
  const [spot, setSpot] = useState({
    name: 'Crystal Lake',
    type: 'Lake',
    species: ['Bass', 'Trout', 'Catfish'],
    bestTimes: {
      timeOfDay: 'Early Morning, Late Evening',
      seasons: ['Spring', 'Summer']
    },
    facilities: [
      'Boat Launch',
      'Parking',
      'Restrooms',
      'Fish Cleaning Station'
    ],
    regulations: {
      license: 'Required',
      limits: {
        bass: 5,
        trout: 3,
        catfish: 10
      }
    },
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: 'fishing-spot-image-url' }}
          style={styles.image}
        />

        <View style={styles.headerContainer}>
          <Text style={styles.title}>{spot.name}</Text>
          <Text style={styles.type}>{spot.type}</Text>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: spot.coordinates.latitude,
              longitude: spot.coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={spot.coordinates}
              title={spot.name}
            />
          </MapView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fish Species</Text>
          <View style={styles.speciesContainer}>
            {spot.species.map((species, index) => (
              <View key={index} style={styles.speciesItem}>
                <Icon name="pets" size={24} color="#3498db" />
                <Text style={styles.speciesText}>{species}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Best Times</Text>
          <View style={styles.infoRow}>
            <Icon name="access-time" size={20} color="#666" />
            <Text style={styles.infoText}>{spot.bestTimes.timeOfDay}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="event" size={20} color="#666" />
            <Text style={styles.infoText}>
              Best Seasons: {spot.bestTimes.seasons.join(', ')}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          {spot.facilities.map((facility, index) => (
            <View key={index} style={styles.infoRow}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>{facility}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Regulations</Text>
          <View style={styles.infoRow}>
            <Icon name="card-membership" size={20} color="#666" />
            <Text style={styles.infoText}>License: {spot.regulations.license}</Text>
          </View>
          <Text style={styles.subTitle}>Catch Limits:</Text>
          {Object.entries(spot.regulations.limits).map(([fish, limit], index) => (
            <View key={index} style={styles.limitRow}>
              <Text style={styles.limitText}>
                {fish.charAt(0).toUpperCase() + fish.slice(1)}: {limit} per day
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Icon name="navigation" size={20} color="#fff" />
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Icon name="report" size={20} color="#3498db" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Report Conditions
            </Text>
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
  headerContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  type: {
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    height: 200,
  },
  sectionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  speciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  speciesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  speciesText: {
    marginLeft: 5,
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  limitRow: {
    marginLeft: 30,
    marginBottom: 5,
  },
  limitText: {
    fontSize: 16,
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

export default FishingSpotScreen;