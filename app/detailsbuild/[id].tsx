import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import BuildsContext from '../BuildsContext'; // Import BuildsContext
import { LinearGradient } from 'expo-linear-gradient';

export default function DetailsBuild() {
  const router = useRouter();
  const [buildDetails, setBuildDetails] = useState(null);
  const { builds, loading, error } = useContext(BuildsContext); // Access builds from context
   // Access the dynamic 'id' parameter
  const { id }= useLocalSearchParams();
  console.log(id);
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

      {buildDetails ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.section}>
            <Text style={styles.buildName}>{buildDetails.name}</Text>
            <Text style={styles.description}>{buildDetails.description}</Text>
            <Text style={styles.subTitle}>Components:</Text>
            {buildDetails.components.map((component, index) => (
              <View key={index} style={styles.component}>
                <Text>{component.part}: {component.model}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Build details not found.</Text>
      )}
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
