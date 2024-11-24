import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import axios from 'axios';
import AuthContext from './AuthContext'; // Importing the AuthContext
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Account() {
  const router = useRouter();
  const { user, username, email, logout } = useContext(AuthContext); // Destructure user, username, and email from AuthContext


  const handleLogout = async () => {
    try {
      // Clear user data from context first (if required)
      
      await logout();  // Assuming this is the function from AuthContext
      
      // Use `router.replace()` to navigate without causing flashing
      router.replace("./"); // Or replace with the appropriate login screen path
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  
  

  const navigateToHome = () => {
    router.push("./home");
  };

  const navigateToProfile = () => {
    router.push("./profile");
  };

  return (
    <LinearGradient
      colors={['#008FDD', '#ffffff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.2 }}
      style={styles.background}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/BuildMate-Logo.png")}
          style={styles.image}
        />
        <Text style={styles.title}>BUILDMATE</Text>
      </View>

      <View style={styles.TopMenu}>
        <TouchableOpacity style={[styles.TopmenuItem, styles.selecttopmenu]}>
          <Text style={[styles.TopmenuText, { color: 'black', fontWeight: "900" }]}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.TopmenuItem} onPress={navigateToProfile}>
          <Text style={[styles.TopmenuText, { color: 'white', fontWeight: "900" }]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.TopmenuItem, { borderTopRightRadius: 20 }]}>
          <Text style={[styles.TopmenuText, { color: 'white', fontWeight: "900" }]}>Completed Builds</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.section}>
        <TouchableOpacity style={styles.usernameContainer}>
            <Text style={styles.successText}>
                {username || (user && user.displayName) || "Username"}
            </Text>
            <Icon name="pencil" size={20} color="#008FDD" style={styles.pencilIcon} />
        </TouchableOpacity>
        </View>

        <View style={styles.section}>
        <Text style={[styles.paragraph, { fontWeight: "900", alignSelf: "baseline" }]}>Email</Text>
        <Text style={[styles.paragraph, { alignSelf: "baseline" }]}>
            {email || (user && user.email) || "Email"}
        </Text>
        <TouchableOpacity style={styles.ChangeEmailButton}>
            <Text style={styles.ChangeEmailText}>Change Email</Text>
        </TouchableOpacity>
        </View>


        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={[styles.paragraph, { fontWeight: "900", alignSelf: "baseline" }]}>Password</Text>
          <TouchableOpacity style={styles.ChangePasswordButton}>
            <Text style={styles.ChangePasswordText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.logoutButton, { marginTop: 100 }]} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.BotMenu}>
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToHome}>
          <Icon name="home" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem}>
          <Icon name="users" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem}>
          <Icon name="cogs" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Part Picker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem}>
          <Icon name="user" size={30} color="black" />
          <Text style={styles.BotmenuText}>Profile</Text>
        </TouchableOpacity>
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
  BotMenu: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "lightgray",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  TopMenu: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#0056FF",
    display: "flex",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  TopmenuItem: {
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    height: 60,
    display: "flex",
    flexGrow: 1,
  },
  BotmenuItem: {
    alignItems: "center",
  },
  BotmenuText: {
    fontSize: 12,
    color: "black",
  },
  TopmenuText: {
    fontSize: 15,
    color: "black",
  },
  scrollView: {
    width: '100%',
    top: 80,
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
  },
  section: {
    width: "100%",
    alignItems: "center",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    padding: 25,
  },
  successText: {
    fontSize: 28,
    fontWeight: "700",
    color: "black",
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "cover", 
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#333",
    marginLeft: 10,
  },
  logoContainer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selecttopmenu: {
    backgroundColor: "white",
  },
  ChangeEmailButton: {
    alignSelf: "baseline",
  },
  ChangeEmailText: {
    color: "#008FDD",
    fontWeight: "900",
  },
  ChangePasswordButton: {
    alignSelf: "baseline",
  },
  ChangePasswordText: {
    color: "#008FDD",
    fontWeight: "900",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  paragraph: {
    marginBottom: 10,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pencilIcon: {
    marginLeft: 10,
    alignSelf: "flex-start",
  },
});
