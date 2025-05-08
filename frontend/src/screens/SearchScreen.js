// frontend/src/screens/SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocationContext } from '@context/LocationContext';
import { landsApi } from '@services/api';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    distance: 50,
    difficulty: 'all'
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const { location } = useLocationContext();

  const filterOptions = [
    { id: 'all', label: 'All', icon: 'map-marker' },
    { id: 'fishing', label: 'Fishing', icon: 'fish' },
    { id: 'trails', label: 'Trails', icon: 'hiking' },
    { id: 'camping', label: 'Camping', icon: 'tent' },
    { id: 'parks', label: 'Parks', icon: 'tree' }
  ];

  const difficultyOptions = [
    { id: 'all', label: 'Any Difficulty' },
    { id: 'easy', label: 'Easy' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'hard', label: 'Hard' }
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await landsApi.searchLocations({
        query: searchQuery,
        lat: location.latitude,
        lng: location.longitude,
        radius: filters.distance,
        type: filters.type,
        difficulty: filters.difficulty
      });
      setResults(response.data);

      // Save to recent searches
      if (searchQuery.trim()) {
        const newRecentSearches = [
          { query: searchQuery, timestamp: Date.now() },
          ...recentSearches.filter(s => s.query !== searchQuery)
        ].slice(0, 5);
        setRecentSearches(newRecentSearches);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('LocationDetail', { location: item })}
    >
      <View style={styles.resultContent}>
        <MaterialCommunityIcons
          name={getLocationIcon(item.type)}
          size={24}
          color="#007AFF"
        />
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.name}</Text>
          <Text style={styles.resultSubtitle}>
            {item.distance.toFixed(1)} miles • {item.type}
          </Text>
          {item.difficulty && (
            <View style={[styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(item.difficulty) }]}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          )}
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  const getLocationIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'fishing':
        return 'fish';
      case 'trail':
        return 'hiking';
      case 'camping':
        return 'tent';
      case 'park':
        return 'tree';
      default:
        return 'map-marker';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#4CAF50';
      case 'moderate':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <MaterialCommunityIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterButton,
                filters.type === option.id && styles.filterButtonActive
              ]}
              onPress={() => setFilters({ ...filters, type: option.id })}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={20}
                color={filters.type === option.id ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.filterText,
                  filters.type === option.id && styles.filterTextActive
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results or Recent Searches */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentSearchItem}
              onPress={() => {
                setSearchQuery(search.query);
                handleSearch();
              }}
            >
              <MaterialCommunityIcons name="history" size={20} color="#666" />
              <Text style={styles.recentSearchText}>{search.query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  filtersContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    marginLeft: 5,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    padding: 15,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundCol