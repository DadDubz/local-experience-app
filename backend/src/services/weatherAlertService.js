const axios = require("axios");

class WeatherAlertService {
  static async getAlerts(lat, lng, radius = 50) {
    try {
      // Mock weather alerts data
      return {
        alerts: [
          {
            id: "wa1",
            type: "WEATHER_ADVISORY",
            severity: "moderate",
            title: "Strong Wind Advisory",
            description: "Wind speeds of 15-25 mph expected",
            issuedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            area: {
              center: {
                latitude: lat,
                longitude: lng,
              },
              radius: radius,
              affectedLocations: ["Lake Central", "North Bay"],
            },
            recommendations: [
              "Small craft advisory in effect",
              "Secure loose equipment",
              "Check local conditions before departure",
            ],
            impactedActivities: ["Boating", "Fishing"],
          },
          {
            id: "wa2",
            type: "STORM_WARNING",
            severity: "high",
            title: "Thunderstorm Warning",
            description: "Severe thunderstorms possible with lightning",
            issuedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            area: {
              center: {
                latitude: lat,
                longitude: lng,
              },
              radius: 30,
              affectedLocations: ["All Lake Areas", "Shoreline Regions"],
            },
            recommendations: [
              "Seek safe shelter immediately",
              "Monitor local weather updates",
              "Avoid open water",
            ],
            impactedActivities: ["All Water Activities", "Shore Fishing"],
          },
        ],
        waterConditions: {
          temperature: 68,
          waveHeight: 1.5,
          windSpeed: 12,
          windDirection: "NW",
          visibility: "Good",
          currentStrength: "Moderate",
          timestamp: new Date().toISOString(),
        },
        forecast: {
          today: {
            conditions: "Partly Cloudy",
            highTemp: 75,
            lowTemp: 65,
            precipitation: 20,
            windSpeed: {
              morning: 10,
              afternoon: 15,
              evening: 8,
            },
          },
          nextDays: [
            {
              date: new Date(Date.now() + 86400000).toISOString(),
              conditions: "Sunny",
              highTemp: 78,
              lowTemp: 62,
              precipitation: 0,
            },
          ],
        },
        safetyStatus: {
          overallStatus: "CAUTION",
          restrictions: ["Small Craft Advisory", "Lightning Risk"],
          recommendations: [
            "Check weather before departure",
            "Carry safety equipment",
            "Monitor weather radio",
          ],
        },
      };
    } catch (error) {
      console.error("Error fetching weather alerts:", error);
      throw error;
    }
  }

  static async subscribeToAlerts(userId, preferences) {
    try {
      return {
        subscriptionId: `sub_${Date.now()}`,
        userId,
        preferences: {
          locations: preferences.locations || [],
          alertTypes: preferences.alertTypes || ["ALL"],
          notificationMethods: preferences.notificationMethods || ["EMAIL"],
          threshold: preferences.threshold || "ALL",
        },
        status: "active",
        created: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error subscribing to alerts:", error);
      throw error;
    }
  }

  static async getMarineConditions(lat, lng) {
    try {
      return {
        location: {
          latitude: lat,
          longitude: lng,
          name: "Test Location",
        },
        currentConditions: {
          waterTemp: 68,
          airTemp: 72,
          humidity: 65,
          pressure: 30.1,
          visibility: 10,
          windSpeed: 12,
          windDirection: "NW",
          waveHeight: 1.5,
          wavePeriod: 4,
          waveDirection: "NE",
          timestamp: new Date().toISOString(),
        },
        tides: {
          next24Hours: [
            {
              type: "HIGH",
              height: 5.2,
              time: new Date().toISOString(),
            },
            {
              type: "LOW",
              height: 0.5,
              time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
      };
    } catch (error) {
      console.error("Error fetching marine conditions:", error);
      throw error;
    }
  }
}

module.exports = WeatherAlertService;
