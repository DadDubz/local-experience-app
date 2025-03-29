const Location = require("../models/Location"); // 
const Review = require("../../models/Review");
const Visit = require("../../models/Visit");

class LocationService {
  static async getAllLocations(lat, lng, radius = 50, filters = {}) {
    try {
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid latitude or longitude");
      }

      const query = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: radius * 1609.34, // miles to meters
          },
        },
      };

      if (filters.type) query.type = filters.type;
      if (filters.activities) query.activities = { $in: filters.activities };

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

  static async findNearby(lat, lng, radius = 50) {
    return await this.getAllLocations(lat, lng, radius);
  }

  static async getLocationById(locationId) {
    try {
      const location = await Location.findById(locationId)
        .populate("reviews")
        .populate("amenities");

      if (!location) throw new Error("Location not found");

      return { success: true, data: location };
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  }

  static async addLocation(data) {
    try {
      if (!data.coordinates || !Array.isArray(data.coordinates) || data.coordinates.length !== 2) {
        throw new Error("Invalid coordinates");
      }

      const location = new Location({
        name: data.name,
        type: data.type,
        description: data.description,
        location: {
          type: "Point",
          coordinates: data.coordinates,
        },
        activities: data.activities || [],
        amenities: data.amenities || [],
        accessibility: data.accessibility || {},
        seasonality: data.seasonality || {},
        regulations: data.regulations || {},
        status: "active",
      });

      await location.save();

      return { success: true, data: location };
    } catch (error) {
      console.error("Error adding location:", error);
      throw error;
    }
  }

  static async updateLocation(id, updates) {
    try {
      const location = await Location.findByIdAndUpdate(id, { $set: updates }, {
        new: true,
        runValidators: true,
      });

      if (!location) throw new Error("Location not found");

      return { success: true, data: location };
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  static async deleteLocation(id) {
    try {
      const location = await Location.findByIdAndDelete(id);
      if (!location) throw new Error("Location not found");
      return { success: true, message: "Location deleted successfully" };
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }

  static async searchLocations(params) {
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
      } = params;

      const query = {};

      if (keyword) query.$text = { $search: keyword };
      if (types?.length) query.type = { $in: types };
      if (activities?.length) query.activities = { $in: activities };
      if (amenities?.length) query.amenities = { $in: amenities };

      if (accessibility) {
        for (const key in accessibility) {
          query[`accessibility.${key}`] = accessibility[key];
        }
      }

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
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

  static async getLocationStats(id) {
    try {
      const location = await Location.findById(id);
      if (!location) throw new Error("Location not found");

      const reviews = await Review.find({ location: id });
      const averageRating = reviews.length
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

      const visits = await Visit.find({ location: id });
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
      console.error("Error fetching stats:", error);
      throw error;
    }
  }

  static groupVisitsByMonth(visits) {
    const stats = {};
    visits.forEach((v) => {
      const m = v.date.getMonth();
      stats[m] = (stats[m] || 0) + 1;
    });
    return stats;
  }
}

module.exports = LocationService;
