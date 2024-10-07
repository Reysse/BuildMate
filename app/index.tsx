import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid, ImageBackground } from "react-native";
import axios from 'axios';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

const backgroundImage = require("../assets/images/LoginComputer.jpg");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { login } = authContext!;
  useEffect(() => {
    const checkUserSession = async () => {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        try {
          const response = await axios.get('http://192.168.1.12/BuildMate/api.php?checkSession=true');
          if (response.data.isLoggedIn) { 
            ToastAndroid.show(`Logged in as ${response.data.username}`, ToastAndroid.SHORT);
            const userData = { id: response.data.user_id, username: response.data.username };
            login(userData); 
            router.push("./login-success");
          } else {
            await AsyncStorage.removeItem('user_id');
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      }
    };

    checkUserSession();
  }, [router]);

  const handleLogin = async () => {
    if (username === "" || password === "") {
      ToastAndroid.show("Please fill in both fields", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.12/BuildMate/api.php', {
        action: 'login',
        username,
        password,
      });

      if (response.data.success) {
        const userData = { id: response.data.user_id, username: response.data.username };
        await AsyncStorage.setItem('user_id', userData.id.toString());
        login(userData); 
        ToastAndroid.show(`Logged in as ${username}`, ToastAndroid.SHORT);
        router.push("./login-success");
      } else {
        ToastAndroid.show(response.data.message || "Login failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error during login:", error);
      ToastAndroid.show("Error during login", ToastAndroid.SHORT);
    }

    setUsername("");
    setPassword("");
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color="#007bff" />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Register"
            onPress={() => router.push("./register")}
            color="#28a745"
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