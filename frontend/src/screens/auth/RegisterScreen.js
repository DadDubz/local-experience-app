// === frontend/src/screens/auth/RegisterScreen.js ===
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from '../../utils/api';

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    setErrorMsg("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      const msg = "Name, email and password are required.";
      setErrorMsg(msg);
      Alert.alert("Validation Error", msg);
      return;
    }

    try {
      const res = await api.post("/auth/register", { name, email, password });
      if (res.data.token) {
        console.log("✅ Registration successful:", res.data);
        navigation.replace("Login");
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      setErrorMsg(backendMessage);
      console.error("❌ Registration error:", error);
      Alert.alert("Registration Failed", backendMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Register</Text>

        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            Already have an account? Log in here
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#2c3e50",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: "#3498db",
    textAlign: "center",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default RegisterScreen;
