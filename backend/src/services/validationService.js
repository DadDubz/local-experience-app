class ValidationService {
  static filterByActivities(results, activityList) {
    return results.filter((location) => {
      return activityList.some(
        (activity) =>
          location.activities &&
          location.activities
            .map((a) => a.toLowerCase())
            .includes(activity.toLowerCase()),
      );
    });
  }

  static filterByAmenities(results, amenityList) {
    return results.filter((location) => {
      return amenityList.some(
        (amenity) =>
          location.amenities &&
          location.amenities
            .map((a) => a.toLowerCase())
            .includes(amenity.toLowerCase()),
      );
    });
  }

  static validateCoordinates(lat, lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude. Must be between -90 and 90");
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude. Must be between -180 and 180");
    }

    return { latitude, longitude };
  }

  static validateRadius(radius) {
    const parsedRadius = parseFloat(radius);
    if (isNaN(parsedRadius) || parsedRadius <= 0) {
      throw new Error("Invalid radius. Must be a positive number");
    }
    return parsedRadius;
  }

  static validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      throw new Error("Invalid start date");
    }

    if (isNaN(end.getTime())) {
      throw new Error("Invalid end date");
    }

    if (end < start) {
      throw new Error("End date must be after start date");
    }

    return { start, end };
  }

  static sanitizeQueryString(str) {
    if (!str) return "";
    return str.replace(/[^a-zA-Z0-9\s,-]/g, "").trim();
  }
}

module.exports = ValidationService;