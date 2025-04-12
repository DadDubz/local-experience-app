// frontend/src/screens/ShopDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { BaitShopService } from '../services/api';

const ShopDetailScreen = ({ route, navigation }) => {
  const { shopId } = route.params;
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const [shopDetails, shopInventory] = await Promise.all([
        BaitShopService.getShopDetails(shopId),
        BaitShopService.getInventory(shopId)
      ]);
      setShop(shopDetails.data);
      setInventory(shopInventory.data);
    } catch (error) {
      console.error('Error fetching shop details:', error);
      Alert.alert('Error', 'Failed to load shop information');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (shop?.phone) {
      Linking.openURL(`tel:${shop.phone}`);
    }
  };

  const handleDirections = () => {
    if (shop?.latitude && shop?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleReserveItem = async (itemId) => {
    try {
      await BaitShopService.reserveItems(shopId, [itemId]);
      Alert.alert('Success', 'Item reserved successfully');
      fetchShopDetails(); // Refresh inventory
    } catch (error) {
      Alert.alert('Error', 'Failed to reserve item');
    }
  };

  const filterInventory = () => {
    if (selectedCategory === 'all') return inventory;
    return inventory.filter(item => item.category === selectedCategory);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Shop Header */}
      <View style={styles.header}>
        <Text style={styles.shopName}>{shop?.name}</Text>
        <Text style={styles.shopType}>{shop?.type}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <MaterialCommunityIcons name="phone" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
            <MaterialCommunityIcons name="directions" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      {shop?.latitude && shop?.longitude && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: shop.latitude,
              longitude: shop.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: shop.latitude,
                longitude: shop.longitude
              }}
              title={shop.name}
            />
          </MapView>
        </View>
      )}

      {/* Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hours of Operation</Text>
        {shop?.hours?.map((hour, index) => (
          <View key={index} style={styles.hourRow}>
            <Text style={styles.day}>{hour.day}</Text>
            <Text style={styles.hours}>{hour.hours}</Text>
          </View>
        ))}
      </View>

      {/* Inventory */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory</Text>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'all' && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'all' && styles.categoryButtonTextActive
            ]}>All</Text>
          </TouchableOpacity>
          {['bait', 'tackle', 'gear', 'licenses'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Inventory Items */}
        {filterInventory().map((item) => (
          <View key={item.id} style={styles.inventoryItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.itemActions}>
              {item.inStock ? (
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => handleReserveItem(item.id)}
                >
                  <Text style={styles.reserveButtonText}>Reserve</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.outOfStock}>Out of Stock</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  shopType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#007AFF',
    marginTop: 5,
  },
  mapContainer: {
    height: 200,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  section: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  day: {
    fontWeight: '500',
  },
  hours: {
    color: '#666',
  },
  categoryFilter: {
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  inventoryItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  itemDescription: {
    color: '#666',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  itemActions: {
    justifyContent: 'center',
  },
  reserveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  outOfStock: {
    color: '#D32F2F',
    fontWeight: '500',
  },
});

export default ShopDetailScreen;
