import React, { useState, useContext } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'; // Use Expo's LinearGradient
import { AuthContext } from './AuthContext'; // Assuming your AuthContext is set up
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function NewUser() {
  const [username, setUsername] = useState(""); // Username state for registration
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { login } = authContext!;

  // Handle continue button click (e.g., after username is entered)
  const handleContinue = async () => {
    if (!username) {
      ToastAndroid.show("Please enter a username", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.12/BuildMate/api.php', {
        action: 'continue',
        username,
      });

      if (response.data.success) {
        const userData = {
          id: response.data.user_id,
          username: username, // Use the username entered by the user
        };

        // Save the user data to context
        login(userData);

        // Store user ID in AsyncStorage if needed
        await AsyncStorage.setItem('user_id', userData.id.toString());

        // Provide feedback and navigate
        ToastAndroid.show('Username saved successfully', ToastAndroid.SHORT);
        router.push("./home"); // Navigate to the success screen
      } else {
        ToastAndroid.show(response.data.message || "Login failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error during request:", error);
    }
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#008FDD']}
      start={{ x: 0.5, y: 0.8 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/BuildMate-Logo.png")}
          style={styles.image}
        />
        <Text style={styles.title}>BUILDMATE</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.buttonContainer}>
          <Button title="Continue" onPress={handleContinue} color="#007bff" />
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
