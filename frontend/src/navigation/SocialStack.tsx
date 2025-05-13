// frontend/src/navigation/SocialStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SocialFeedScreen from '@screens/SocialFeedScreen';
import CreatePostScreen from '@screens/CreatePostScreen';

const Stack = createStackNavigator();

const SocialStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="SocialFeed" component={SocialFeedScreen} options={{ title: 'Community' }} />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'New Post' }} />
  </Stack.Navigator>
);

export default SocialStack;
