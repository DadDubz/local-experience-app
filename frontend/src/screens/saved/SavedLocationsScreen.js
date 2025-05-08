import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const SavedLocationsScreen = ({ navigation }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  const fetchSavedLocations = async () => {
    // Mock data - replace with API call
    const mockLocations = [
      {
        id: "1",
        name: "Crystal Lake Trail",
        type: "trail",
        distance: "5.2 miles",
        difficulty: "Moderate",
        rating: 4.5,
        image: "https://via.placeholder.com/150",
        savedDate: "2025-01-14",
      },
      {
        id: "2",
        name: "Mountain Peak Campground",
        type: "camping",
        distance: "12 miles",
        amenities: ["Water", "Restrooms"],
        rating: 4.8,
        image: "https://via.placeholder.com/150",
        savedDate: "2025-01-13",
      },
    ];
    setSavedLocations(mockLocations);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedLocations();
    setRefreshing(false);
  };

  const renderLocationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("LocationDetail", { locationId: item.id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => handleRemoveSaved(item.id)}
            style={styles.favoriteButton}
          >
            <Icon name="favorite" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardInfo}>
          <Icon name="place" size={16} color="#666" />
          <Text style={styles.cardInfoText}>{item.distance}</Text>
        </View>

        {item.difficulty && (
          <View style={styles.cardInfo}>
            <Icon name="terrain" size={16} color="#666" />
            <Text style={styles.cardInfoText}>{item.difficulty}</Text>
          </View>
        )}

        {item.amenities && (
          <View style={styles.cardInfo}>
            <Icon name="hotel" size={16} color="#666" />
            <Text style={styles.cardInfoText}>{item.amenities.join(", ")}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#f1c40f" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.savedDate}>Saved on {item.savedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleRemoveSaved = (locationId) => {
    setSavedLocations((prev) =>
      prev.filter((location) => location.id !== locationId),
    );
  };

  const FilterButton = ({ title, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <FilterButton title="All" value="all" />
        <FilterButton title="Trails" value="trail" />
        <FilterButton title="Camping" value="camping" />
        <FilterButton title="Fishing" value="fishing" />
      </View>

      <FlatList
        data={savedLocations.filter((location) =>
          filter === "all" ? true : location.type === filter,
        )}
        renderItem={renderLocationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="bookmark-border" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No saved locations found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#f8f9fa",
  },
  filterButtonActive: {
    backgroundColor: "#3498db",
  },
  filterButtonText: {
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cardInfoText: {
    marginLeft: 5,
    color: "#666",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 5,
    fontWeight: "bold",
  },
  savedDate: {
    color: "#999",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
});

export default SavedLocationsScreen;