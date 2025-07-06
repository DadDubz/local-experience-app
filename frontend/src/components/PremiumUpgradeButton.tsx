// frontend/src/components/PremiumUpgradeButton.tsx
import React from 'react';
import { Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { upgradeToPremium } from '../redux/actions/userActions';

const PremiumUpgradeButton = () => {
  const dispatch = useDispatch();

  const handleUpgrade = () => {
    dispatch(upgradeToPremium());
  };

  return <Button title="Upgrade to Premium" onPress={handleUpgrade} />;
};

export default PremiumUpgradeButton;
