import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type Post = {
  _id: string;
  image?: string;
  caption: string;
  location?: string;
  createdAt: string;
};

type RouteParams = {
  PostDetail: { post: Post };
};

const PostDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'PostDetail'>>();
  const { post } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />
      )}
      <Text style={styles.caption}>{post.caption}</Text>
      {post.location && <Text style={styles.location}>📍 {post.location}</Text>}
      <Text style={styles.timestamp}>
        {new Date(post.createdAt).toLocaleString()}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  caption: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    color: 'gray',
  },
});

export default PostDetailScreen;
