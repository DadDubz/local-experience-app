// frontend/src/screens/ReportsAnalyticsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'recharts';
import { useAuth } from '@context/AuthContext';
import { reportsApi } from '@services/api';

const ReportsAnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [timeFrame, setTimeFrame] = useState('month'); // week, month, year
  const { user } = useAuth();

  useEffect(() => {
    fetchReportStats();
  }, [timeFrame]);

  const fetchReportStats = async () => {
    try {
      setLoading(true);
      const response = await reportsApi.getReportAnalytics(user.id, timeFrame);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching report stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (title, value, icon, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderTimeFrameSelector = () => (
    <View style={styles.timeFrameContainer}>
      {['week', 'month', 'year'].map((frame) => (
        <TouchableOpacity
          key={frame}
          style={[
            styles.timeFrameButton,
            timeFrame === frame && styles.timeFrameButtonActive
          ]}
          onPress={() => setTimeFrame(frame)}
        >
          <Text style={[
            styles.timeFrameText,
            timeFrame === frame && styles.timeFrameTextActive
          ]}>
            {frame.charAt(0).toUpperCase() + frame.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
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
      {renderTimeFrameSelector()}

      <View style={styles.statsGrid}>
        {renderStatCard('Total Catches', stats?.totalCatches, 'fish', '#007AFF')}
        {renderStatCard('Avg Weight', `${stats?.avgWeight}lbs`, 'scale', '#34C759')}
        {renderStatCard('Most Common', stats?.mostCommonSpecies, 'fish', '#FF9500')}
        {renderStatCard('Best Location', stats?.topLocation, 'map-marker', '#FF2D55')}
      </View>

      {/* Catch Trends Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Catch Trends</Text>
        <LineChart
          data={stats?.catchTrends}
          width={350}
          height={200}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Line type="monotone" dataKey="catches" stroke="#007AFF" />
        </LineChart>
      </View>

      {/* Species Distribution */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Species Distribution</Text>
        <BarChart
          data={stats?.speciesDistribution}
          width={350}
          height={200}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="species" />
          <YAxis />
          <Bar dataKey="count" fill="#34C759" />
        </BarChart>
      </View>

      {/* Best Times */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Fishing Times</Text>
        {stats?.bestTimes.map((time, index) => (
          <View key={index} style={styles.timeRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
            <Text style={styles.timeText}>{time.timeSlot}</Text>
            <Text style={styles.catchCount}>{time.catches} catches</Text>
          </View>
        ))}
      </View>

      {/* Top Locations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Locations</Text>
        {stats?.topLocations.map((location, index) => (
          <View key={index} style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationStats}>
                {location.catches} catches • Avg: {location.avgWeight}lbs
              </Text>
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
  timeFrameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  timeFrameButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  timeFrameButtonActive: {
    backgroundColor: '#007AFF',
  },
  timeFrameText: {
    color: '#666',
  },
  timeFrameTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    margin: '1%',
    borderRadius: 10,
    borderLeftWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeText: {
    marginLeft: 10,
    flex: 1,
  },
  catchCount: {
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationStats: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  }
});

export default ReportsAnalyticsScreen;