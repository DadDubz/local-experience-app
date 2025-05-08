// SettingsScreen.web.tsx
import React from 'react';

const SettingsScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <label>
      <input type="checkbox" checked readOnly /> Enable Notifications
    </label>
  </div>
);

export default SettingsScreen;
