const Location = require("../models/Location");
const ErrorHandler = require("../middleware/errorHandler");

class LocationController {
  static async getAllLocations(req, res) {
    try {
      const { lat, lng, radius = 50, type } = req.query;

      let query = {};

      if (lat && lng) {
        query.coordinates = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: parseFloat(radius) * 1609.34, // Convert miles to meters
          },
        };
      }

      if (type) {
        query.type = type;
      }

      const locations = await Location.find(query);

      res.json({
        success: true,
        count: locations.length,
        data: locations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getLocationById(req, res) {
    try {
      const location = await Location.findById(req.params.id);

      if (!location) {
        throw new ErrorHandler("Location not found", 404);
      }

      res.json({
        success: true,
        data: location,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async createLocation(req, res) {
    try {
      const location = new Location(req.body);
      await location.save();

      res.status(201).json({
        success: true,
        data: location,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateLocation(req, res) {
    try {
      const location = await Location.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );

      if (!location) {
        throw new ErrorHandler("Location not found", 404);
      }

      res.json({
        success: true,
        data: location,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateWeather(req, res) {
    try {
      const location = await Location.findById(req.params.id);

      if (!location) {
        throw new ErrorHandler("Location not found", 404);
      }

      location.weather = {
        ...location.weather,
        ...req.body,
        lastUpdated: new Date(),
      };

      await location.save();

      res.json({
        success: true,
        data: location,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteLocation(req, res) {
    try {
      const location = await Location.findByIdAndDelete(req.params.id);

      if (!location) {
        throw new ErrorHandler("Location not found", 404);
      }

      res.json({
        success: true,
        message: "Location deleted successfully",
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getLocationStats(req, res) {
    try {
      const location = await Location.findById(req.params.id);

      if (!location) {
        throw new ErrorHandler("Location not found", 404);
      }

      // You would typically aggregate data from other collections here
      // This is a placeholder for demonstration
      const stats = {
        totalVisits: 0,
        averageRating: location.ratings.average,
        popularSpecies: location.species,
        bestTimes: {
          morning: true,
          afternoon: false,
          evening: true,
        },
        weatherTrends: [],
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = LocationController;