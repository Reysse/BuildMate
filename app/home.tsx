import React, { useContext } from "react";
import { View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from './AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome6';

export default function Home() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Text>Error: AuthContext not available</Text>;
  }

  const navigateToProfile = () => {
    router.push("./profile"); // Navigate to profile.tsx
  };

  return (
    <LinearGradient
      colors={['#008FDD', '#ffffff']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.2 }}
      style={styles.background}
    >
      {/* Scrollable content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/BuildMate-Logo.png")}
              style={styles.image}
            />
            <Text style={styles.title}>BUILDMATE</Text>
          </View>
          <Text style={styles.semititle}>Pick Parts. Build Your PC.</Text>
          <TouchableOpacity style={[styles.buildbutton, {marginTop: 20, flexDirection: "row"}]}>
              <Icon2 name="computer" size={30} color="white" style={{ marginRight: 5 }} />
              <Text style={styles.buildbuttontext}>Start your build</Text>
          </TouchableOpacity>
        </View>
        <Text style={{color: "#008FDD", fontWeight: "900", fontSize: 16, alignSelf: "baseline"}}>Build Guides</Text>
        <View style={styles.section}>
          <View style={styles.box}>

          </View>
          <View style={styles.box}>

          </View>
          <View style={styles.box}>

          </View>
          <View style={styles.box}>

          </View>
        </View>
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.BotMenu}>
        <TouchableOpacity style={styles.BotmenuItem}>
          <Icon name="home" size={30} color="black" />
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
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToProfile}>
          <Icon name="user" size={30} color="#0056FF" />
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
  BotmenuItem: {
    alignItems: "center",
  },
  BotmenuText: {
    fontSize: 12,
    color: "black",
  },
  scrollView: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25,
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 60,
  },
  section: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
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
    marginLeft: 10, // Space between logo and text
  },
  semititle: {
    fontSize: 25,
    fontWeight: "700",
    color: "black",
    width: "65%",
    textAlign: "justify",
    flex: 1,
  },
  logoContainer: {
    marginTop: 20,
    marginBottom:20,
    flexDirection: 'row', // Align logo and text side by side
    alignItems: 'center',
  },
  buildbutton: {
    backgroundColor: "#0056FF",
    borderColor: "#0056FF",
    paddingVertical: 4, // Reduce padding to make the button smaller
    paddingHorizontal: 10, // Reduce horizontal padding as well
    borderWidth: 2,
    borderRadius: 20,
    alignItems: "center",
    elevation: 7, // For Android shadow effect
    shadowColor: "black", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset (horizontal, vertical)
    shadowOpacity: .8, // Shadow opacity
    shadowRadius: 4, // Shadow spread
  },
  buildbuttontext: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14, // Decrease font size
  },
  box: {
    height: 300,
    width: "70%",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 40,
  },
});
