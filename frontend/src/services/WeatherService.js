// frontend/src/services/weatherService.js
import axios from 'axios';
import { API_URL } from '../config/constants';

class WeatherService {
  static async getCurrentWeather(latitude, longitude) {
    try {
      const response = await axios.get(`${API_URL}/weather/forecast`, {
        params: { lat: latitude, lng: longitude }
      });
      return response.data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  static async getWeatherAlerts(latitude, longitude, radius = 50) {
    try {
      const response = await axios.get(`${API_URL}/weather/alerts`, {
        params: { lat: latitude, lng: longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Alerts fetch error:', error);
      throw new Error('Failed to fetch weather alerts');
    }
  }

  static async getMarineConditions(latitude, longitude) {
    try {
      const response = await axios.get(`${API_URL}/weather/marine`, {
        params: { lat: latitude, lng: longitude }
      });
      return response.data;
    } catch (error) {
      console.error('Marine conditions fetch error:', error);
      throw new Error('Failed to fetch marine conditions');
    }
  }

  static async getForecast(latitude, longitude, days = 7) {
    try {
      const response = await axios.get(`${API_URL}/weather/forecast`, {
        params: { lat: latitude, lng: longitude, days }
      });
      return response.data;
    } catch (error) {
      console.error('Forecast fetch error:', error);
      throw new Error('Failed to fetch forecast');
    }
  }

  static getWeatherIcon(condition, isNight = false) {
    // Map weather conditions to MaterialCommunityIcons names
    const iconMap = {
      'clear': isNight ? 'weather-night' : 'weather-sunny',
      'partly-cloudy': isNight ? 'weather-night-partly-cloudy' : 'weather-partly-cloudy',
      'cloudy': 'weather-cloudy',
      'rain': 'weather-rainy',
      'storm': 'weather-lightning-rainy',
      'snow': 'weather-snowy',
      'fog': 'weather-fog',
      'wind': 'weather-windy',
      'default': 'weather-cloudy'
    };

    return iconMap[condition.toLowerCase()] || iconMap.default;
  }
}

export default WeatherService;
