// frontend/src/screens/ReportsListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { reportsApi } from '@services/api';

const ReportsListScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, nearby, following
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [filter, selectedSpecies]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getReports({
        type: filter,
        species: selectedSpecies
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const renderReport = ({ item }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}
    >
      <View style={styles.reportHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.avatar || '/api/placeholder/40/40' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => navigation.navigate('LocationDetail', { locationId: item.locationId })}
        >
          <MaterialCommunityIcons name="map-marker" size={16} color="#007AFF" />
          <Text style={styles.locationText}>{item.location.name}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.catchDetails}>
        <View style={styles.speciesContainer}>
          <MaterialCommunityIcons name="fish" size={24} color="#666" />
          <Text style={styles.speciesText}>{item.species}</Text>
        </View>

        <View style={styles.measurementGrid}>
          <View style={styles.measurement}>
            <Text style={styles.measurementValue}>{item.weight}lbs</Text>
            <Text style={styles.measurementLabel}>Weight</Text>
          </View>
          <View style={styles.measurement}>
            <Text style={styles.measurementValue}>{item.length}"</Text>
            <Text style={styles.measurementLabel}>Length</Text>
          </View>
          {item.temperature && (
            <View style={styles.measurement}>
              <Text style={styles.measurementValue}>{item.temperature}°F</Text>
              <Text style={styles.measurementLabel}>Temp</Text>
            </View>
          )}
        </View>

        {item.photos?.length > 0 && (
          <View style={styles.photoGrid}>
            {item.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.photo}
              />
            ))}
          </View>
        )}

        {item.notes && (
          <Text style={styles.notes}>{item.notes}</Text>
        )}

        <View style={styles.conditions}>
          <MaterialCommunityIcons
            name="weather-partly-cloudy"
            size={16}
            color="#666"
          />
          <Text style={styles.conditionsText}>
            {item.weather} • {item.waterConditions}
          </Text>
        </View>
      </View>

      <View style={styles.reportFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="thumb-up-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes} Likes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="comment-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments} Comments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="share-outline" size={20} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'nearby' && styles.filterButtonActive]}
          onPress={() => setFilter('nearby')}
        >
          <Text style={[styles.filterText, filter === 'nearby' && styles.filterTextActive]}>
            Nearby
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'following' && styles.filterButtonActive]}
          onPress={() => setFilter('following')}
        >
          <Text style={[styles.filterText, filter === 'following' && styles.filterTextActive]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.speciesFilter}
      >
        {['Bass', 'Trout', 'Pike', 'Catfish', 'Salmon'].map((species) => (
          <TouchableOpacity
            key={species}
            style={[
              styles.speciesButton,
              selectedSpecies === species && styles.speciesButtonActive
            ]}
            onPress={() => setSelectedSpecies(
              selectedSpecies === species ? null : species
            )}
          >
            <Text style={[
              styles.speciesButtonText,
              selectedSpecies === species && styles.speciesButtonTextActive
            ]}>
              {species}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddReport')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
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
    padding: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  speciesFilter: {
    flexDirection: 'row',
  },
  speciesButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  speciesButtonActive: {
    backgroundColor: '#007AFF',
  },
  speciesButtonText: {
    color: '#666',
  },
  speciesButtonTextActive: {
    color: '#fff',
  },
  list: {
    padding: 15,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: '500',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  locationText: {
    color: '#007AFF',
    marginLeft: 5,
    fontSize: 12,
  },
  catchDetails: {
    marginBottom: 15,
  },
  speciesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  speciesText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
  },
  measurementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  measurement: {
    alignItems: 'center',
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  measurementLabel: {
    color: '#666',
    fontSize: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  notes: {
    color: '#333',
    marginBottom: 15,
  },
  conditions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionsText: {
    color: '#666',
    marginLeft: 5,
    fontSize: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#666',
    marginLeft: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default ReportsListScreen;