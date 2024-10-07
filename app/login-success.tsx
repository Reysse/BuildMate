import React, { useContext, useState, useRef } from "react";
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from './AuthContext';

const { width } = Dimensions.get('window');

export default function LoginSuccessScreen() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current; // Initially set to screen width
  
  if (!authContext) {
    return <Text>Error: AuthContext not available</Text>;
  }

  const { user, logout } = authContext;

  const handleLogout = async () => {
    try {
      await axios.get('http://192.168.1.12/BuildMate/api.php?logout=true');
      logout();
      router.replace("./");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleMenuPress = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? width : width - 250, // Slide the menu based on visibility
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.TopMenu}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuIcon}>
          <Icon name="bars" size={40} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {user ? (
            <Text style={styles.successText}>Welcome, {user.username}!</Text> 
          ) : (
            <Text style={styles.successText}>Welcome!</Text> 
          )}
        </View>
      </ScrollView>

      {/* Sliding menu */}
      <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuContent}>
          <Button
            title="Logout"
            onPress={handleLogout}
            color="#dc3545"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  TopMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#2fa4e7",
    justifyContent: "center",
    paddingHorizontal: 16,
    zIndex: 2,
  },
  menuIcon: {
    position: "absolute",
    right: 16,
    top: 28,
  },
  scrollContainer: {
    paddingTop: 100,
    alignItems: "center",
    paddingBottom: 100,
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
    marginBottom: 12,
    color: "green",
  },
  usernameText: {
    fontSize: 20,
    marginBottom: 24,
    color: "#333",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#F5F5F5",
    zIndex: 1,
  },
  menuContent: {
    marginTop: 100,
    padding: 16,
    alignItems: "center",
  },
});
