import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import BuildsContext from './BuildsContext'; // Import BuildsContext
import AuthContext from './AuthContext'; // Import AuthContext
import { ComponentsContext } from "./ComponentsContext"; // Import ComponentsContext
import * as ImagePicker from 'expo-image-picker';
import { firestore } from "./firebaseConfig";

export default function CompletedBuilds() {
  const router = useRouter();

  // Use the context to get the authenticated user and username
  const { user } = useContext(AuthContext);

  // Get builds data from BuildsContext
  const { builds, loading, error } = useContext(BuildsContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedBuild, setSelectedBuild] = useState(null);

  // Log builds to ensure proper data structure
  useEffect(() => {
    console.log('Builds data:', builds);
  }, [builds]);

  // Filter the builds for the current user
  const completedBuilds = builds.filter((build) => build.user === user.uid);

  // Handle build click to show components
  const handleBuildClick = (build) => {
    // Navigating to the DetailsBuild screen with the build id
    router.push(`./detailsbuild/${build.id}`);
  };

  const handleUploadBuild = (build) => {
    setSelectedBuild(build); // Store the build you are uploading
    setModalVisible(true); // Show modal to upload image and description
  };

  const handleImagePick = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }
  
    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.cancelled) {
      setImage(result.uri);
    } else {
      console.log("Image picking was cancelled.");
    }
  };

  const handleUploadSubmit = async () => {
    if (image && description) {
      try {
        // Save the data to Firestore under the 'build' collection
        await firestore.collection('build').doc(selectedBuild.id).update({
          imageUri: image,
          description: description,
          uploadCommunity: true, // Add the 'uploadCommunity' field as true
        });
  
        console.log("Build uploaded to community:", selectedBuild);
        console.log("Image URI:", image);
        console.log("Description:", description);
  
        // Close modal after submission
        setModalVisible(false);
  
      } catch (error) {
        console.error("Error uploading build to community:", error);
        alert("There was an error uploading your build. Please try again.");
      }
    } else {
      alert("Please provide both an image and a description.");
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

  const navigateToProfile = () => {
    router.push("./profile");
  };

  const navigateToPartPicker = () => {
    router.push("./partpicker");
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
        <TouchableOpacity style={[styles.TopmenuItem]} onPress={navigateToProfile}>
          <Text style={[styles.TopmenuText, { color: 'white', fontWeight: "900" }]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.TopmenuItem, styles.selecttopmenu, { borderTopRightRadius: 20 }]} >
          <Text style={[styles.TopmenuText, { color: 'black', fontWeight: "900" }]}>Completed Builds</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={{ fontWeight: "900" }}>Completed Builds</Text>
          <Text style={{ fontWeight: "900" }}>{completedBuilds.length}</Text>
          {completedBuilds.length === 0 ? (
            <Text>No completed builds found.</Text>
          ) : (
            completedBuilds.map((build) => (
              <View key={build.id}>
                <TouchableOpacity
                  style={styles.buildRectangle}
                  onPress={() => handleBuildClick(build)}
                >
                  <Text style={styles.buildName}>{build.name}</Text>
                    <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => handleUploadBuild(build)}
                  >
                    <Text style={styles.uploadButtonText}>Upload to Community</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Build to Community</Text>

            <TouchableOpacity onPress={handleImagePick}>
              <Text style={styles.pickImageText}>Pick an Image</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            <TextInput
              style={styles.descriptionInput}
              placeholder="Enter a description"
              value={description}
              onChangeText={setDescription}
            />

            <Button title="Submit" onPress={handleUploadSubmit} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <View style={styles.BotMenu}>
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToHome}>
          <Icon name="home" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem}onPress={navigateToCommunity}>
          <Icon name="users" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToPartPicker}>
          <Icon name="cogs" size={30} color="#0056FF" />
          <Text style={styles.BotmenuText}>Part Picker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.BotmenuItem} onPress={navigateToProfile}>
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

  buildRectangle: {
    backgroundColor: '#00B2F21A',
    borderColor: "#000000",
    borderWidth: 2,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
  },
  buildName: {
    fontWeight: "900",
    color: "#002775",
    marginBottom: 20,
  },
  error: {
    color: "red",
  },
  uploadButton: {
    backgroundColor: '#0056FF',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickImageText: {
    color: '#0056FF',
    textAlign: 'center',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  descriptionInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
