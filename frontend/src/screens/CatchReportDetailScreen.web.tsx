import * as React from 'react';

interface CatchReport {
  species: string;
  location: string;
  notes: string;
}

const report: CatchReport = {
  species: 'Brook Trout',
  location: 'Hidden Creek',
  notes: 'Caught early morning with spinnerbait.',
};

const CatchReportDetailScreen: React.FC = () => {
  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '1rem' }}>Catch Report</h2>
      <div>
        <p>
          <strong>Species:</strong> {report.species}
        </p>
        <p><strong>Location:</strong> {report.location}</p>
        <p><strong>Notes:</strong> {report.notes}</p>
      </div>
    </div>
  );
};

export default CatchReportDetailScreen;
