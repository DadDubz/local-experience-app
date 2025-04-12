// services/freeApiServices.js
import axios from "axios";

export class FreeAPIService {
  // Weather data using National Weather Service (no API key needed)
  static async getWeather(lat, lng) {
    try {
      const pointsResponse = await axios.get(
        `https://api.weather.gov/points/${lat},${lng}`,
      );
      const forecastUrl = pointsResponse.data.properties.forecast;
      const forecast = await axios.get(forecastUrl);

      return forecast.data;
    } catch (error) {
      console.error("Error fetching weather:", error);
      throw error;
    }
  }

  // Trail data using USGS API (no key needed)
  static async getTrails(bounds) {
    try {
      const response = await axios.get(
        "https://apps.nationalmap.gov/tnmaccess/api/v1/trails",
        {
          params: {
            bbox: bounds.join(","),
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching trails:", error);
      throw error;
    }
  }

  // Maps using OpenStreetMap (no API key needed)
  static getMapTileUrl() {
    return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  }

  // Wildlife data using iNaturalist API (free)
  static async getWildlifeData(lat, lng, radius) {
    try {
      const response = await axios.get(
        "https://api.inaturalist.org/v1/observations",
        {
          params: {
            lat,
            lng,
            radius,
            order: "desc",
            order_by: "created_at",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching wildlife data:", error);
      throw error;
    }
  }

  // Recreation data using Recreation.gov API (free tier)
  static async getRecreationAreas(lat, lng, radius) {
    try {
      const response = await axios.get(
        "https://ridb.recreation.gov/api/v1/facilities",
        {
          params: {
            latitude: lat,
            longitude: lng,
            radius,
            apikey: process.env.RECREATION_GOV_API_KEY,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching recreation areas:", error);
      throw error;
    }
  }

  // State park data using state DNR API (typically free)
  static async getStateParks(state, lat, lng) {
    try {
      const response = await axios.get(`https://${state}.gov/dnr/api/parks`, {
        params: {
          lat,
          lng,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching state parks:", error);
      throw error;
    }
  }
}
