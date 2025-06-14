// GuideScreen.web.tsx
import React from 'react';




const guideArea = {
  name: 'Chippewa River Guide Zone',
  latitude: 44.941,
  longitude: -91.397,
  description: 'Where guides are currently available.'
};

const GuideScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <h2>{guideArea.name}</h2>
    <p>{guideArea.description}</p>
    <NativeMap spot={guideArea} />
  </div>
);

export default NativeMap;
// Removed duplicate default export for NativeMap
