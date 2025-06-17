// frontend/src/screens/ProfileScreen.web.tsx
import * as React from 'react';
import { View, useWindowDimensions, StyleSheet, Text } from 'react-native';
import { TabView, SceneMap, TabBar, TabBarProps } from 'react-native-tab-view';

import AccountInfoScreen from './AccountInfoScreen';
import MyPostsScreen from './MyPostsScreen';

const renderScene = SceneMap({
  accountInfo: AccountInfoScreen,
  myPosts: MyPostsScreen,
});

const ProfileScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'accountInfo', title: 'Account Info' },
    { key: 'myPosts', title: 'My Posts' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props: TabBarProps<any>) => (
        <TabBar
          {...props}
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          labelStyle={styles.label}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#007AFF',
  },
  label: {
    color: '#000',
    fontWeight: '600',
  },
});

export default ProfileScreen;
