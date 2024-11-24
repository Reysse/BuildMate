import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/FontAwesome6";

export default function Home() {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push("./profile"); // Navigate to profile screen
  };

  const navigateToBuild = () => {
    router.push("./build"); // Navigate to the PC builder screen
  };

  const navigateToCommunity = () => {
    router.push("./community"); // Navigate to the community tab
  };

  const navigateToPartPicker = () => {
    router.push("./partpicker"); // Navigate to the part picker screen
  };

  return (
    <LinearGradient
      colors={["#008FDD", "#ffffff"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.2 }}
      style={styles.background}
    >
      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/BuildMate-Logo.png")}
              style={styles.image}
            />
            <Text style={styles.title}>BUILDMATE</Text>
          </View>
          <Text style={styles.semititle}>Pick Parts. Build Your PC.</Text>
          <TouchableOpacity
            style={[styles.buildButton, { flexDirection: "row" }]}
            onPress={navigateToBuild}
          >
            <Icon2 name="computer" size={30} color="white" style={{ marginRight: 5 }} />
            <Text style={styles.buildButtonText}>Start your build</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: "#008FDD",
            fontWeight: "900",
            fontSize: 16,
            alignSelf: "baseline",
            marginLeft: 25,
            marginBottom: 10,
          }}
        >
          Build Guides
        </Text>
        <View style={styles.section}>
          <View style={styles.box}>
            <Text style={styles.boxText}>Guide 1</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>Guide 2</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>Guide 3</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>Guide 4</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.bottomMenuItem}>
          <Icon name="home" size={30} color="black" />
          <Text style={styles.bottomMenuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomMenuItem}
          onPress={navigateToCommunity}
        >
          <Icon name="users" size={30} color="#0056FF" />
          <Text style={styles.bottomMenuText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomMenuItem}
          onPress={navigateToPartPicker}
        >
          <Icon name="cogs" size={30} color="#0056FF" />
          <Text style={styles.bottomMenuText}>Part Picker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomMenuItem}
          onPress={navigateToProfile}
        >
          <Icon name="user" size={30} color="#0056FF" />
          <Text style={styles.bottomMenuText}>Profile</Text>
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
  bottomMenu: {
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
  bottomMenuItem: {
    alignItems: "center",
  },
  bottomMenuText: {
    fontSize: 12,
    color: "black",
  },
  scrollView: {
    width: "100%",
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
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  buildButton: {
    backgroundColor: "#0056FF",
    borderColor: "#0056FF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 20,
    alignItems: "center",
    elevation: 7,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  buildButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  box: {
    height: 300,
    width: "70%",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
