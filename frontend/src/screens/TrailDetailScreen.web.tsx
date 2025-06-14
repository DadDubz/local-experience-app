// TrailDetailScreen.web.tsx
import LeafletMap from '@components/LeafletMap.web';
import leaflet from '@components/NativeMap.web';
import React from 'react';

const trail = {
  name: 'Eagle Ridge Trail',
  latitude: 44.94,
  longitude: -91.393,
  description: 'Scenic overlook trail with moderate elevation gain.'
};

const TrailDetailScreen: React.FC = () => (
  <div className="trail-detail-container">
    <h2>{trail.name}</h2>
    <p>{trail.description}</p>
    <LeafletMap spot={trail} />
  </div>
);

export default TrailDetailScreen;
