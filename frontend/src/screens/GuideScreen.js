import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuidesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Guides Screen (Coming Soon!)</Text>
    </View>
  );
};

export default GuidesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
