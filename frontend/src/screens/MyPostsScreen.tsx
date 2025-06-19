import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const mockPosts = [
  { id: '1', title: 'Caught a trout at Hidden Creek!' },
  { id: '2', title: 'Best fishing spot in Chippewa Falls' },
  { id: '3', title: 'Nature trail adventures last weekend' },
];

const MyPostsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Posts</Text>
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.post}>{item.title}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  post: {
    fontSize: 16,
    marginVertical: 6,
  },
});

export default MyPostsScreen;
