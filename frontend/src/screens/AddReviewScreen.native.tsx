// AddReviewScreen.native.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddReviewScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');

  const submitReview = () => {
    console.log('Review submitted:', { name, review });
    setName(''); setReview('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text style={styles.label}>Review</Text>
      <TextInput
        value={review}
        onChangeText={setReview}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      <Button title="Submit Review" onPress={submitReview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});

export default AddReviewScreen;