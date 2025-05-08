import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const categories = [
    { id: 1, title: "Trails", screen: "Trails" },
    { id: 2, title: "Fishing Spots", screen: "FishingSpots" },
    { id: 3, title: "Camping", screen: "Camping" },
    { id: 4, title: "Public Lands", screen: "PublicLands" },
  ];

  const recentActivities = [
    { id: 1, title: "Mountain Trail", type: "Trail", distance: "2.5 miles" },
    { id: 2, title: "Lake View", type: "Fishing", distance: "5 miles" },
    { id: 3, title: "Forest Camp", type: "Camping", distance: "8 miles" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Text style={styles.searchButton}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate(category.screen)}
              >
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activities */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={() =>
                navigation.navigate("ActivityDetail", { activity })
              }
            >
              <View>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityType}>{activity.type}</Text>
              </View>
              <Text style={styles.activityDistance}>{activity.distance}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sentry Test Button */}
        <View style={styles.testButtonContainer}>
          <Button
            title="Trigger Sentry Test Error"
            color="#D9534F"
            onPress={() => {
              throw new Error("This is your first Sentry test error!");
            }}
          />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  searchButton: {
    fontSize: 24,
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    marginRight: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  recentContainer: {
    padding: 20,
  },
  activityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
    borderRadius: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  activityType: {
    color: "#666",
    marginTop: 5,
  },
  activityDistance: {
    color: "#666",
  },
  testButtonContainer: {
    padding: 20,
    alignItems: "center",
  },
});

export default HomeScreen;