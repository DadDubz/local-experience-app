// SavedLocationsScreen.native.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const locations = [
  { id: '1', name: 'Trout Creek' },
  { id: '2', name: 'Birch Lake' },
];

const SavedLocationsScreen: React.FC = () => (
  <FlatList
    style={styles.list}
    data={locations}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Text>{item.name}</Text>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  list: { padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default SavedLocationsScreen;
