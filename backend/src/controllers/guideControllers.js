const Guide = require("../models/Guide");
const Booking = require("../models/Booking");
const ErrorHandler = require("../middleware/errorHandler");

class GuideController {
  static async getAllGuides(req, res) {
    try {
      const { lat, lng, radius = 50, date, specialty } = req.query;

      let query = { status: "active" };

      if (lat && lng) {
        query["operatingArea.coordinates"] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: parseFloat(radius) * 1609.34,
          },
        };
      }

      if (specialty) {
        query["experience.specialties"] = specialty;
      }

      const guides = await Guide.find(query)
        .populate("user", "name email")
        .select("-businessInfo.insurance");

      // Filter by availability if date is provided
      if (date) {
        guides = guides.filter(
          (guide) => !guide.availability.blackoutDates.includes(new Date(date)),
        );
      }

      res.json({
        success: true,
        count: guides.length,
        data: guides,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getGuideById(req, res) {
    try {
      const guide = await Guide.findById(req.params.id)
        .populate("user", "name email")
        .populate("operatingArea.locations");

      if (!guide) {
        throw new ErrorHandler("Guide not found", 404);
      }

      res.json({
        success: true,
        data: guide,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async createGuide(req, res) {
    try {
      // Check if user is already a guide
      const existingGuide = await Guide.findOne({ user: req.user.id });
      if (existingGuide) {
        throw new ErrorHandler("User is already a guide", 400);
      }

      const guide = new Guide({
        user: req.user.id,
        ...req.body,
      });

      await guide.save();

      res.status(201).json({
        success: true,
        data: guide,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateGuide(req, res) {
    try {
      const guide = await Guide.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true, runValidators: true },
      );

      if (!guide) {
        throw new ErrorHandler("Guide not found", 404);
      }

      res.json({
        success: true,
        data: guide,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateAvailability(req, res) {
    try {
      const { regularHours, blackoutDates } = req.body;

      const guide = await Guide.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        {
          "availability.regularHours": regularHours,
          "availability.blackoutDates": blackoutDates,
        },
        { new: true },
      );

      if (!guide) {
        throw new ErrorHandler("Guide not found", 404);
      }

      res.json({
        success: true,
        data: guide.availability,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getGuideBookings(req, res) {
    try {
      const bookings = await Booking.find({
        guide: req.params.id,
        date: { $gte: new Date() },
      })
        .populate("user", "name email")
        .populate("location")
        .sort("date");

      res.json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getGuideStats(req, res) {
    try {
      const guide = await Guide.findById(req.params.id);
      if (!guide) {
        throw new ErrorHandler("Guide not found", 404);
      }

      // Get bookings stats
      const bookings = await Booking.find({ guide: req.params.id });

      const stats = {
        totalBookings: bookings.length,
        completedTrips: bookings.filter((b) => b.status === "completed").length,
        averageRating: guide.ratings.average,
        totalRevenue: bookings.reduce(
          (sum, booking) =>
            sum +
            (booking.payment.status === "paid" ? booking.payment.amount : 0),
          0,
        ),
        popularServices: guide.services
          .map((service) => ({
            name: service.name,
            bookings: bookings.filter((b) => b.service.name === service.name)
              .length,
          }))
          .sort((a, b) => b.bookings - a.bookings),
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

module.exports = GuideController;
