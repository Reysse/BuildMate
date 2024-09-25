import React from "react";
import { View, Text, Button, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const backgroundImage = require("../assets/images/LoginSuccess.jpg");

export default function LoginSuccessScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.successText}>Login Successful!</Text>
        <Button
          title="Back"
          onPress={() => router.replace("./")} //Go back to login screen
          color="blue"
        />
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
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "green",
  },
  buttonContainer: {
    marginTop: 12,
    width: "100%",
  },
});
