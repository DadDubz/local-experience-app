// frontend/src/screens/MyPostsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

type Post = {
  _id: string;
  user: string;
  image?: string;
  caption: string;
  location: string;
  createdAt: string;
  likes?: number;
};
const MyPostsScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get('http://your-api-url/api/posts');
      const myPosts = res.data.posts.filter((p: Post) => p.user === user._id);
      setPosts(myPosts);
    } catch (error) {
      console.error('Failed to fetch user posts', error);
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

  const handleLike = async (postId: string) => {
    try {
      await axios.post(`http://your-api-url/api/posts/${postId}/like`);
      fetchMyPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
      <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(item._id)}>
        <Icon name="thumb-up" size={20} color="#007AFF" />
        <Text style={styles.likeText}>Like ({item.likes || 0})</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item._id}
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
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 1,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
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
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeText: {
    marginLeft: 6,
    color: '#007AFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default MyPostsScreen;
