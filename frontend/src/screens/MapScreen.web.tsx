// MapScreen.web.tsx
import React from 'react';
import './MapScreen.web.css';
import NativeMap from '../components/NativeMap';

const region = {
  name: 'Explore Area',
  latitude: 44.938,
  longitude: -91.395,
  description: 'Interactive view of fishing and hiking spots.'
};

  <div className="map-screen-container">
  <div style={{ padding: '1rem' }}>
    <h2>{region.name}</h2>
    <p>{region.description}</p>
    <NativeMap spot={region} />
  </div>
);

export default MapScreen;
