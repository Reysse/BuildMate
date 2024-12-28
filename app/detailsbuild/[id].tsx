import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BuildsContext from '../BuildsContext'; // Import BuildsContext
import { LinearGradient } from 'expo-linear-gradient';
import ComponentsContext from "../ComponentsContext"; // Import ComponentsContext

export default function DetailsBuild() {
  const router = useRouter();
  const [buildDetails, setBuildDetails] = useState(null);
  const { builds, loading, error } = useContext(BuildsContext); // Access builds from context
  const { cpus, motherboards, rams, gpus, psus, ssds } = useContext(ComponentsContext); // Access components from context
  
  // Access the dynamic 'id' parameter
  const { id } = useLocalSearchParams();
  
  useEffect(() => {
    // Find the build with the matching id from context
    if (id && builds.length > 0) {
      const foundBuild = builds.find(build => build.id === id);
      setBuildDetails(foundBuild); // Set the found build details
    }
  }, [id, builds]); // Re-run effect when builds or id change

  if (loading) {
    return <Text>Loading builds...</Text>;
  }

  if (error) {
    return <Text>Error fetching build details: {error}</Text>;
  }

  const images = {
    IntelCorei513600K: require("../../assets/images/Intel Core i5-13600K.png"),
    AMDRyzen57600: require("../../assets/images/AMD Ryzen 5 7600.jpg"),
    IntelCorei713700K: require("../../assets/images/Intel Core i7-13700K.png"),
    AMDRyzen77700X: require("../../assets/images/AMD Ryzen 7 7700X.jpg"),
    IntelCorei913900K: require("../../assets/images/Intel Core i9-13900K.jpg"),
    ASUSROGSTRIXZ790EGaming: require("../../assets/images/ASUS ROG STRIX Z790-E Gaming.png"),
    MSIMAGB650TOMAHAWKWiFi: require("../../assets/images/MSI MAG B650 TOMAHAWK WiFi.png"),
    GIGABYTEZ690AORUSProAX: require("../../assets/images/GIGABYTE Z690 AORUS Pro AX.png"),
    ASRockB660MProRSMicroATXLGA1700Motherboard: require("../../assets/images/ASRock B660M Pro RS Micro ATX LGA1700 Motherboard.png"),
    MSIPROB760PWiFi: require("../../assets/images/MSI PRO B760-P WiFi.jpg"),
    CorsairVengeanceDDR560002x16GB: require("../../assets/images/Corsair Vengeance DDR5-6000 (2x16GB).png"),
    GSkillTridentZ5RGBDDR564002x16GB: require("../../assets/images/G.Skill Trident Z5 RGB DDR5-6400 (2x16GB).jpg"),
    KingstonFuryBeastDDR552002x16GB: require("../../assets/images/Kingston Fury Beast DDR5-5200 (2x16GB).jpg"),
    KingstonFuryBeastDDR4SpecialEdition2x16GB: require("../../assets/images/Kingston Fury Beast DDR4 Special Edition (2x16GB).png"),
    TeamGroupTForceVulcanDDR556002x16GB: require("../../assets/images/TeamGroup T-Force Vulcan DDR5-5600 (2x16GB).jpg"),
    NVIDIARTX4060Ti: require("../../assets/images/NVIDIA RTX 4060 Ti.png"),
    AMDRadeonRX7700XT: require("../../assets/images/AMD Radeon RX 7700 XT.jpg"),
    NVIDIARTX3070Ti: require("../../assets/images/NVIDIA RTX 3070 Ti.jpg"),
    AMDRX6700XT: require("../../assets/images/AMD RX 6700 XT.jpg"),
    NVIDIARTX4080: require("../../assets/images/NVIDIA RTX 4080.png"),
    CorsairRM750x: require("../../assets/images/Corsair RM750x.png"),
    SeasonicFocusGX650: require("../../assets/images/Seasonic Focus GX-650.jpg"),
    EVGASuperNOVA850G6: require("../../assets/images/EVGA SuperNOVA 850 G6.jpg"),
    CoolerMasterMWE650V2: require("../../assets/images/Cooler Master MWE 650 V2.png"),
    ThermaltakeToughpowerGF1: require("../../assets/images/Thermaltake Toughpower GF1.jpg"),
    Samsung970EVOPlus1TB: require("../../assets/images/Samsung 970 EVO Plus 1TB.jpg"),
    WDBlackSN850X1TB: require("../../assets/images/WD Black SN850X 1TB.jpg"),
    CrucialP5Plus1TB: require("../../assets/images/Crucial P5 Plus 1TB.jpg"),
    KingstonKC30001TB: require("../../assets/images/Kingston KC3000 1TB.jpg"),
    SeagateFireCuda5301TB: require("../../assets/images/Seagate FireCuda 530 1TB.png"),
    // Add other mappings here as needed
  };

  Object.keys(images).forEach(key => {
    console.log("Key:", key); // The name of the component (e.g., IntelCorei513600K)
    console.log("Image:", images[key]); // The corresponding image path
  });

  const findImageForComponent = (componentName) => {
    // Find matching component by name in context
    const component = [...cpus, ...motherboards, ...rams, ...gpus, ...psus, ...ssds].find(
      (comp) => comp.label === componentName
      
    );
    console.log(images);
    if (component && component.value.Image) {
      // Check if the image name exists in the images object
      if (images[component.value.Image]) {
        return images[component.value.Image]; // Return the image if found
      }
    }
    return null; // If no match is found, return null
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
            source={require("../../assets/images/BuildMate-Logo.png")}
            style={styles.image}
          />
          <Text style={styles.title}>BUILDMATE</Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            padding: 5,
            width: 150,
            height: 50,
            marginTop: 35,
            justifyContent: "center", // Centers content vertically
            alignItems: "center", // Centers content horizontally
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderColor: "lightgray", 
            borderWidth: 1
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 20, textAlign: "center" }}>
            {buildDetails?.name}
          </Text>
        </View>

      <ScrollView style={[styles.scrollView, {backgroundColor: "white", borderColor: "lightgray", borderWidth: 1}]} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          {buildDetails ? (
            Object.entries(buildDetails)
              .filter(([key]) => !["id", "user", "name", "createdAt"].includes(key)) // Exclude these fields
              .map(([key, value], index) => {
                const componentImage = findImageForComponent(value); // Find the image for the component
                return (
                  <View key={index} style={{ marginVertical: 5, }}>
                    {componentImage && (
                      <Image
                        source={componentImage}
                        style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10, alignSelf: "center"}}
                      />
                    )}
                    <Text style={{ fontSize: 16, fontWeight: "600", alignSelf: "baseline"}}>{key}:</Text>
                    <Text style={{ fontSize: 14, color: "#555", alignSelf: "baseline"}}>
                      {typeof value === "object" ? JSON.stringify(value, null, 2) : value}
                    </Text>
                  </View>
                );
              })
          ) : (
            <Text>Build details not found.</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: '100%',
    top: 0,
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
  },
  section: {
    width: "100%",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 25,
  },
  buildName: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  component: {
    paddingVertical: 5,
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
  
});
