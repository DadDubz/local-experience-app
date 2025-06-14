// AddReviewScreen.web.tsx
import * as React from 'react';
import { useState } from 'react';

const AddReviewScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');

  const submitReview = () => {
    console.log('Review submitted:', { name, review });
    setName(''); setReview('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <React.Fragment>
        <label><strong>Your Name</strong></label><br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        /><br /><br />
        <label><strong>Review</strong></label><br />
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
        /><br /><br />
        <button onClick={submitReview}>Submit Review</button>
      </React.Fragment>
    </div>
  );
};

export default AddReviewScreen;
