import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MapView, { Marker } from "react-native-maps";

const ActivityDetailScreen = ({ route, navigation }) => {
  const [activity, setActivity] = useState({
    id: "1",
    type: "Hiking",
    title: "Mountain Trail Adventure",
    date: "2025-01-14",
    duration: "2h 30m",
    distance: "5.2",
    elevation: "1,200",
    location: {
      name: "Mountain Trail",
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
    stats: {
      avgPace: "15:30",
      maxElevation: "2,500",
      calories: "450",
    },
    photos: ["photo1.jpg", "photo2.jpg"],
    notes:
      "Great trail conditions today. Spotted some wildlife and amazing views.",
    weather: {
      temperature: "72°F",
      conditions: "Partly Cloudy",
      humidity: "45%",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: "https://via.placeholder.com/400x200" }}
          style={styles.coverImage}
        />

        <View style={styles.header}>
          <Text style={styles.title}>{activity.title}</Text>
          <View style={styles.dateContainer}>
            <Icon name="event" size={20} color="#666" />
            <Text style={styles.date}>{activity.date}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="timer" size={24} color="#3498db" />
            <Text style={styles.statValue}>{activity.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="straighten" size={24} color="#3498db" />
            <Text style={styles.statValue}>{activity.distance} mi</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="terrain" size={24} color="#3498db" />
            <Text style={styles.statValue}>{activity.elevation} ft</Text>
            <Text style={styles.statLabel}>Elevation</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Route</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: activity.location.coordinates.latitude,
              longitude: activity.location.coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={activity.location.coordinates}
              title={activity.location.name}
            />
          </MapView>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.detailRow}>
            <Icon name="speed" size={20} color="#666" />
            <Text style={styles.detailLabel}>Average Pace:</Text>
            <Text style={styles.detailValue}>
              {activity.stats.avgPace} min/mi
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="trending-up" size={20} color="#666" />
            <Text style={styles.detailLabel}>Max Elevation:</Text>
            <Text style={styles.detailValue}>
              {activity.stats.maxElevation} ft
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="local-fire-department" size={20} color="#666" />
            <Text style={styles.detailLabel}>Calories:</Text>
            <Text style={styles.detailValue}>{activity.stats.calories}</Text>
          </View>
        </View>

        <View style={styles.weatherContainer}>
          <Text style={styles.sectionTitle}>Weather Conditions</Text>
          <View style={styles.weatherContent}>
            <Icon name="wb-sunny" size={48} color="#f1c40f" />
            <View style={styles.weatherDetails}>
              <Text style={styles.temperature}>
                {activity.weather.temperature}
              </Text>
              <Text style={styles.conditions}>
                {activity.weather.conditions}
              </Text>
              <Text style={styles.humidity}>
                Humidity: {activity.weather.humidity}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{activity.notes}</Text>
        </View>

        <View style={styles.photosContainer}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activity.photos.map((photo, index) => (
              <TouchableOpacity key={index} style={styles.photoContainer}>
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.photo}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Icon name="share" size={20} color="#fff" />
            <Text style={styles.buttonText}>Share Activity</Text>
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
  coverImage: {
    width: "100%",
    height: 200,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    marginLeft: 5,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    color: "#666",
    marginTop: 2,
  },
  mapContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  map: {
    height: 200,
    borderRadius: 10,
  },
  detailsContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    marginLeft: 10,
    flex: 1,
  },
  detailValue: {
    fontWeight: "bold",
  },
  weatherContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  weatherContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherDetails: {
    marginLeft: 15,
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
  },
  conditions: {
    fontSize: 16,
    color: "#666",
  },
  humidity: {
    fontSize: 14,
    color: "#999",
  },
  notesContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  photosContainer: {
    padding: 15,
  },
  photoContainer: {
    marginRight: 10,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  buttonContainer: {
    padding: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ActivityDetailScreen;
