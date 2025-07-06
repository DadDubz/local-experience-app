import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Types ----------
export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
}

export interface Location {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
}

// ---------- Auth ----------
export const authApi = {
  login: (credentials: Credentials): Promise<AxiosResponse> =>
    api.post('/auth/login', credentials),
  register: (userData: UserData): Promise<AxiosResponse> =>
    api.post('/auth/register', userData),
  getLicenses: (): Promise<AxiosResponse> =>
    api.get('/auth/licenses'),
};

// ---------- Lands ----------
export const landsApi = {
  getAllLands: (lat: number, lng: number, radius = 50): Promise<AxiosResponse> =>
    api.get('/lands', { params: { lat, lng, radius } }),

  getFishingLocations: (lat: number, lng: number, radius = 50): Promise<AxiosResponse> =>
    api.get('/lands/fishing', { params: { lat, lng, radius } }),

  getTrails: (lat: number, lng: number, radius = 50): Promise<AxiosResponse> =>
    api.get('/lands/trails', { params: { lat, lng, radius } }),

  getLocationDetails: (locationId: string): Promise<AxiosResponse<Location>> =>
    api.get(`/lands/recreation/${locationId}`),

  searchLands: (lat: number, lng: number, params: Record<string, any>): Promise<AxiosResponse> =>
    api.get('/lands/search', { params: { lat, lng, ...params } }),
};

// ---------- Weather ----------
export const weatherApi = {
  getCurrentWeather: (lat: number, lng: number): Promise<AxiosResponse> =>
    api.get('/weather/forecast', { params: { lat, lng } }),

  getAlerts: (lat: number, lng: number, radius = 50): Promise<AxiosResponse> =>
    api.get('/weather/alerts', { params: { lat, lng, radius } }),

  getMarineConditions: (lat: number, lng: number): Promise<AxiosResponse> =>
    api.get('/weather/marine', { params: { lat, lng } }),
};

// ---------- Reports ----------
export const reportsApi = {
  submitReport: (reportData: any): Promise<AxiosResponse> =>
    api.post('/reports', reportData),

  getLocationReports: (locationId: string, startDate: string, endDate: string): Promise<AxiosResponse> =>
    api.get(`/reports/location/${locationId}`, { params: { startDate, endDate } }),

  getLocationStats: (locationId: string): Promise<AxiosResponse> =>
    api.get(`/reports/stats/${locationId}`),
};

export default {
  lands: landsApi,
  weather: weatherApi,
  reports: reportsApi,
  auth: authApi,
};
