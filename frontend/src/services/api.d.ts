import axios, { AxiosInstance } from 'axios';

declare const API_URL: string;

export declare const api: AxiosInstance;

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
}

export interface AuthApi {
  login: (credentials: Credentials) => Promise<any>;
  register: (userData: UserData) => Promise<any>;
  getLicenses: () => Promise<any>;
}

export declare const authApi: AuthApi;

export default api;
