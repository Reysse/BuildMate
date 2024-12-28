import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, firestore } from "./firebaseConfig"; // Import Firebase Authentication and Firestore
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth"; // For updating the user profile

export default function NewUser() {
  const [username, setUsername] = useState(""); // State for storing the username
  const router = useRouter();

  // Get the current authenticated user UID
  const user = auth.currentUser;

  // If user is not logged in, navigate back to the login screen
  useEffect(() => {
    if (!user) {
      router.push("./index");
    }
  }, [user, router]);

  const handleContinue = async () => {
    if (!username) {
      ToastAndroid.show("Please enter a username", ToastAndroid.SHORT);
      return;
    }

    try {
      const userDocRef = doc(firestore, "users", user.uid); // Use the UID of the current user

      // Check if the username already exists in Firestore (for other users)
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // If user document already exists, update the username
        await setDoc(
          userDocRef,
          {
            username,
            createdAt: docSnap.data().createdAt || new Date().toISOString(), // Keep existing createdAt
          },
          { merge: true } // Merge so we don't overwrite other fields
        );

        // Update the user's profile with the new username in Firebase Authentication
        await updateProfile(user, { displayName: username });

        // Save the username locally using AsyncStorage
        await AsyncStorage.setItem("username", username);

        // Provide feedback and navigate to the home screen
        ToastAndroid.show("Username saved successfully", ToastAndroid.SHORT);
        router.push("./home");
      } else {
        ToastAndroid.show("Error: User document not found", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error saving username:", error);
      ToastAndroid.show("Error saving username", ToastAndroid.SHORT);
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
