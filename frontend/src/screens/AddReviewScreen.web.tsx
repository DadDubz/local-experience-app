// AddReviewScreen.web.tsx
import React, { useState } from 'react';

const AddReviewScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');

  const submitReview = () => {
    console.log('Review submitted:', { name, review });
    setName(''); setReview('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <label><strong>Your Name</strong></label><br />
      <input value={name} onChange={(e) => setName(e.target.value)} /><br /><br />
      <label><strong>Review</strong></label><br />
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={4}
      /><br /><br />
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
};

export default AddReviewScreen;
