// src/screens/FishingSpotDetailScreen.web.tsx
import React from 'react';
import NativeMap from '../components/NativeMap'; // Adjusted the path to match the correct location

interface Spot {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

const spot: Spot = {
  name: 'Hidden Creek',
  latitude: 44.9362,
  longitude: -91.3925,
  description: 'A peaceful trout stream in the woods.'
};

const FishingSpotDetailScreen: React.FC = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>{spot.name}</h1>
      <p>{spot.description}</p>
      <NativeMap spot={spot} />
    </div>
  );
};

export default FishingSpotDetailScreen;