import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const UserProfileScreen = ({ route, navigation }) => {
  const [user, setUser] = useState({
    id: "1",
    name: "John Doe",
    username: "@johndoe",
    bio: "Outdoor enthusiast | Trail runner | Nature photographer",
    location: "Mountain View, CA",
    joinDate: "January 2024",
    stats: {
      trips: 45,
      reviews: 23,
      photos: 156,
      followers: 89,
      following: 124,
    },
    recentActivities: [
      {
        id: "1",
        type: "review",
        location: "Mountain Trail",
        date: "2 days ago",
      },
      {
        id: "2",
        type: "photo",
        location: "Crystal Lake",
        date: "1 week ago",
      },
    ],
    badges: [
      {
        id: "1",
        name: "Trail Expert",
        icon: "terrain",
      },
      {
        id: "2",
        name: "Photo Pro",
        icon: "camera",
      },
    ],
  });

  const isOwnProfile = route.params?.userId === user.id;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            style={styles.profileImage}
            source={{ uri: "https://via.placeholder.com/150" }}
          />
          {isOwnProfile ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Icon name="edit" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={16} color="#666" />
            <Text style={styles.location}>{user.location}</Text>
          </View>
          // ... (previous code remains the same until the Text style=
          {styles.location})<Text style={styles.bio}>{user.bio}</Text>
          <View style={styles.joinDateContainer}>
            <Icon name="event" size={16} color="#666" />
            <Text style={styles.joinDate}>Joined {user.joinDate}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.stats.trips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.stats.reviews}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.stats.photos}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>

        <View style={styles.followContainer}>
          <TouchableOpacity style={styles.followStats}>
            <Text style={styles.followNumber}>{user.stats.followers}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followStats}>
            <Text style={styles.followNumber}>{user.stats.following}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {user.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeContainer}>
                <Icon name={badge.icon} size={24} color="#3498db" />
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {user.recentActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityItem}
              onPress={() =>
                navigation.navigate("ActivityDetail", { activity })
              }
            >
              <Icon
                name={activity.type === "review" ? "rate-review" : "photo"}
                size={24}
                color="#666"
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  {activity.type === "review" ? "Reviewed" : "Added photo to"}{" "}
                  {activity.location}
                </Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          ))}
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
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  editButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#3498db",
    padding: 8,
    borderRadius: 20,
  },
  followButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    marginLeft: 5,
    color: "#666",
  },
  bio: {
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  joinDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  joinDate: {
    marginLeft: 5,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#666",
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  followStats: {
    alignItems: "center",
  },
  followNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  followLabel: {
    color: "#666",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  badgeContainer: {
    alignItems: "center",
    marginRight: 20,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 10,
  },
  badgeName: {
    marginTop: 5,
    color: "#333",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  activityContent: {
    flex: 1,
    marginLeft: 15,
  },
  activityText: {
    fontSize: 16,
  },
  activityDate: {
    color: "#666",
    fontSize: 14,
  },
});

export default UserProfileScreen;