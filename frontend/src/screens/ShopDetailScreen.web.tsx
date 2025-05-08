// ShopDetailScreen.web.tsx
import React from 'react';
import NativeMap from '../components/NativeMap'; // Corrected the path to the NativeMap component

const shop = {
  name: 'Bait & Tackle Pro',
  latitude: 44.942,
  longitude: -91.398,
  description: 'Your one-stop shop for fishing gear and tips.'
};

const ShopDetailScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <h2>{shop.name}</h2>
    <p>{shop.description}</p>
    <NativeMap spot={shop} />
  </div>
);

export default ShopDetailScreen;
