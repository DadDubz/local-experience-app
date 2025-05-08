// AddCatchReportScreen.web.tsx
import React, { useState } from 'react';
import './AddCatchReportScreen.web.css';

const AddCatchReportScreen: React.FC = () => {
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const submitReport = () => {
    console.log('Catch report submitted:', { species, location, notes });
    setSpecies(''); setLocation(''); setNotes('');
  };

    return (
  <div className="add-catch-report-container">
    <div style={{ padding: '1rem' }}>
      <label><strong>Fish Species</strong></label><br />
      <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Enter fish species" /><br /><br />
      <label><strong>Location</strong></label><br />
      <input value={location} onChange={(e) => setLocation(e.target.value)} /><br /><br />
      <label><strong>Notes</strong></label><br />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} /><br /><br />
      <button onClick={submitReport}>Submit Catch</button>
    </div>
  </div>
  );
};

export default AddCatchReportScreen;