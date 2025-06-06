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
import { useAuth } from '../../context/AuthContext';

// Define the Post interface
interface Post {
  _id: string;
  image?: string;
  caption: string;
  location: string;
  createdAt: string;
}

const UserPostsScreen = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://your-api-url/api/posts/user/${user._id}`);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to load user posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
      )}
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserPosts();
  };

  // Removed duplicate renderPost function

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
  feedContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: 'gray',
  },
  meta: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserPostsScreen;
