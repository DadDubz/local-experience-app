import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:5000';

export default {
  baseURL: `${API_URL}/api`,
};
