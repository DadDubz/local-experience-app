import React from "react";
import { Share, View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SocialSharing = ({ experience }) => {
  const shareExperience = async () => {
    try {
      await Share.share({
        message: `Check out ${experience.title} on Local Experience App!`,
        url: `https://localexp.app/experience/${experience._id}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <TouchableOpacity onPress={shareExperience} style={styles.shareButton}>
      <MaterialCommunityIcons name="share" size={24} color="#333" />
    </TouchableOpacity>
  );
};
