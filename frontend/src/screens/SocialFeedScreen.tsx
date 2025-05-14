import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Picker,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const SocialFeedScreen = () => {
  interface Post {
    _id: string;
    caption?: string;
    location?: string;
    image?: string;
    createdAt: string;
    likes?: number;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://your-api-url/api/posts');
      let data = response.data.posts || [];

      // Filter logic
      if (filter === 'catch') {
        data = data.filter((post: Post) => post.caption?.toLowerCase().includes('catch'));
      } else if (filter === 'liked') {
        data = data.sort((a: Post, b: Post) => (b.likes || 0) - (a.likes || 0));
      }

      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLike = async (postId: string) => {
    try {
      await axios.post(`http://your-api-url/api/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
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
      <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(item._id)}>
        <Icon name="thumb-up" size={20} color="#007AFF" />
        <Text style={styles.likeText}>Like ({item.likes || 0})</Text>
      </TouchableOpacity>
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
    <View style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <Picker
          selectedValue={filter}
          style={styles.picker}
          onValueChange={(value) => setFilter(value)}
        >
          <Picker.Item label="All Posts" value="all" />
          <Picker.Item label="Catches Only" value="catch" />
          <Picker.Item label="Most Liked" value="liked" />
        </Picker>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.feedContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
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
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeText: {
    marginLeft: 5,
    color: '#007AFF',
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  filterLabel: {
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 14,
  },
  picker: {
    flex: 1,
    height: 40,
  },
});

export default SocialFeedScreen;
