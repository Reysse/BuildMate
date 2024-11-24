import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, Button, StyleSheet, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "./firebaseConfig"; // Adjusted import to use your Firebase config

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (storedUserId) {
        // Automatically sign in the user if user_id exists in AsyncStorage
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userDocRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().username) {
              router.push("./home"); // Redirect to home if username exists
            } else {
              router.push("./newuser"); // Redirect to NewUser if no username
            }
          } else {
            // If user is not logged in, clear the stored user_id
            AsyncStorage.removeItem("user_id");
          }
        });
      }
    };

    checkUserSession();
  }, [router]);

  const handleLogin = async () => {
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      ToastAndroid.show("Please enter a valid email address", ToastAndroid.SHORT);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      ToastAndroid.show("Password must be at least 6 characters", ToastAndroid.SHORT);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await AsyncStorage.setItem("user_id", user.uid);

      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().username) {
        ToastAndroid.show("Logged in successfully", ToastAndroid.SHORT);
        router.push("./home"); // Redirect to home if username exists
      } else {
        ToastAndroid.show("Welcome! Please create a username", ToastAndroid.SHORT);
        router.push("./newuser"); // Redirect to NewUser if no username
      }
    } catch (error) {
      // Handle incorrect password or other errors
      if (error.code === 'auth/invalid-credential') {
        ToastAndroid.show("Invalid Credentials. Please try again.", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(error.message || "Login failed", ToastAndroid.SHORT);
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#008FDD"]}
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
