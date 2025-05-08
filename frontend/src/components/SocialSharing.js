import React from "react";
import PropTypes from "prop-types";
import { Share, TouchableOpacity } from "react-native";
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
  
    SocialSharing.propTypes = {
      experience: PropTypes.shape({
        title: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
      }).isRequired,
    };
  };
  
  export default SocialSharing;

  return (
    <TouchableOpacity onPress={shareExperience} style={styles.shareButton}>
      <MaterialCommunityIcons name="share" size={24} color="#333" />
    </TouchableOpacity>
  );
};