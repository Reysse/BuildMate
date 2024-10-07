import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

const backgroundImage = require("../assets/images/RegistrationBackground.jpg");

// Define the User interface
interface User {
  id: number;
  username: string;
  email: string;
}

export default function RegistrationScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Memoized error message
  const errorMessage = useMemo(() => {
    if (!username || !email || !password) {
      return "Please fill in all fields.";
    }
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  }, [username, email, password]);

  const handleRegistration = async () => {
    if (errorMessage) {
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return;
    }

    try {
      const emailCheckResponse = await axios.get(`http://192.168.1.12/BuildMate/api.php?email=${email}`);
      if (emailCheckResponse.data.exists) {
        ToastAndroid.show("Email address is already in use", ToastAndroid.SHORT);
        return;
      }

      const response = await axios.post('http://192.168.1.12/BuildMate/api.php', {
        action: 'register',
        username,
        email,
        password,
      });

      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Registration error:", error);
      const message = error.response?.data?.message || "Unknown error";
      ToastAndroid.show("Registration failed: " + message, ToastAndroid.SHORT);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <Button title="Register" onPress={handleRegistration} color="#28a745" />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={() => router.replace("./")} // Go back to login screen
            color="#007bff"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 12,
    width: "100%",
  },
});

