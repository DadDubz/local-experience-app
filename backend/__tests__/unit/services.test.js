const WeatherService = require("../../src/services/weatherService");
const LocationService = require("../../src/services/locationService");

describe("Service Tests", () => {
  describe("WeatherService", () => {
    it("should get weather data", async () => {
      const weatherData = await WeatherService.getWeather(37.7749, -122.4194);
      expect(weatherData).toHaveProperty("current");
      expect(weatherData).toHaveProperty("forecast");
    });
  });

  describe("LocationService", () => {
    it("should find nearby locations", async () => {
      const locations = await LocationService.findNearby(
        37.7749,
        -122.4194,
        10,
      );
      expect(Array.isArray(locations)).toBe(true);
    });
  });
});