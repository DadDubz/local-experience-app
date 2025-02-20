import React, { createContext, useContext } from 'react';
import { useLocation } from '../hooks/useLocation';

const LocationContext = createContext(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const locationData = useLocation({ startWatching: true });

  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
};