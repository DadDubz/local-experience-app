// frontend/src/components/UserStatusLabel.tsx
import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';

const UserStatusLabel = () => {
  const isPremium = useSelector((state: RootState) => state.user.isPremium);

  return <Text style={{ fontWeight: 'bold' }}>{isPremium ? 'Premium User' : 'Free User'}</Text>;
};

export default UserStatusLabel;
