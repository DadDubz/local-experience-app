// frontend/src/context/AuthContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ensure authApi is exported correctly
const authApi = {
  login: async (credentials) => { /* implementation */ },
  register: async (userData) => { /* implementation */ },
  getLicenses: async () => { /* implementation */ },
};

export { authApi };

// Constants for storage keys
const USER_KEY = 'user';
const TOKEN_KEY = 'token';

// Create the context
const AuthContext = createContext();

// Optional: set a display name for debugging purposes
AuthContext.displayName = 'AuthContext';

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps your app and makes auth object available to any
// child component that calls useAuth().
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in when app loads
  useEffect(() => {
    checkUser();
  }, []);

  // Check if there's a logged in user
  const checkUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        // Optionally, you could verify the token here by making a request to the API.
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login({ email, password });
      const { user: loggedInUser, token } = response.data;

      // Store user and token
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
      await AsyncStorage.setItem(TOKEN_KEY, token);

      setUser(loggedInUser);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      setError(e.response?.data?.message || 'An error occurred during login');
      return false;
    }
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await authApi.register(userData);
      const { user: registeredUser, token } = response.data;

      // Store user and token
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(registeredUser));
      await AsyncStorage.setItem(TOKEN_KEY, token);

      setUser(registeredUser);
      return true;
    } catch (e) {
      console.error('Registration error:', e);
      setError(e.response?.data?.message || 'An error occurred during registration');
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } catch (e) {
      console.error('Error removing user data:', e);
    }
  }, []);

  // Get user's licenses
  const getLicenses = useCallback(async () => {
    try {
      const response = await authApi.getLicenses();
      return response.data;
    } catch (e) {
      console.error('Error fetching licenses:', e);
      return [];
    }
  }, []);

  // OPTIONAL: Function to refresh token (if your API supports it)
  // const refreshToken = useCallback(async () => {
  //   try {
  //     const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
  //     if (!storedToken) throw new Error('No token found');
  //     const response = await authApi.refreshToken({ token: storedToken });
  //     const { token: newToken } = response.data;
  //     await AsyncStorage.setItem(TOKEN_KEY, newToken);
  //     return newToken;
  //   } catch (e) {
  //     console.error('Error refreshing token:', e);
  //     logout();
  //     return null;
  //   }
  // }, [logout]);

  // Memoize the context value to optimize re-renders
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    getLicenses,
    // refreshToken, // Uncomment if token refresh is implemented
  }), [user, loading, error, login, register, logout, getLicenses]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

module.exports = {
  // Your existing ESLint configuration
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    requireConfigFile: false, // Ensure Babel works without a config file
    babelOptions: {
      presets: ['@babel/preset-react'], // Add React preset for JSX
    },
  },
  plugins: ['react'], // Add React plugin if not already present
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // Add React recommended rules
  ],
};
