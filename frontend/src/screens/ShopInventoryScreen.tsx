import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const sampleInventory = [
  { id: '1', name: 'Fishing Rod', price: '$120' },
  { id: '2', name: 'Camping Tent', price: '$200' },
  { id: '3', name: 'Hiking Boots', price: '$150' },
];

const ShopInventoryScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Inventory</Text>
      <FlatList
        data={sampleInventory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ShopInventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#800000', // Maroon
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
  },
});