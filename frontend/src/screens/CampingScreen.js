import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";

const CampingScreen = ({ navigation }) => {
  const [campsite, setCampsite] = useState({
    name: "Pine Valley Campground",
    type: "Developed Campground",
    price: "$25/night",
    amenities: [
      "Drinking Water",
      "Restrooms",
      "Fire Pits",
      "Picnic Tables",
      "RV Hookups",
    ],
    activities: ["Hiking", "Fishing", "Wildlife Viewing", "Photography"],
    regulations: [
      "Quiet hours: 10PM - 6AM",
      "Pets must be leashed",
      "Maximum stay: 14 days",
    ],
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    availability: "Available",
    reservationRequired: true,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: "campsite-image-url" }} style={styles.image} />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{campsite.name}</Text>
          <View style={styles.typeContainer}>
            <Icon name="cabin" size={20} color="#666" />
            <Text style={styles.type}>{campsite.type}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Icon name="attach-money" size={20} color="#666" />
            <Text style={styles.price}>{campsite.price}</Text>
          </View>
        </View>

        <View style={styles.availabilityContainer}>
          <Text
            style={[
              styles.availability,
              {
                color:
                  campsite.availability === "Available" ? "#4CAF50" : "#f44336",
              },
            ]}
          >
            {campsite.availability}
          </Text>
          {campsite.reservationRequired && (
            <Text style={styles.reservationRequired}>Reservation Required</Text>
          )}
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: campsite.coordinates.latitude,
              longitude: campsite.coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={campsite.coordinates} title={campsite.name} />
          </MapView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          {campsite.amenities.map((amenity, index) => (
            <View key={index} style={styles.listItem}>
              <Icon name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.listItemText}>{amenity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesGrid}>
            {campsite.activities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Icon name="directions-run" size={24} color="#3498db" />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Regulations</Text>
          {campsite.regulations.map((regulation, index) => (
            <View key={index} style={styles.listItem}>
              <Icon name="info" size={20} color="#666" />
              <Text style={styles.listItemText}>{regulation}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              /* Handle reservation */
            }}
          >
            <Icon name="event" size={20} color="#fff" />
            <Text style={styles.buttonText}>Make Reservation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              /* Handle directions */
            }}
          >
            <Icon name="directions" size={20} color="#3498db" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Get Directions
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
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
  },
  infoContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  type: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  availabilityContainer: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  availability: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reservationRequired: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  mapContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    height: 200,
  },
  sectionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  listItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  activitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  activityItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  activityText: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#3498db",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#3498db",
  },
});

export default CampingScreen;
