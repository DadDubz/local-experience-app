// SettingsScreen.native.tsx
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const SettingsScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.option}>Enable Notifications</Text>
    <Switch value={true} onValueChange={() => {}} />
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  option: { fontSize: 16, marginBottom: 12 },
});

export default SettingsScreen;

