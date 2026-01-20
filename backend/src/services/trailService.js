// backend/src/services/trailService.js

import axios from 'axios';

class TrailService {
  // Fetch trails within a given radius (mock implementation)
  static async getTrails(lat, lng, radius = 50) {
    try {
      return {
        trails: [
          {
            id: "1",
            name: "Scenic Mountain Trail",
            difficulty: "Moderate",
            length: "5.4",
            elevation: "1200",
            description: "Beautiful mountain trail with scenic views",
            coordinates: { latitude: lat, longitude: lng },
            features: ["Waterfall", "Wildlife", "Forest"],
            activities: ["Hiking", "Bird Watching", "Photography"],
          },
          {
            id: "2",
            name: "Lake Loop Trail",
            difficulty: "Easy",
            length: "2.8",
            elevation: "200",
            description: "Easy loop around the lake",
            coordinates: { latitude: lat, longitude: lng },
            features: ["Lake", "Wildlife", "Fishing Access"],
            activities: ["Walking", "Fishing", "Photography"],
          },
        ],
        metadata: {
          count: 2,
          radius,
          searchLocation: { lat, lng },
        },
      };
    } catch (error) {
      console.error("Error fetching trails:", error);
      throw error;
    }
  }

  // Fetch details for a single trail (mock implementation)
  static async getTrailDetails(trailId) {
    try {
      return {
        id: trailId,
        name: "Scenic Mountain Trail",
        difficulty: "Moderate",
        length: "5.4",
        elevation: "1200",
        description: "Beautiful mountain trail with scenic views",
        features: ["Waterfall", "Wildlife", "Forest"],
        activities: ["Hiking", "Bird Watching", "Photography"],
        amenities: {
          parking: true,
          restrooms: true,
          waterSource: true,
        },
        regulations: {
          dogsAllowed: true,
          dogLeashRequired: true,
          campingAllowed: false,
        },
        reviews: [
          {
            rating: 5,
            comment: "Beautiful trail, well maintained",
            date: "2025-01-14",
          },
        ],
        conditions: {
          status: "Open",
          lastUpdated: "2025-01-14",
          details: "Trail is clear and well-maintained",
        },
      };
    } catch (error) {
      console.error("Error fetching trail details:", error);
      throw error;
    }
  }
}

export default TrailService;
