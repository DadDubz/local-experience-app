import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoCardProps {
  title: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InfoCard;