// frontend/src/screens/SpeciesDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'recharts';

const SpeciesDetailScreen = ({ route, navigation }) => {
  const { species } = route.params;
  const [catchData, setCatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeciesData();
  }, []);

  const fetchSpeciesData = async () => {
    try {
      const response = await fishingApi.getSpeciesStats(species.id);
      setCatchData(response.data);
    } catch (error) {
      console.error('Error fetching species data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRegulationsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Regulations & Limits</Text>
      <View style={styles.regulationItem}>
        <MaterialCommunityIcons name="ruler" size={20} color="#666" />
        <View style={styles.regulationInfo}>
          <Text style={styles.regulationTitle}>Size Limit</Text>
          <Text style={styles.regulationText}>Minimum: {species.minSize} inches</Text>
          {species.maxSize && (
            <Text style={styles.regulationText}>Maximum: {species.maxSize} inches</Text>
          )}
        </View>
      </View>

      <View style={styles.regulationItem}>
        <MaterialCommunityIcons name="fish" size={20} color="#666" />
        <View style={styles.regulationInfo}>
          <Text style={styles.regulationTitle}>Bag Limit</Text>
          <Text style={styles.regulationText}>{species.bagLimit} per day</Text>
        </View>
      </View>

      <View style={styles.regulationItem}>
        <MaterialCommunityIcons name="calendar" size={20} color="#666" />
        <View style={styles.regulationInfo}>
          <Text style={styles.regulationTitle}>Season</Text>
          <Text style={styles.regulationText}>{species.seasonDates}</Text>
        </View>
      </View>
    </View>
  );

  const renderTechniquesSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fishing Techniques</Text>
      {species.techniques.map((technique, index) => (
        <View key={index} style={styles.techniqueItem}>
          <MaterialCommunityIcons name={technique.icon} size={24} color="#007AFF" />
          <View style={styles.techniqueInfo}>
            <Text style={styles.techniqueName}>{technique.name}</Text>
            <Text style={styles.techniqueDescription}>{technique.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderBaitSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recommended Bait</Text>
      <View style={styles.baitGrid}>
        {species.bait.map((item, index) => (
          <View key={index} style={styles.baitItem}>
            <Image source={{ uri: item.image }} style={styles.baitImage} />
            <Text style={styles.baitName}>{item.name}</Text>
            <Text style={styles.baitType}>{item.type}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHabitatSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Habitat & Behavior</Text>
      <View style={styles.habitatInfo}>
        <Text style={styles.habitatDescription}>{species.habitatDescription}</Text>

        <View style={styles.habitatDetails}>
          <View style={styles.habitatItem}>
            <MaterialCommunityIcons name="waves" size={20} color="#666" />
            <Text style={styles.habitatText}>Depth: {species.typicalDepth}</Text>
          </View>

          <View style={styles.habitatItem}>
            <MaterialCommunityIcons name="water" size={20} color="#666" />
            <Text style={styles.habitatText}>Water: {species.waterType}</Text>
          </View>

          <View style={styles.habitatItem}>
            <MaterialCommunityIcons name="thermometer" size={20} color="#666" />
            <Text style={styles.habitatText}>Temp: {species.temperatureRange}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCatchDataSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Catch Statistics</Text>
      {catchData && (
        <>
          <LineChart
            data={catchData.monthly}
            width={Dimensions.get('window').width - 40}
            height={200}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Line type="monotone" dataKey="catches" stroke="#007AFF" />
          </LineChart>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{catchData.averageWeight}lbs</Text>
              <Text style={styles.statLabel}>Avg Weight</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{catchData.averageLength}"</Text>
              <Text style={styles.statLabel}>Avg Length</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{catchData.catchRate}%</Text>
              <Text style={styles.statLabel}>Catch Rate</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: species.imageUrl }} style={styles.heroImage} />

      <View style={styles.header}>
        <Text style={styles.commonName}>{species.commonName}</Text>
        <Text style={styles.scientificName}>{species.scientificName}</Text>
      </View>

      {renderRegulationsSection()}
      {renderHabitatSection()}
      {renderTechniquesSection()}
      {renderBaitSection()}
      {renderCatchDataSection()}

      <TouchableOpacity
        style={styles.findSpotsButton}
        onPress={() => navigation.navigate('MapView', {
          filter: 'species',
          speciesId: species.id
        })}
      >
        <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
        <Text style={styles.findSpotsText}>Find Fishing Spots</Text>
      </TouchableOpacity>
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
  heroImage: {
    width: '100%',
    height: 250,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  commonName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scientificName: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  regulationItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  regulationInfo: {
    marginLeft: 15,
  },
  regulationTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  regulationText: {
    color: '#666',
    marginTop: 2,
  },
  techniqueItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  techniqueInfo: {
    marginLeft: 15,
    flex: 1,
  },
  techniqueName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  techniqueDescription: {
    color: '#666',
    lineHeight: 20,
  },
  baitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  baitItem: {
    width: '48%',
    marginBottom: 15,
  },
  baitImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  baitName: {
    fontSize: 14,
    fontWeight: '500',
  },
  baitType: {
    fontSize: 12,
    color: '#666',
  },
  habitatInfo: {
    marginBottom: 15,
  },
  habitatDescription: {
    lineHeight: 22,
    marginBottom: 15,
  },
  habitatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitatText: {
    marginLeft: 5,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statBox: {
    alignItems: 'center',
    width: '30%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  findSpotsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  findSpotsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  }
});

export default SpeciesDetailScreen;