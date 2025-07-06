import axios, { AxiosInstance } from 'axios';

declare const API_URL: string;

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (credentials: Credentials) => api.post('/auth/login', credentials),
  register: (userData: UserData) => api.post('/auth/register', userData),
  getLicenses: () => api.get('/auth/licenses'),
};

export default api;
