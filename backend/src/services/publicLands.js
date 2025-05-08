const axios = require("axios");
const secureAxios = require("../utils/secureAxios");
const { isWithinRadius } = require("../utils/geoUtils");

const BASE_URL = "https://api.publiclandsdata.com"; // example placeholder

const PublicLandsService = {
  async getAllPublicLands(lat, lng, radius = 50) {
    const [national, state, local] = await Promise.all([
      this.getNationalParks(lat, lng, radius),
      this.getStateParks(lat, lng, radius),
      this.getLocalLands(lat, lng, radius),
    ]);

    return { national, state, local };
  },

  async getNationalParks(lat, lng, radius) {
    try {
      const res = await secureAxios.get(`${BASE_URL}/national`, {
        params: { lat, lng, radius },
      });
      return res.data?.parks || [];
    } catch (err) {
      console.error("Error fetching national parks:", err.message);
      return [];
    }
  },

  async getStateParks(lat, lng, radius) {
    try {
      const res = await secureAxios.get(`${BASE_URL}/state`, {
        params: { lat, lng, radius },
      });
      return res.data?.parks || [];
    } catch (err) {
      console.error("Error fetching state parks:", err.message);
      return [];
    }
  },

  async getLocalLands(lat, lng, radius) {
    try {
      const res = await secureAxios.get(`${BASE_URL}/local`, {
        params: { lat, lng, radius },
      });
      return res.data?.lands || [];
    } catch (err) {
      console.error("Error fetching local lands:", err.message);
      return [];
    }
  },
};

module.exports = PublicLandsService;