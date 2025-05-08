// ReviewListScreen.web.tsx
import React from 'react';

const reviews = [
  { id: '1', name: 'Anna', content: 'Beautiful spot and very quiet!' },
  { id: '2', name: 'James', content: 'Great trout fishing. Will be back!' },
];

const ReviewListScreen: React.FC = () => (
  <div style={{ padding: '1rem' }}>
    {reviews.map((review) => (
      <div key={review.id} style={{ marginBottom: '1rem' }}>
        <strong>{review.name}</strong>
        <p>{review.content}</p>
      </div>
    ))}
  </div>
);

export default ReviewListScreen;
