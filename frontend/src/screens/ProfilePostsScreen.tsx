import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { useAuth } from '@context/AuthContext';

const ProfilePostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchMyPosts = async () => {
    try {
      const response = await axios.get('http://your-api-url/api/posts');
      const myPosts = response.data.posts.filter(p => p.user._id === user._id);
      setPosts(myPosts);
    } catch (error) {
      console.error('Failed to load my posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyPosts();
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
      )}
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.meta}>Likes: {item.likes.length}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderPost}
      contentContainerStyle={styles.feedContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  feedContainer: { padding: 10, backgroundColor: '#fff' },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  caption: { fontSize: 16, fontWeight: '500', marginBottom: 5 },
  location: { fontSize: 14, color: 'gray' },
  meta: { fontSize: 12, color: 'gray', marginTop: 4 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ProfilePostsScreen;
