import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// --------------------
// API BASE URL
// --------------------
// Web on same machine:
const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_URL as string) || 'http://localhost:5000';

// Create an axios instance so we can attach token headers consistently
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load auth state on boot
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) {
          setToken(storedToken);
          api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error('Error loading auth state:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);

      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      console.log('LOGIN ->', `${API_BASE_URL}/api/auth/login`, payload);

      const res = await api.post('/api/auth/login', payload);

      const resUser = res.data?.user;
      const resToken = res.data?.token;

      if (!resUser || !resToken) {
        setError('Login response missing user/token');
        return false;
      }

      setUser(resUser);
      setToken(resToken);

      api.defaults.headers.common.Authorization = `Bearer ${resToken}`;

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(resUser));
      await AsyncStorage.setItem(TOKEN_KEY, resToken);

      return true;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Login failed';

      console.error('Login error:', msg, e?.response?.data);
      setError(msg);
      return false;
    }
  }, []);

  const register = useCallback(
    async (userData: { name: string; email: string; password: string }) => {
      try {
        setError(null);

        const payload = {
          name: (userData.name || '').trim(),
          email: (userData.email || '').trim().toLowerCase(),
          password: userData.password,
        };

        console.log('REGISTER ->', `${API_BASE_URL}/api/auth/register`, {
          name: payload.name,
          email: payload.email,
          password: '***',
        });

        const res = await api.post('/api/auth/register', payload);

        const resUser = res.data?.user;
        const resToken = res.data?.token;

        if (!resUser || !resToken) {
          setError('Registration response missing user/token');
          return false;
        }

        setUser(resUser);
        setToken(resToken);

        api.defaults.headers.common.Authorization = `Bearer ${resToken}`;

        await AsyncStorage.setItem(USER_KEY, JSON.stringify(resUser));
        await AsyncStorage.setItem(TOKEN_KEY, resToken);

        return true;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Registration failed';

        console.error('Registration error:', msg, e?.response?.data);
        setError(msg);
        return false;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common.Authorization;
      setUser(null);
      setToken(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, token, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Export api instance for other services to use
export { api, API_BASE_URL };
