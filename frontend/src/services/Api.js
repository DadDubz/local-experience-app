// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lands API
export const landsApi = {
  // Get all public lands within radius
  getAllLands: (lat, lng, radius = 50) => 
    api.get('/lands', { params: { lat, lng, radius } }),

  // Get fishing locations
  getFishingLocations: (lat, lng, radius = 50) => 
    api.get('/lands/fishing', { params: { lat, lng, radius } }),

  // Get trails
  getTrails: (lat, lng, radius = 50) => 
    api.get('/lands/trails', { params: { lat, lng, radius } }),

  // Get location details
  getLocationDetails: (locationId) => 
    api.get(`/lands/recreation/${locationId}`),

  // Search lands by type and activities
  searchLands: (lat, lng, params) => 
    api.get('/lands/search', { params: { lat, lng, ...params } }),
};

// Weather API
export const weatherApi = {
  // Get current weather
  getCurrentWeather: (lat, lng) => 
    api.get('/weather/forecast', { params: { lat, lng } }),

  // Get weather alerts
  getAlerts: (lat, lng, radius = 50) => 
    api.get('/weather/alerts', { params: { lat, lng, radius } }),

  // Get marine conditions
  getMarineConditions: (lat, lng) => 
    api.get('/weather/marine', { params: { lat, lng } }),
};

// Reports API
export const reportsApi = {
  // Submit a catch report
  submitReport: (reportData) => 
    api.post('/reports', reportData),

  // Get reports for a location
  getLocationReports: (locationId, startDate, endDate) => 
    api.get(`/reports/location/${locationId}`, { params: { startDate, endDate } }),

  // Get location stats
  getLocationStats: (locationId) => 
    api.get(`/reports/stats/${locationId}`),
};

// Authentication API
export const authApi = {
  // Login
  login: (credentials) => 
    api.post('/auth/login', credentials),

  // Register
  register: (userData) => 
    api.post('/auth/register', userData),

  // Get user licenses
  getLicenses: () => 
    api.get('/auth/licenses'),
};

export default {
  lands: landsApi,
  weather: weatherApi,
  reports: reportsApi,
  auth: authApi,
};