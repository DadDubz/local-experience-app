// frontend/src/screens/SpeciesGuideScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SpeciesGuideScreen = ({ navigation }) => {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Species' },
    { id: 'freshwater', label: 'Freshwater' },
    { id: 'saltwater', label: 'Saltwater' },
    { id: 'common', label: 'Most Common' },
    { id: 'seasonal', label: 'In Season' }
  ];

  useEffect(() => {
    fetchSpecies();
  }, [selectedCategory]);

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      // Replace with your API call
      const response = await fishingApi.getSpecies(selectedCategory);
      setSpecies(response.data);
    } catch (error) {
      console.error('Error fetching species:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSpeciesCard = ({ item }) => (
    <TouchableOpacity
      style={styles.speciesCard}
      onPress={() => navigation.navigate('SpeciesDetail', { species: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.speciesImage} />

      <View style={styles.speciesInfo}>
        <View style={styles.speciesHeader}>
          <Text style={styles.speciesName}>{item.commonName}</Text>
          <Text style={styles.scientificName}>{item.scientificName}</Text>
        </View>

        <View style={styles.speciesStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="ruler" size={16} color="#666" />
            <Text style={styles.statText}>
              {item.averageSize} inches
            </Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="scale" size={16} color="#666" />
            <Text style={styles.statText}>
              {item.averageWeight} lbs
            </Text>
          </View>
        </View>

        <View style={styles.seasonalityContainer}>
          {item.bestSeasons.map((season) => (
            <View
              key={season}
              style={[styles.seasonTag, { backgroundColor: getSeasonColor(season) }]}
            >
              <Text style={styles.seasonText}>{season}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickInfo}>
          <Text style={styles.habitatText}>
            <MaterialCommunityIcons name="map-marker" size={14} color="#666" />
            {item.habitat}
          </Text>
          <Text style={styles.techniqueText}>
            <MaterialCommunityIcons name="fish" size={14} color="#666" />
            {item.bestTechniques.join(', ')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getSeasonColor = (season) => {
    const colors = {
      Spring: '#4CAF50',
      Summer: '#FF9800',
      Fall: '#795548',
      Winter: '#2196F3'
    };
    return colors[season] || '#666';
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search species..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Species List */}
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={species.filter(s =>
            s.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderSpeciesCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.speciesList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryList: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  speciesList: {
    padding: 15,
  },
  speciesCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  speciesImage: {
    width: '100%',
    height: 200,
  },
  speciesInfo: {
    padding: 15,
  },
  speciesHeader: {
    marginBottom: 10,
  },
  speciesName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scientificName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  speciesStats: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 5,
    color: '#666',
  },
  seasonalityContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  seasonTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  seasonText: {
    color: '#fff',
    fontSize: 12,
  },
  quickInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  habitatText: {
    color: '#666',
    marginBottom: 5,
  },
  techniqueText: {
    color: '#666',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default SpeciesGuideScreen;
