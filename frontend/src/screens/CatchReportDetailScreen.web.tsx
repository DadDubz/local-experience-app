// CatchReportDetailScreen.web.tsx
import React from 'react';

const report = {
  species: 'Brook Trout',
  location: 'Hidden Creek',
  notes: 'Caught early morning with spinnerbait.'
};

const CatchReportDetailScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    <h2>Catch Report</h2>
    <p><strong>Species:</strong> {report.species}</p>
    <p><strong>Location:</strong> {report.location}</p>
    <p><strong>Notes:</strong> {report.notes}</p>
  </div>
);

export default CatchReportDetailScreen;
