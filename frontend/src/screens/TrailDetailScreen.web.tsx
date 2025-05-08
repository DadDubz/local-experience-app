// TrailDetailScreen.web.tsx
import React from 'react';
import NativeMap from '../../components/NativeMap';

const trail = {
  name: 'Eagle Ridge Trail',
  latitude: 44.94,
  longitude: -91.393,
  description: 'Scenic overlook trail with moderate elevation gain.'
};

const TrailDetailScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <h2>{trail.name}</h2>
    <p>{trail.description}</p>
    <NativeMap spot={trail} />
  </div>
);

export default TrailDetailScreen;