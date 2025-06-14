// CampingScreen.web.tsx
import NativeMap from '@components/NativeMap.web';
import * as React from 'react';

const campingSpot = {
  name: 'Whispering Pines Campground',
  latitude: 44.935,
  longitude: -91.39,
  description: 'Great spot for weekend camping with family.'
};

const CampingScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
      <>
        <h1>{campingSpot.name}</h1>
        <p>{campingSpot.description}</p>
        <NativeMap spot={campingSpot} />
      </>
  </div>
);

export default CampingScreen;
