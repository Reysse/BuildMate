import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { firestore } from './firebaseConfig'; // Firebase configuration
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore methods
import AuthContext from './AuthContext'; // Import AuthContext
import BuildsContext from './BuildsContext'; // Import BuildsContext

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null); // To hold the user data
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false); // To track if the description is being edited
  const router = useRouter();

  // Use the context to get the authenticated user and username
  const { user, username } = useContext(AuthContext);

  // Access builds data from BuildsContext
  const { builds } = useContext(BuildsContext); 

  useEffect(() => {
    if (!user) {
      router.replace("./"); // If no user is logged in, redirect to the login screen
    } else {
      fetchUserProfile();
    }
  }, [user, router]);

  // Fetch user profile data from Firestore
  const fetchUserProfile = async () => {
    try {
      const userDocRef = doc(firestore, "users", user.uid); // Get the user's document reference from Firestore
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setUserProfile(docSnap.data()); // Set the user profile data
        setDescription(docSnap.data().description || ''); // Set the description if available
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleDescriptionChange = async () => {
    try {
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, { description });

      // Toggle the editing state
      setIsEditingDescription(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  const navigateToHome = () => {
    router.push("./home");
  };

  const navigateToAccount = () => {
    router.push("./account");
  };

  const navigateToCommunity = () => {
    router.push("./community"); // Navigate to the community tab
  };

  const navigateToPartPicker = () => {
    router.push("./partpicker");
  };

  const navigateToCompletedBuilds = () => {
    router.push("./completedbuilds");
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
        <TouchableOpacity style={styles.TopmenuItem} onPress={navigateToAccount}>
          <Text style={[styles.TopmenuText, { color: 'white', fontWeight: "900" }]}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.TopmenuItem, styles.selecttopmenu]}>
          <Text style={[styles.TopmenuText, { color: 'black', fontWeight: "900" }]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.TopmenuItem, { borderTopRightRadius: 20 }]} onPress={navigateToCompletedBuilds}>
          <Text style={[styles.TopmenuText, { color: 'white', fontWeight: "900" }]}>Completed Builds</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.avatarText}>Manage Avatar</Text>
          <View style={styles.avatarContainer}>
            <Image
              source={userProfile && userProfile.avatar ? { uri: userProfile.avatar } : require("../assets/images/avatar.jpg")}
              style={styles.avatarImage}
            />
            <View style={styles.avatarButtons}>
              <TouchableOpacity style={styles.changeButton} onPress={() => {}}>
                <Text style={styles.changebuttonText}>Change Avatar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => {}}>
                <Text style={styles.deletebuttonText}>Delete Avatar</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Display the username from AuthContext */}
          <Text style={styles.successText}>
            {username || "No username available"}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.descriptionContainer}>
            {isEditingDescription ? (
              <>
                <TextInput
                  style={styles.descriptionInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter your profile description"
                />
                <TouchableOpacity style={styles.descriptionButton} onPress={handleDescriptionChange}>
                  <Text style={styles.descriptionbuttonText}>Save Description</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.descriptionText}>{description || 'No description available'}</Text>
                <TouchableOpacity style={styles.descriptionButton} onPress={() => setIsEditingDescription(true)}>
                  <Text style={styles.descriptionbuttonText}>Edit Description</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={{ fontWeight: "900" }}>Completed Builds</Text>
          <Text style={{ fontWeight: "900" }}>{builds.length}</Text> 
        </View>
      </ScrollView>

      <View style={styles.BotMenu}>
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToHome}>
          <Icon name="home" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToCommunity}>
          <Icon name="users" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToPartPicker}>
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
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    borderColor: "lightgray",
    borderWidth: 1,
  },
  avatarButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '80%',
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
  deleteButton: {
    backgroundColor: "white",
    borderColor: "red",
    borderWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  changebuttonText: {
    color: "#0056FF",
    fontWeight: "bold",
    fontSize: 14,
  },
  deletebuttonText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
  descriptionButton: {
    backgroundColor: "#0056FF",
    borderColor: "#0056FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  descriptionbuttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  paragraph: {
    marginBottom: 20,
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  descriptionInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    width: '80%',
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
