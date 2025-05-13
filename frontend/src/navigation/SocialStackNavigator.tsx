import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import CreatePostScreen from './CreatePostScreen';

import PostDetailScreen from '@screens/social/PostDetailScreen';

type SocialStackParamList = {
  SocialFeed: undefined;
  CreatePost: undefined;
  PostDetail: { post: any };
};

const Stack = createStackNavigator<SocialStackParamList>();

<Stack.Navigator>
  <Stack.Screen name="SocialFeed" getComponent={SocialFeedScreen} options={{ title: 'Social Feed' }} />
  <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create Post' }} />
  <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post Detail' }} />
</Stack.Navigator>


const SocialFeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://your-api-url/api/posts');
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

    setRefreshing(true);
    fetchPosts();
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity onPress={() => useNavigation.navigate('PostDetail', { post: item })}>
      <View style={styles.postContainer}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
        )}
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
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

const SocialStackNavigator = () => (
  <NavigationContainer independent={true}>
    <Stack.Navigator>
      <Stack.Screen name="SocialFeed" getComponent={SocialFeedScreen} options={{ title: 'Social Feed' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create Post' }} />
      <Stack.Screen
        name="PostDetail"
        component={() => <View><Text>Post Detail Screen</Text></View>}
        options={{ title: 'Post Detail' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

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
});

export default SocialStackNavigator;
