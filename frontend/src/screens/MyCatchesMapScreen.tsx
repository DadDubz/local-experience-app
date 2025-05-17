import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { useAuth } from '@context/AuthContext';

const MyCatchesMapScreen = () => {
  interface Catch {
    _id: string;
    coordinates: { lat: number; lng: number };
    caption: string;
    location: string;
    user: { _id: string };
  }
  
  const [catches, setCatches] = useState<Catch[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCatches = async () => {
    try {
      const response = await axios.get('http://your-api-url/api/posts');
      const myCatches = response.data.posts.filter(
        (p: Catch) => p.user._id === user._id && p.location && p.coordinates
      );
      setCatches(myCatches);
    } catch (error) {
      console.error('Failed to load catches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatches();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 44.9778,  // Default to Minneapolis (adjust as needed)
        longitude: -93.2650,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5,
      }}
    >
      {catches.map((catchItem) => (
        <Marker
          key={catchItem._id}
          coordinate={{
            latitude: catchItem.coordinates.lat,
            longitude: catchItem.coordinates.lng,
          }}
          title={catchItem.caption}
          description={catchItem.location}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default MyCatchesMapScreen;
