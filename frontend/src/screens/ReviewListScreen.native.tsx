// ReviewListScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const reviews = [
  { id: '1', name: 'Anna', content: 'Beautiful spot and very quiet!' },
  { id: '2', name: 'James', content: 'Great trout fishing. Will be back!' },
];

const ReviewListScreen: React.FC = () => (
  <FlatList
    style={styles.list}
    data={reviews}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.review}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.content}</Text>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  list: { padding: 16 },
  review: { marginBottom: 12 },
  name: { fontWeight: 'bold' },
});

export default ReviewListScreen;
