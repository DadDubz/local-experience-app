const express = require("express");
const router = express.Router();
const TrailService = require("../services/trailService");
const FishingService = require("../services/fishingService");
const PublicLandsService = require("../services/publicLands");
const WeatherService = require("../services/weatherService");
const ValidationService = require("../services/validationService");

// Validation middleware
const validateCoordinates = (req, res, next) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      error: "Missing coordinates",
      message: "Latitude and longitude are required",
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const searchRadius = parseFloat(radius) || 50;

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return res.status(400).json({
      error: "Invalid latitude",
      message: "Latitude must be between -90 and 90",
    });
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({
      error: "Invalid longitude",
      message: "Longitude must be between -180 and 180",
    });
  }

  req.coordinates = {
    latitude,
    longitude,
    radius: searchRadius,
  };

  next();
};

// Mock data for testing
const mockData = {
  RECDATA: [
    {
      FacilityID: "123",
      FacilityName: "Test Fishing Location",
      FacilityDescription: "A beautiful fishing spot",
      FacilityLatitude: "37.7749",
      FacilityLongitude: "-122.4194",
      FacilityTypeDescription: "Fishing Area",
      FacilityDirections: "Head north on main road",
      FacilityPhone: "555-1234",
      FacilityEmail: "test@example.com",
    },
  ],
  METADATA: {
    RESULTS: {
      CURRENT_COUNT: 1,
      TOTAL_COUNT: 1,
    },
  },
};

// GET all public lands
router.get("/", validateCoordinates, async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.coordinates;
    const lands = await PublicLandsService.getAllPublicLands(
      latitude,
      longitude,
      radius,
    );
    res.json(lands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET fishing locations
router.get("/fishing", validateCoordinates, async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.coordinates;
    const fishingLocations = await FishingService.getFishingLocations(
      latitude,
      longitude,
      radius,
    );
    res.json(fishingLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET specific fishing location details
router.get("/fishing/:id", async (req, res) => {
  try {
    const details = await FishingService.getFishingLocationDetails(
      req.params.id,
    );
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET trails
router.get("/trails", validateCoordinates, async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.coordinates;
    const trails = await TrailService.getTrails(latitude, longitude, radius);
    res.json(trails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET trail details
router.get("/trails/:id", async (req, res) => {
  try {
    const trailDetails = await TrailService.getTrailDetails(req.params.id);
    res.json(trailDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET weather for location
router.get("/weather", validateCoordinates, async (req, res) => {
  try {
    const { latitude, longitude } = req.coordinates;
    const weather = await WeatherService.getWeather(latitude, longitude);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET recreation area details
router.get("/recreation/:id", async (req, res) => {
  try {
    const details = await PublicLandsService.getRecreationAreaDetails(
      req.params.id,
    );
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search lands by type
router.get("/search", validateCoordinates, async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.coordinates;
    const { type, activities, amenities } = req.query;

    let results;
    switch (type) {
      case "national":
        results = await PublicLandsService.getNationalLands(
          latitude,
          longitude,
          radius,
        );
        break;
      case "state":
        results = await PublicLandsService.getStateLands(
          latitude,
          longitude,
          radius,
        );
        break;
      case "local":
        results = await PublicLandsService.getLocalLands(
          latitude,
          longitude,
          radius,
        );
        break;
      default:
        results = await PublicLandsService.getAllPublicLands(
          latitude,
          longitude,
          radius,
        );
    }

    // Filter by activities if specified
    if (activities) {
      const activityList = activities.split(",");
      results = ValidationService.filterByActivities(results, activityList);
    }

    // Filter by amenities if specified
    if (amenities) {
      const amenityList = amenities.split(",");
      results = ValidationService.filterByAmenities(results, amenityList);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET nearby amenities
router.get("/amenities", validateCoordinates, async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.coordinates;
    const amenities = await PublicLandsService.getNearbyAmenities(
      latitude,
      longitude,
      radius,
    );
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route for lands API
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Lands API is operational",
    timestamp: new Date(),
    endpoints: {
      publicLands: "/api/lands",
      fishing: "/api/lands/fishing",
      trails: "/api/lands/trails",
      weather: "/api/lands/weather",
      recreation: "/api/lands/recreation/:id",
      search: "/api/lands/search",
      amenities: "/api/lands/amenities",
      health: "/api/lands/health",
    },
  });
});

module.exports = router;