// frontend/src/screens/profile/LicensesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const LicensesScreen = ({ navigation }) => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await user.getLicenses();
      setLicenses(response);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      Alert.alert('Error', 'Failed to load licenses');
    } finally {
      setLoading(false);
    }
  };

  const getLicenseStatus = (license) => {
    const expirationDate = new Date(license.expirationDate);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) {
      return { status: 'expired', color: '#FF3B30' };
    } else if (daysUntilExpiration < 30) {
      return { status: 'expiring soon', color: '#FF9500' };
    }
    return { status: 'active', color: '#34C759' };
  };

  const renderLicenseCard = (license) => {
    const { status, color } = getLicenseStatus(license);

    return (
      <View key={license.id} style={styles.licenseCard}>
        <View style={styles.licenseHeader}>
          <View style={styles.licenseType}>
            <MaterialCommunityIcons
              name={license.type === 'fishing' ? 'fish' : 'target'}
              size={24}
              color="#007AFF"
            />
            <Text style={styles.licenseTitle}>{license.name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: color }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.licenseDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>License Number:</Text>
            <Text style={styles.detailValue}>{license.number}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Valid Until:</Text>
            <Text style={styles.detailValue}>
              {new Date(license.expirationDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>State:</Text>
            <Text style={styles.detailValue}>{license.state}</Text>
          </View>
        </View>

        <View style={styles.licenseActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ViewLicense', { license })}
          >
            <MaterialCommunityIcons name="file-document" size={20} color="#007AFF" />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('RenewLicense', { license })}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Renew</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Licenses & Permits</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddLicense')}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {licenses.length > 0 ? (
        <View style={styles.licensesList}>
          {licenses.map(renderLicenseCard)}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="license"
            size={64}
            color="#666"
          />
          <Text style={styles.emptyText}>
            No licenses or permits yet
          </Text>
          <TouchableOpacity
            style={styles.getLicenseButton}
            onPress={() => navigation.navigate('AddLicense')}
          >
            <Text style={styles.getLicenseButtonText}>
              Get Your First License
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  licensesList: {
    padding: 20,
  },
  licenseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  licenseType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  licenseTitle