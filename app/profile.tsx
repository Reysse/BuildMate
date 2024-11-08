import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Profile() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  
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

  const navigateToHome = () => {
    router.push("./home");
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
        <TouchableOpacity style={styles.TopmenuItem}>
          <Text style={[styles.TopmenuText, { color: 'white', fontWeight: "900" }]}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.TopmenuItem, styles.selecttopmenu]}>
          <Text style={[styles.TopmenuText, { color: 'black', fontWeight: "900" }]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.TopmenuItem, { borderTopRightRadius: 20 }]}>
          <Text style={[styles.TopmenuText, { color: 'white', fontWeight: "900" }]}>Completed Builds</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
            <Text style={styles.avatarText}>Manage Avatar</Text>
            <View style={styles.avatarContainer}>
                <Image
                  source={require("../assets/images/avatar.jpg")} // Replace with your avatar image path
                  style={styles.avatarImage}
                />
                <View style={styles.avatarButtons}>
                  <TouchableOpacity style={styles.changeButton}>
                      <Text style={styles.changebuttonText}>Change Avatar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton}>
                      <Text style={styles.deletebuttonText}>Delete Avatar</Text>
                  </TouchableOpacity>
                </View>
            </View>
            {user ? (
            <Text style={styles.successText}>{user.username}</Text>
            ) : (
            <Text style={styles.successText}>Username</Text>
            )}
        </View>
        <View style={styles.section}>
            <Text style={styles.description}>You have not entered profile description</Text>
            <TouchableOpacity style={styles.descriptionButton}>
                <Text style={styles.descriptionbuttonText}>Edit Description</Text>
            </TouchableOpacity>
        </View>
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={{ fontWeight: "900" }}>Completed Builds</Text>
            <Text style={{ fontWeight: "900" }}>2</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    paddingBottom: 175,
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
  avatarText: {
    fontWeight: "700",
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 10,
    borderColor: "lightgray",
  },
  avatarButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '80%',
  },
  deleteButton: {
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  changeButton: {
    backgroundColor: "white",
    borderColor: "#0056FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  descriptionButton: {
    backgroundColor: "#0056FF",
    borderColor: "#0056FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  deletebuttonText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
  changebuttonText: {
    color: "#0056FF",
    fontWeight: "bold",
    fontSize: 14,
  },
  descriptionbuttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
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
  description: {
    marginBottom: 20,
  },
});
