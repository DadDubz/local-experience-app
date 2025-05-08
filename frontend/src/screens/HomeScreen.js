import React from 'react';
import { View, StyleSheet } from 'react-native';
import PublicLandsMap from '../components/PublicLandsMap';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <PublicLandsMap navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});