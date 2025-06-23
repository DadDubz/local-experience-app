import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AccountInfoScreen from '@screens/AccountInfoScreen';


const AccountInfoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Info</Text>
      <Text>Name: Jagr Hofstedt</Text>
      <Text>Email: jagr@example.com</Text>
      {/* Add any user info or UI elements here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AccountInfoScreen;
