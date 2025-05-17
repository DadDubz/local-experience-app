import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@context/AuthContext';

const ProfileInfoScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      {/* Add more profile info here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: 'gray', marginTop: 8 },
});

export default ProfileInfoScreen;
