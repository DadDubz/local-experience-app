const axios = require("axios");
const mongoose = require("mongoose");

class LocationService {
  static async getAllLocations(lat, lng, radius = 50, filters = {}) {
    try {
      const query = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: radius * 1609.34, // Convert miles to meters
          },
        },
      };

      // Add type filter if specified
      if (filters.type) {
        query.type = filters.type;
      }

      // Add activity filter if specified
      if (filters.activities) {
        query.activities = { $in: filters.activities };
      }

      const locations = await Location.find(query)
        .populate("reviews")
        .limit(50);

      return {
        success: true,
        count: locations.length,
        data: locations,
      };
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  }

  static async getLocationById(locationId) {
    try {
      const location = await Location.findById(locationId)
        .populate("reviews")
        .populate("amenities");

      if (!location) {
        throw new Error("Location not found");
      }

      return {
        success: true,
        data: location,
      };
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  }

  static async addLocation(locationData) {
    try {
      // Validate coordinates
      if (
        !locationData.coordinates ||
        !Array.isArray(locationData.coordinates) ||
        locationData.coordinates.length !== 2
      ) {
        throw new Error("Invalid coordinates");
      }

      const location = new Location({
        name: locationData.name,
        type: locationData.type,
        description: locationData.description,
        location: {
          type: "Point",
          coordinates: locationData.coordinates,
        },
        activities: locationData.activities || [],
        amenities: locationData.amenities || [],
        accessibility: locationData.accessibility || {},
        seasonality: locationData.seasonality || {},
        regulations: locationData.regulations || {},
        status: "active",
      });

      await location.save();

      return {
        success: true,
        data: location,
      };
    } catch (error) {
      console.error("Error adding location:", error);
      throw error;
    }
  }

  static async updateLocation(locationId, updateData) {
    try {
      const location = await Location.findByIdAndUpdate(
        locationId,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!location) {
        throw new Error("Location not found");
      }

      return {
        success: true,
        data: location,
      };
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  static async deleteLocation(locationId) {
    try {
      const location = await Location.findByIdAndDelete(locationId);

      if (!location) {
        throw new Error("Location not found");
      }

      return {
        success: true,
        message: "Location deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }

  static async searchLocations(searchParams) {
    try {
      const {
        keyword,
        types,
        activities,
        amenities,
        accessibility,
        lat,
        lng,
        radius = 50,
      } = searchParams;

      let query = {};

      // Add text search if keyword provided
      if (keyword) {
        query.$text = { $search: keyword };
      }

      // Add type filter
      if (types && types.length > 0) {
        query.type = { $in: types };
      }

      // Add activities filter
      if (activities && activities.length > 0) {
        query.activities = { $in: activities };
      }

      // Add amenities filter
      if (amenities && amenities.length > 0) {
        query.amenities = { $in: amenities };
      }

      // Add accessibility filter
      if (accessibility) {
        Object.keys(accessibility).forEach((key) => {
          query[`accessibility.${key}`] = accessibility[key];
        });
      }

      // Add location filter if coordinates provided
      if (lat && lng) {
        query.location = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: radius * 1609.34,
          },
        };
      }

      const locations = await Location.find(query)
        .populate("reviews")
        .limit(50);

      return {
        success: true,
        count: locations.length,
        data: locations,
      };
    } catch (error) {
      console.error("Error searching locations:", error);
      throw error;
    }
  }

  static async getLocationStats(locationId) {
    try {
      const location = await Location.findById(locationId);

      if (!location) {
        throw new Error("Location not found");
      }

      // Get reviews stats
      const reviews = await Review.find({ location: locationId });
      const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;

      // Get visit stats
      const visits = await Visit.find({ location: locationId });
      const visitsByMonth = this.groupVisitsByMonth(visits);

      return {
        success: true,
        data: {
          totalReviews: reviews.length,
          averageRating,
          totalVisits: visits.length,
          visitsByMonth,
          popularActivities: location.activities,
          amenities: location.amenities,
        },
      };
    } catch (error) {
      console.error("Error fetching location stats:", error);
      throw error;
    }
  }

  static groupVisitsByMonth(visits) {
    const monthlyVisits = {};
    visits.forEach((visit) => {
      const month = visit.date.getMonth();
      monthlyVisits[month] = (monthlyVisits[month] || 0) + 1;
    });
    return monthlyVisits;
  }
}

module.exports = LocationService;
