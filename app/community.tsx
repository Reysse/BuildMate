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

export default function Home() {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push("./profile"); // Navigate to profile screen
  };

  const navigateToHome = () => {
    router.push("./home"); // Navigate to profile screen
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
        </View>

        {/* Box container updated to show two boxes per row */}
        <View style={styles.boxContainer}>
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
          <View style={styles.box}>
            <Text style={styles.boxText}>Guide 5</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>Guide 6</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.bottomMenuItem} onPress={navigateToHome}>
          <Icon name="home" size={30} color="#0056FF" />
          <Text style={styles.bottomMenuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomMenuItem}
        >
          <Icon name="users" size={30} color="black" />
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
  logoContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  boxContainer: {
    flexDirection: "row", // Arrange boxes in a row
    flexWrap: "wrap", // Allow boxes to wrap to the next row
    justifyContent: "space-around", // Distribute boxes with space
    width: "100%",
    marginTop: 20,
  },
  box: {
    width: "40%", // Set width to 45% so two boxes fit in a row
    height: 300,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
