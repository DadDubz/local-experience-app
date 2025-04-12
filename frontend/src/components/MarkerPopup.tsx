// src/components/MarkerPopup.tsx
import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text } from 'react-native';

interface MarkerPopupProps {
  coordinate: { latitude: number; longitude: number };
  title: string;
  description?: string;
}

const MarkerPopup: React.FC<MarkerPopupProps> = ({ coordinate, title, description }) => (
  <Marker coordinate={coordinate}>
    <Callout>
      <View>
        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        {description && <Text>{description}</Text>}
      </View>
    </Callout>
  </Marker>
);

export default MarkerPopup;
