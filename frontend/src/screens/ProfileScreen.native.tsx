// ProfileScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.name}>John Doe</Text>
    <Text style={styles.email}>johndoe@example.com</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#666' },
});

export default ProfileScreen;
