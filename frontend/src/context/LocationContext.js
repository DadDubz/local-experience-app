import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '../hooks/uselocation';

const LocationContext = createContext(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
};

// Removed duplicate declaration of LocationProvider

LocationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const LocationProvider = ({ children }) => {
  const locationData = useLocation({ startWatching: true });

  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
};