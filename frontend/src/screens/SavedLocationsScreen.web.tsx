// SavedLocationsScreen.web.tsx
import React from 'react';

const locations = [
  { id: '1', name: 'Trout Creek' },
  { id: '2', name: 'Birch Lake' },
];

const SavedLocationsScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <h2>Saved Locations</h2>
    <ul>
      {locations.map((loc) => (
        <li key={loc.id}>{loc.name}</li>
      ))}
    </ul>
  </div>
);

export default SavedLocationsScreen;
