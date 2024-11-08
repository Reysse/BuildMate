import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet, ToastAndroid } from "react-native";
import axios from 'axios';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Use Expo's LinearGradient
import { AuthContext } from './AuthContext'; // Your auth context

export default function LoginScreen() {
  const [email, setEmail] = useState(""); 
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
          if (response.data.isLoggedIn && (response.data.username !== undefined && response.data.username !== "")) { 
            ToastAndroid.show(`Logged in successfully`, ToastAndroid.SHORT);

            const userData = { 
              id: response.data.user_id, 
              username: response.data.username 
            } 
            login(userData); // Store user data in AuthContext
            router.push("./home");
            
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
    if (email === "" || password === "") {
      ToastAndroid.show("Please fill in both fields", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.12/BuildMate/api.php', {
        action: 'login',
        email,  // Use email instead of username
        password,
      });

      if (response.data.success) {
        const userData = { 
          id: response.data.user_id, 
          username: response.data.username // Get the username from the response
        };

        if (!userData.username) {
          // If no username, redirect to NewUser screen
          await AsyncStorage.setItem('user_id', userData.id.toString());
          login(userData);
          router.push("./newuser");
        } else {
          await AsyncStorage.setItem('user_id', userData.id.toString());
          login(userData); // Store user data in AuthContext

          // Show success message
          ToastAndroid.show('Logged in successfully', ToastAndroid.SHORT);
          
          router.push("./home");
        }
      } else {
        ToastAndroid.show(response.data.message || "Login failed", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error during login:", error);
      ToastAndroid.show("Error during login", ToastAndroid.SHORT);
    }

    setEmail("");
    setPassword("");
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
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
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
