import React from 'react';
import { View, Text } from 'react-native';
import NativeMap from '@components/NativeMap';

const spot = {
  name: 'Hidden Creek',
  latitude: 44.93,
  longitude: -91.39,
};

const MapScreen = () => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 18 }}>{spot.name}</Text>
    <NativeMap spot={spot} />
  </View>
);

export default MapScreen;
