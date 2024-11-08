import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

// Define the User interface
interface User {
  id: number;
  email: string;
}

export default function RegistrationScreen() {
  const [email, setEmail] = useState(""); // Only email and password now
  const [password, setPassword] = useState("");
  const router = useRouter();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Memoized error message
  const errorMessage = useMemo(() => {
    if (!email || !password) {
      return "Please fill in all fields.";
    }
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }
    return "";
  }, [email, password]);

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
        email,
        password,
      });

      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Registration error:", error);
      const message = error.response?.data?.message || "Unknown error";
      ToastAndroid.show("Registration failed: " + message, ToastAndroid.SHORT);
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#008FDD']}
      start={{ x: 0.5, y: 0.8 }} // Start the gradient around 90% down
      end={{ x: 0.5, y: 1 }} // End at the bottom
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/BuildMate-Logo.png")} // Local image
          style={styles.image}
        />
        <Text style={styles.title}>BUILDMATE</Text>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "900",
    marginBottom: 50,
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
  image: {
    width: 175,
    height: 175,
    resizeMode: "cover",
    borderRadius: 10,
  },
});
