// frontend/src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Update the import path below to the actual relative path of AuthContext
import { useAuth } from '../../context/AuthContext';

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  // Add your route names and params here, e.g.:
  // Home: undefined;
  Login: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      const errorMessage =
        typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Failed to login';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="compass" size={80} color="#007AFF" />
          <Text style={styles.title}>Local Experience</Text>
        </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  textContentType="password"
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
                </KeyboardAvoidingView>
              );
        };

        const styles = StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
          },
          scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
          },
          logoContainer: {
            alignItems: 'center',
            marginBottom: 40,
          },
          title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#007AFF',
            marginTop: 10,
          },
          form: {
            width: '100%',
          },
          inputContainer: {
            marginBottom: 20,
          },
          input: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            backgroundColor: '#f9f9f9',
          },
          button: {
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10,
          },
          buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          },
        });
