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
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "./firebaseConfig"; // Firebase setup file

export default function RegistrationScreen() {
  const [email, setEmail] = useState("");
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
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return "";
  }, [email, password]);

  const handleRegistration = async () => {
    if (errorMessage) {
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return;
    }

    try {
      // Try to create the user with the provided email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore: Check if user exists, else create a new one
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new user document with username field
        await setDoc(userDocRef, {
          email: user.email,
          username: "", // Initialize username as empty
          createdAt: new Date().toISOString(),
        });
        ToastAndroid.show("Registered Successfully", ToastAndroid.SHORT);
      }

      // Clear inputs
      setEmail("");
      setPassword("");

      // Navigate to the login screen after successful registration
      router.replace("./");
    } catch (error) {
      // Handle Firebase errors, including email already in use
      if (error.code === "auth/email-already-in-use") {
        ToastAndroid.show("The email address is already in use by another account.", ToastAndroid.SHORT);
      } else {
        console.error("Registration error:", error);
        const errorMessage =
          error.message || "Registration failed. Please try again.";
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      }
    }
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
          <Button
            title="Register"
            onPress={handleRegistration}
            color="#28a745"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={() => router.replace("./")} // Navigate back to login screen
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
