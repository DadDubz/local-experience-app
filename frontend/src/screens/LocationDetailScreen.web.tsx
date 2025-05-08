// LocationDetailScreen.web.tsx
import React from 'react';
import NativeMap from '@components/NativeMap';

const location = {
  name: 'Old Mill Park',
  latitude: 44.937,
  longitude: -91.391,
  description: 'Historic riverside location with great trails.'
};

const LocationDetailScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <h2>{location.name}</h2>
    <p>{location.description}</p>
    <NativeMap spot={location} />
  </div>
);

export default LocationDetailScreen;