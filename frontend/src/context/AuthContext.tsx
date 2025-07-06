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

// Simulated API functions – replace with your actual implementations
const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    // Replace with real API call
    return {
      data: {
        user: { id: '123', email: credentials.email, name: 'Test User' },
        token: 'dummy_token_abc123',
      },
    };
  },
  register: async (userData: any) => {
    return {
      data: {
        user: { id: '456', email: userData.email, name: userData.name },
        token: 'dummy_token_xyz789',
      },
    };
  },
  getLicenses: async () => {
    return { data: ['Fishing', 'Hunting'] };
  },
};

export { authApi };

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  getLicenses: () => Promise<string[]>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = 'AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authApi.login({ email, password });
      const { user: loggedInUser, token } = response.data;

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
      await AsyncStorage.setItem(TOKEN_KEY, token);

      setUser(loggedInUser);
      return true;
    } catch (e: any) {
      console.error('Login error:', e);
      setError(e?.response?.data?.message || 'Login failed');
      return false;
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      setError(null);
      const response = await authApi.register(userData);
      const { user: registeredUser, token } = response.data;

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(registeredUser));
      await AsyncStorage.setItem(TOKEN_KEY, token);

      setUser(registeredUser);
      return true;
    } catch (e: any) {
      console.error('Registration error:', e);
      setError(e?.response?.data?.message || 'Registration failed');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  }, []);

  const getLicenses = useCallback(async () => {
    try {
      const response = await authApi.getLicenses();
      return response.data;
    } catch (e) {
      console.error('Error fetching licenses:', e);
      return [];
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      getLicenses,
    }),
    [user, loading, error, login, register, logout, getLicenses]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
