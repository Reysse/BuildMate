import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, ScrollView, TouchableWithoutFeedback, ToastAndroid, TextInput } from "react-native"; // Add TouchableWithoutFeedback and Keyboard
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"; // For bottom menu icons
import { ComponentsContext } from "./ComponentsContext"; // Importing the ComponentsContext
import AuthContext from "./AuthContext"; // Importing the AuthContext
import BuildsContext from "./BuildsContext";
import { firestore } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PartPicker() {
  const router = useRouter();
  const { user, username } = useContext(AuthContext); // Destructure user and username from AuthContext
  const components = useContext(ComponentsContext); // Consume the ComponentsContext to get components data
  const { refreshBuilds } = useContext(BuildsContext);

  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedGpu, setSelectedGpu] = useState(null);
  const [selectedPsu, setSelectedPsu] = useState(null);
  const [selectedSsd, setSelectedSsd] = useState(null);
  const [buildName, setBuildName] = useState('');


  const [isCpuModalVisible, setIsCpuModalVisible] = useState(false);
  const [isMotherboardModalVisible, setIsMotherboardModalVisible] = useState(false);
  const [isRamModalVisible, setIsRamModalVisible] = useState(false);
  const [isGpuModalVisible, setIsGpuModalVisible] = useState(false);
  const [isPsuModalVisible, setIsPsuModalVisible] = useState(false);
  const [isSsdModalVisible, setIsSsdModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);


  const [compatibleMotherboards, setCompatibleMotherboards] = useState([]);
  const [compatibleCpus, setCompatibleCpus] = useState([]);
  const [compatibleRam, setCompatibleRam] = useState([]);
  const [compatibleGpus, setCompatibleGpus] = useState([]);
  const [compatiblePsu, setCompatiblePsu] = useState([]);
  const [compatibleSsd, setCompatibleSsd] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    let filteredCpus = components.cpus;
    let filteredMotherboards = components.motherboards;
    let filteredRam = components.rams;
    let filteredGpus = components.gpus;
    let filteredPsu = components.psus;
    let filteredSsd = components.ssds;

    const cleanSocketType = (socket) => socket.replace("Intel Socket", "").replace("AMD Socket", "").replace("LGA", "").trim();

    // Calculate total required wattage based on selected components
    const calculateRequiredWattage = () => {
        const buffer = 100;
        return (selectedCpu?.value["Wattage"] || 0) + 
               (selectedGpu?.value["Wattage"] || 0) + 
               (selectedRam?.value["Wattage"] || 0) + 
               (selectedSsd?.value["Wattage"] || 0) +
               buffer;
    };

    const calculateCurrentTotal = () => {
      return (
        (selectedCpu?.value["Price"] || 0) +
        (selectedGpu?.value["Price"] || 0) +
        (selectedRam?.value["Price"] || 0) +
        (selectedMotherboard?.value["Price"] || 0) +
        (selectedPsu?.value["Price"] || 0) +
        (selectedSsd?.value["Price"] || 0)
      );
    };

    const requiredWattage = calculateRequiredWattage();
    const calccurrentTotal = calculateCurrentTotal();
    setCurrentTotal(calccurrentTotal)
    const remainingBudget = totalBudget ? totalBudget - currentTotal : Infinity;

    // SSD-First Compatibility Logic
    // SSD-First Compatibility Logic
    if (selectedSsd) {
      const ssdInterface = selectedSsd.value["Interface"]; // e.g., PCIe 3.0 x4
      const ssdFormFactor = selectedSsd.value["Form Factor"]; // e.g., M.2 2280
      
      // Debugging logs for selected SSD values
      
      const [ssdLength] = ssdFormFactor.match(/\d{4}/) || []; // Extract length, e.g., 2280
      const isM2Key = ssdFormFactor.includes("M.2");
  
      // Filter motherboards based on M.2 slot compatibility
      filteredMotherboards = components.motherboards
          .filter((mb) => {
              const storageSlots = mb.value["Storage Slot"]?.split(",").map((slot) => slot.trim()) || [];
  
              // Debugging log for storage slots in the motherboard
  
              // Check if any storage slot is compatible
              const completeSlots = storageSlots.map((slot) => {
                  // Adjusted regex to handle different slot descriptions
                  const slotRegex = /(\d+x?)\s(M\.2|Hyper M\.2|Ultra M\.2)\s\(M Key\)\s(\d{4,5})\s(?:\(([^)]+)\)|([^,]+))/;

                  const match = slot.match(slotRegex);
  
  
                  if (!match) return null;
  
                  const [, slotType, slotKey, slotLengths, group4, group5] = match;
                  const slotPcie = group4 || group5; // Safely assign PCIe details
                  const supportedLengths = slotLengths.split(",").map((len) => len.trim()); // Multiple lengths can be supported
  
                  const slotPcieVersion = slotPcie ? parseFloat(slotPcie.split(" ")[1]) : null;
  
  
                  // Check if the SSD length is supported and the PCIe version is compatible
                  const isInterfaceCompatible = slotPcieVersion
                      ? slotPcieVersion >= parseFloat(ssdInterface.split(" ")[1])
                      : true;
  
                  // Debugging log for interface compatibility
  
                  // Check if SSD length is supported and PCIe version is compatible
                  return supportedLengths.includes(ssdLength) && isInterfaceCompatible;
              }).filter(Boolean); // Only keep valid slots
  
              return completeSlots.length > 0; // If there are any valid compatible slots
          })
          .map((mb, index) => ({
              label: mb.value["Name"],
              value: mb.value,
              key: `mb-${mb.value["ID"] || index}`,
          }));
    }
  
  
  
    // CPU Compatibility Logic
    if (selectedCpu) {
        const cpuSocketType = cleanSocketType(selectedCpu.value["Socket Type"]);

        filteredMotherboards = filteredMotherboards
            .filter((mb) => cleanSocketType(mb.value["Socket Type"]) === cpuSocketType)
            .map((mb, index) => ({
                label: mb.value["Name"],
                value: mb.value,
                key: `mb-${mb.value["ID"] || index}`,
            }));

        filteredRam = components.rams
            .filter((ram) => filteredMotherboards.some((mb) => mb.value["Memory Type"] === ram.value["Memory Type"]))
            .map((ram, index) => ({
                label: ram.value["Name"],
                value: ram.value,
                key: `ram-${ram.value["ID"] || index}`,
            }));
    }

    // Motherboard-First Compatibility Logic
    if (selectedMotherboard) {
        const motherboardSocketType = cleanSocketType(selectedMotherboard.value["Socket Type"]);
        const motherboardRamType = selectedMotherboard.value["Memory Type"];

        filteredCpus = components.cpus
            .filter((cpu) => cleanSocketType(cpu.value["Socket Type"]) === motherboardSocketType)
            .map((cpu, index) => ({
                label: cpu.value["Name"],
                value: cpu.value,
                key: `cpu-${cpu.value["ID"] || index}`,
            }));

        filteredRam = components.rams
            .filter((ram) => ram.value["Memory Type"] === motherboardRamType)
            .map((ram, index) => ({
                label: ram.value["Name"],
                value: ram.value,
                key: `ram-${ram.value["ID"] || index}`,
            }));
    }

    if (selectedRam) {
        const ramType = selectedRam.value["Memory Type"];
        filteredMotherboards = filteredMotherboards
            .filter((mb) => mb.value["Memory Type"] === ramType)
            .map((mb, index) => ({
                label: mb.value["Name"],
                value: mb.value,
                key: `mb-${mb.value["ID"] || index}`,
            }));
    }

    // GPU Compatibility Logic
    if (selectedGpu) {
        const gpuPcieVersion = selectedGpu.value["PCIe Interface"];
        filteredMotherboards = filteredMotherboards
            .filter((mb) => {
                const motherboardPcieVersions = mb.value["PCIe Version"]
                    .split(" ")
                    .filter((item) => item.trim() !== "");

                const pcieSlots = [];
                for (let i = 0; i < motherboardPcieVersions.length; i += 4) {
                    pcieSlots.push(`${motherboardPcieVersions[i + 1]} ${motherboardPcieVersions[i + 2]} ${motherboardPcieVersions[i + 3]}`);
                }

                return pcieSlots.some((slot) => slot.includes(gpuPcieVersion));
            })
            .map((mb, index) => ({
                label: mb.value["Name"],
                value: mb.value,
                key: `mb-${mb.value["ID"] || index}`,
            }));
    }

    // PSU Compatibility Logic
    filteredPsu = components.psus
        .filter((psu) => psu.value["Wattage"] >= requiredWattage)
        .map((psu, index) => ({
            label: psu.value["Name"],
            value: psu.value,
            key: `psu-${psu.value["ID"] || index}`,
        }));


    if (totalBudget) {
      const budgetFilter = (item) => (item.value.Price || 0) <= remainingBudget;
      
      filteredCpus = filteredCpus.filter(budgetFilter);
      filteredMotherboards = filteredMotherboards.filter(budgetFilter);
      filteredRam = filteredRam.filter(budgetFilter);
      filteredGpus = filteredGpus.filter(budgetFilter);
      filteredPsu = filteredPsu.filter(budgetFilter);
      filteredSsd = filteredSsd.filter(budgetFilter);
    }
    

        // Check if selected components are still compatible; if not, set them to null
        if (!filteredCpus.some((cpu) => cpu.value === selectedCpu?.value)) {
          setSelectedCpu(null);
      }
  
      if (!filteredMotherboards.some((mb) => mb.value === selectedMotherboard?.value)) {
          setSelectedMotherboard(null);
      }
  
      if (!filteredRam.some((ram) => ram.value === selectedRam?.value)) {
          setSelectedRam(null);
      }
  
      if (!filteredGpus.some((gpu) => gpu.value === selectedGpu?.value)) {
          setSelectedGpu(null);
      }
  
      if (!filteredPsu.some((psu) => psu.value === selectedPsu?.value)) {
          setSelectedPsu(null);
      }
  
      if (!filteredSsd.some((ssd) => ssd.value === selectedSsd?.value)) {
          setSelectedSsd(null);
      }


    // Set the compatible components after filtering
    setCompatibleMotherboards(filteredMotherboards);
    setCompatibleCpus(filteredCpus);
    setCompatibleRam(filteredRam);
    setCompatibleGpus(filteredGpus);
    setCompatiblePsu(filteredPsu);
    setCompatibleSsd(filteredSsd);
}, [selectedCpu, selectedMotherboard, selectedRam, selectedGpu, selectedPsu, selectedSsd, components, totalBudget]);


const saveBuild = async () => {
  if (!selectedCpu || !selectedMotherboard || !selectedRam || !selectedGpu || !selectedPsu || !selectedSsd) {
    ToastAndroid.show("Select all components before saving", ToastAndroid.SHORT);
    return;
  }

  try {
    const buildData = {
      name: buildName,
      cpu: selectedCpu.label,
      motherboard: selectedMotherboard.label,
      ram: selectedRam.label,
      gpu: selectedGpu.label,
      psu: selectedPsu.label,
      ssd: selectedSsd.label,
      user: user.uid,
      createdAt: serverTimestamp(),
    };

    const buildsRef = collection(firestore, 'builds');
    await addDoc(buildsRef, buildData);

    // Refresh the builds context after saving
    refreshBuilds();

    // Clear selections
    setIsNameModalVisible(false);
    setSelectedCpu(null);
    setSelectedMotherboard(null);
    setSelectedRam(null);
    setSelectedGpu(null);
    setSelectedPsu(null);
    setSelectedSsd(null);

    alert("Build saved successfully!");
  } catch (error) {
    alert("Failed to save build.");
  }
};

  const navigateTo = (route) => {
    router.push(route);
  };

  // Static image mapping (adjust based on your actual image names)
const images = {
  IntelCorei513600K: require("../assets/images/Intel Core i5-13600K.png"),
  AMDRyzen57600: require("../assets/images/AMD Ryzen 5 7600.jpg"),
  IntelCorei713700K: require("../assets/images/Intel Core i7-13700K.png"),
  AMDRyzen77700X: require("../assets/images/AMD Ryzen 7 7700X.jpg"),
  IntelCorei913900K: require("../assets/images/Intel Core i9-13900K.jpg"),
  ASUSROGSTRIXZ790EGaming: require("../assets/images/ASUS ROG STRIX Z790-E Gaming.png"),
  MSIMAGB650TOMAHAWKWiFi: require("../assets/images/MSI MAG B650 TOMAHAWK WiFi.png"),
  GIGABYTEZ690AORUSProAX: require("../assets/images/GIGABYTE Z690 AORUS Pro AX.png"),
  ASRockB660MProRSMicroATXLGA1700Motherboard: require("../assets/images/ASRock B660M Pro RS Micro ATX LGA1700 Motherboard.png"),
  MSIPROB760PWiFi: require("../assets/images/MSI PRO B760-P WiFi.jpg"),
  CorsairVengeanceDDR560002x16GB: require("../assets/images/Corsair Vengeance DDR5-6000 (2x16GB).png"),
  GSkillTridentZ5RGBDDR564002x16GB: require("../assets/images/G.Skill Trident Z5 RGB DDR5-6400 (2x16GB).jpg"),
  KingstonFuryBeastDDR552002x16GB: require("../assets/images/Kingston Fury Beast DDR5-5200 (2x16GB).jpg"),
  KingstonFuryBeastDDR4SpecialEdition2x16GB: require("../assets/images/Kingston Fury Beast DDR4 Special Edition (2x16GB).png"),
  TeamGroupTForceVulcanDDR556002x16GB: require("../assets/images/TeamGroup T-Force Vulcan DDR5-5600 (2x16GB).jpg"),
  NVIDIARTX4060Ti: require("../assets/images/NVIDIA RTX 4060 Ti.png"),
  AMDRadeonRX7700XT: require("../assets/images/AMD Radeon RX 7700 XT.jpg"),
  NVIDIARTX3070Ti: require("../assets/images/NVIDIA RTX 3070 Ti.jpg"),
  AMDRX6700XT: require("../assets/images/AMD RX 6700 XT.jpg"),
  NVIDIARTX4080: require("../assets/images/NVIDIA RTX 4080.png"),
  CorsairRM750x: require("../assets/images/Corsair RM750x.png"),
  SeasonicFocusGX650: require("../assets/images/Seasonic Focus GX-650.jpg"),
  EVGASuperNOVA850G6: require("../assets/images/EVGA SuperNOVA 850 G6.jpg"),
  CoolerMasterMWE650V2: require("../assets/images/Cooler Master MWE 650 V2.png"),
  ThermaltakeToughpowerGF1: require("../assets/images/Thermaltake Toughpower GF1.jpg"),
  Samsung970EVOPlus1TB: require("../assets/images/Samsung 970 EVO Plus 1TB.jpg"),
  WDBlackSN850X1TB: require("../assets/images/WD Black SN850X 1TB.jpg"),
  CrucialP5Plus1TB: require("../assets/images/Crucial P5 Plus 1TB.jpg"),
  KingstonKC30001TB: require("../assets/images/Kingston KC3000 1TB.jpg"),
  SeagateFireCuda5301TB: require("../assets/images/Seagate FireCuda 530 1TB.png"),
  // Add other mappings here as needed
};

const renderItem = (item, type) => (
  <TouchableOpacity
    style={styles.modalitem}
    onPress={() => {
      if (type === "cpu") setSelectedCpu(item);
      else if (type === "motherboard") setSelectedMotherboard(item);
      else if (type === "ram") setSelectedRam(item);
      else if (type === "gpu") setSelectedGpu(item);
      else if (type === "psu") setSelectedPsu(item);
      else if (type === "ssd") setSelectedSsd(item);
      closeModal(type);
    }}
  >
    {item.value.Image && (
      <Image
        source={images[item.value["Image"]]} // Using predefined image mapping
        style={styles.modalitemImage}
      />
    )}
    <Text style={styles.modalitemText}>{item.label}</Text>
  </TouchableOpacity>
);

  

  const closeModal = (type) => {
    if (type === "cpu") setIsCpuModalVisible(false);
    else if (type === "motherboard") setIsMotherboardModalVisible(false);
    else if (type === "ram") setIsRamModalVisible(false);
    else if (type === "gpu") setIsGpuModalVisible(false);
    else if (type === "psu") setIsPsuModalVisible(false);
    else if (type === "ssd") setIsSsdModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["#008FDD", "#ffffff"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.2 }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/BuildMate-Logo.png")}
              style={styles.image}
            />
            <Text style={styles.title}>BUILDMATE</Text>
          </View>
        </View>

        <Text style={styles.semititle}>Build Your PC</Text>

        <View style={{ padding: 10, backgroundColor: "#f0f0f0", marginBottom: 10, borderRadius: 5 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Set Total Budget:</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 5,
              paddingHorizontal: 10,
              marginTop: 5,
            }}
            keyboardType="numeric"
            placeholder="Enter budget"
            value={totalBudget.toString()}
            onChangeText={(text) => setTotalBudget(Number(text) || 0)} // Parse input as a number
          />
        </View>

        <Text style={styles.subtitle}>CPU</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCpuModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedCpu ? selectedCpu.label : "Select a CPU"}
          </Text>
        </TouchableOpacity>
        {selectedCpu && (
          <View style={{width: "100%"}}>
          <Image
          source={images[selectedCpu.value["Image"]]} // Using predefined image mapping
          style={[styles.modalitemImage, {alignSelf: "center"}]}
        />    
          <View style={{alignSelf: "baseline"}}>
            <Text style={styles.paragraphText}>
              Cores: {selectedCpu.value.Cores}
            </Text>
            <Text style={styles.paragraphText}>
            Frequency: {selectedCpu.value.Frequency}
            </Text>
            <Text style={styles.paragraphText}>
            Memory: {selectedCpu.value["Memory Support"]}
            </Text>
            <Text style={styles.paragraphText}>
            Power Limit: {selectedCpu.value["Power Limit"]}W
            </Text>
            <Text style={styles.paragraphText}>
            Socket: {selectedCpu.value["Socket Type"]}
            </Text>
            <Text style={styles.paragraphText}>
            Threads: {selectedCpu.value.Threads}
            </Text>
            <Text style={styles.paragraphText}>
            Price: P{selectedCpu.value.Price}
            </Text>
        </View>
        </View>
      )}

        <Text style={styles.subtitle}>Motherboard</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsMotherboardModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedMotherboard ? selectedMotherboard.label : "Select a Motherboard"}
          </Text>
        </TouchableOpacity>
        {selectedMotherboard && (
          <View style={{width: "100%"}}>
          <Image
          source={images[selectedMotherboard.value["Image"]]} // Using predefined image mapping
          style={[styles.modalitemImage, {alignSelf: "center"}]}
        /> 
          <View style={{alignSelf: "baseline"}}>
            <Text style={styles.paragraphText}>
            Form Factor (Size): {selectedMotherboard.value["Form Factor (Size)"]}
            </Text>
            <Text style={styles.paragraphText}>
            Memory: {selectedMotherboard.value["Memory Type"]}
            </Text>
            <Text style={styles.paragraphText}>
            Number of Slots & Capacity: {selectedMotherboard.value["Number of Slots and Capacity"]}
            </Text>
            <Text style={styles.paragraphText}>
            PCIe Version: {selectedMotherboard.value["PCIe Version"]}
            </Text>
            <Text style={styles.paragraphText}>
            Power Limit: {selectedMotherboard.value["Power Limit"]}W
            </Text>
            <Text style={styles.paragraphText}>
            Socket: {selectedMotherboard.value["Socket Type"]}
            </Text>
            <Text style={styles.paragraphText}>
            Price: P{selectedMotherboard.value.Price}
            </Text>
        </View>
        </View>
      )}
        <Text style={styles.subtitle}>RAM</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsRamModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedRam ? selectedRam.label : "Select RAM"}
          </Text>
        </TouchableOpacity>
        {selectedRam && (
          <View style={{width: "100%"}}>
          <Image
          source={images[selectedRam.value["Image"]]} // Using predefined image mapping
          style={[styles.modalitemImage, {alignSelf: "center"}]}
        /> 
          <View style={{alignSelf: "baseline"}}>
            <Text style={styles.paragraphText}>
            Capacity: {selectedRam.value.Capacity}
            </Text>
            <Text style={styles.paragraphText}>
            DIMM Type: {selectedRam.value["DIMM Type"]}
            </Text>
            <Text style={styles.paragraphText}>
            Memory: {selectedRam.value["Memory Type"]}
            </Text>
            <Text style={styles.paragraphText}>
            Speed: {selectedRam.value.Speed}
            </Text>
            <Text style={styles.paragraphText}>
            Wattage: {selectedRam.value.Wattage}W
            </Text>
            <Text style={styles.paragraphText}>
            Price: P{selectedRam.value.Price}
            </Text>
        </View>
        </View>
      )}
        <Text style={styles.subtitle}>GPU</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsGpuModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedGpu ? selectedGpu.label : "Select a GPU"}
          </Text>
        </TouchableOpacity>
        {selectedGpu && (
          <View style={{width: "100%"}}>
          <Image
          source={images[selectedGpu.value["Image"]]} // Using predefined image mapping
          style={[styles.modalitemImage, {alignSelf: "center"}]}
        /> 
          <View style={{alignSelf: "baseline"}}>
            <Text style={styles.paragraphText}>
            External Power: {selectedGpu.value["External Power"]}
            </Text>
            <Text style={styles.paragraphText}>
            Height: {selectedGpu.value.Height}
            </Text>
            <Text style={styles.paragraphText}>
            Lenght: {selectedGpu.value.Length}
            </Text>
            <Text style={styles.paragraphText}>
            Width: {selectedGpu.value.Width}
            </Text>
            <Text style={styles.paragraphText}>
            Wattage: {selectedGpu.value.Wattage}W
            </Text>
            <Text style={styles.paragraphText}>
            Memory Size: {selectedGpu.value["Memory Size"]}
            </Text>
            <Text style={styles.paragraphText}>
            Outputs: {selectedGpu.value.Outputs}
            </Text>
            <Text style={styles.paragraphText}>
            PCIe Interface: {selectedGpu.value["PCIe Interface"]}
            </Text>
            <Text style={styles.paragraphText}>
            Price: P{selectedGpu.value.Price}
            </Text>
        </View>
        </View>
      )}
        <Text style={styles.subtitle}>PSU</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsPsuModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedPsu ? selectedPsu.label : "Select a PSU"}
          </Text>
        </TouchableOpacity>
        {selectedPsu && (
          <View style={{width: "100%"}}>
          <Image
          source={images[selectedPsu.value["Image"]]} // Using predefined image mapping
          style={[styles.modalitemImage, {alignSelf: "center"}]}
        /> 
        <View style={{alignSelf: "baseline"}}>
            <Text style={styles.paragraphText}>
            Type: {selectedPsu.value.Type}
            </Text>
            <Text style={styles.paragraphText}>
            Wattage: {selectedPsu.value.Wattage}W
            </Text>
            <Text style={styles.paragraphText}>
            Price: P{selectedPsu.value.Price}
            </Text>
        </View>
        </View>
      )}
        <Text style={styles.subtitle}>SSD</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsSsdModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedSsd ? selectedSsd.label : "Select an SSD"}
          </Text>
        </TouchableOpacity>
        {selectedSsd && (
          <View style={{width: "100%"}}>
          <Image
          source={images[selectedSsd.value["Image"]]} // Using predefined image mapping
          style={[styles.modalitemImage, {alignSelf: "center"}]}
        /> 
        <View style={{alignSelf: "baseline"}}>
            <Text style={styles.paragraphText}>
            Capacity: {selectedSsd.value.Capacity}
            </Text>
            <Text style={styles.paragraphText}>
            Form Factor: {selectedSsd.value["Form Factor"]}
            </Text>
            <Text style={styles.paragraphText}>
            Interface: {selectedSsd.value.Interface}
            </Text>
            <Text style={styles.paragraphText}>
            Wattage: {selectedSsd.value.Wattage}W
            </Text>
            <Text style={styles.paragraphText}>
            Price: P{selectedSsd.value.Price}
            </Text>
        </View>
        </View>
      )}
      <View>
        <Text style={{marginTop: 20}}>Total: P
          {currentTotal}
        </Text>
      </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setIsNameModalVisible(true)}  // Show modal when button is pressed
        >
          <Text style={styles.saveButtonText}>Save Build</Text>
        </TouchableOpacity>


      </ScrollView>

      {/* Modals */}

      {isNameModalVisible && (
        <View style={styles.modalnameContainer}>
          <Text style={styles.modalTitle}>Enter Build Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter build name"
            value={buildName}
            onChangeText={setBuildName}  // Update the build name state
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={saveBuild}  // Call saveBuild function after name is entered
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setIsNameModalVisible(false)}  // Close modal without saving
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}



      <Modal visible={isCpuModalVisible} onRequestClose={() => closeModal("cpu")} transparent>
        <TouchableWithoutFeedback onPress={() => closeModal("cpu")}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Use only FlatList here */}
                <FlatList
                  data={compatibleCpus}
                  renderItem={({ item }) => renderItem(item, "cpu")}
                  keyExtractor={(item) => item.key}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={isMotherboardModalVisible} onRequestClose={() => closeModal("motherboard")} transparent>
        <TouchableWithoutFeedback onPress={() => closeModal("motherboard")}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Use only FlatList here */}
                <FlatList
                  data={compatibleMotherboards}
                  renderItem={({ item }) => renderItem(item, "motherboard")}
                  keyExtractor={(item) => item.key}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={isRamModalVisible} onRequestClose={() => closeModal("ram")} transparent>
        <TouchableWithoutFeedback onPress={() => closeModal("ram")}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Use only FlatList here */}
                <FlatList
                  data={compatibleRam}
                  renderItem={({ item }) => renderItem(item, "ram")}
                  keyExtractor={(item) => item.key}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={isGpuModalVisible} onRequestClose={() => closeModal("gpu")} transparent>
        <TouchableWithoutFeedback onPress={() => closeModal("gpu")}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Use only FlatList here */}
                <FlatList
                  data={compatibleGpus}
                  renderItem={({ item }) => renderItem(item, "gpu")}
                  keyExtractor={(item) => item.key}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={isPsuModalVisible} onRequestClose={() => closeModal("psu")} transparent>
        <TouchableWithoutFeedback onPress={() => closeModal("psu")}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Use only FlatList here */}
                <FlatList
                  data={compatiblePsu}
                  renderItem={({ item }) => renderItem(item, "psu")}
                  keyExtractor={(item) => item.key}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={isSsdModalVisible} onRequestClose={() => closeModal("ssd")} transparent>
        <TouchableWithoutFeedback onPress={() => closeModal("ssd")}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Use only FlatList here */}
                <FlatList
                  data={compatibleSsd}
                  renderItem={({ item }) => renderItem(item, "ssd")}
                  keyExtractor={(item) => item.key}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.bottomMenuItem} onPress={() => navigateTo("./home")}>
          <Icon name="home" size={30} color="#0056FF" />
          <Text style={styles.bottomMenuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomMenuItem} onPress={() => navigateTo("./community")}>
          <Icon name="users" size={30} color="#0056FF" />
          <Text style={styles.bottomMenuText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomMenuItem} onPress={() => navigateTo("./partpicker")}>
          <Icon name="cogs" size={30} color="black" />
          <Text style={styles.bottomMenuText}>Part Picker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomMenuItem} onPress={() => navigateTo("./profile")}>
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
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 125,
    paddingLeft: 25,
    paddingRight: 25,
    flexGrow: 1,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Background shade for modal
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    height: 400, // Restrict modal height to ensure scrolling works
  },
  modalScrollContainer: {
    flexGrow: 1, // To ensure the content is scrollable when necessary
    paddingBottom: 20, // Optional padding at the bottom of the modal
  },
  modalitem: {
    padding: 10,
    backgroundColor: "#ffffff", // Changed from #f1f1f1 (light gray) to #ffffff (white)
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10, // Add some space between items
  },
  modalitemImage: {
    width: 100, // Set the width of the image
    height: 100, // Set the height of the image
    resizeMode: "cover", // Adjust image fit
    marginBottom: 10, // Space between image and text
    alignSelf: "center", // Center the image horizontally
  },
  modalitemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center", // Center text
  },
  logoContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  section: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
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
    flex: 1,
    marginBottom: 25,
  },
  paragraphText: { 
    color: "#555", 
    marginBottom: 10, 
    fontSize: 14 
  },
  button: {
    padding: 10,
    backgroundColor: "#008FDD",
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  subtitle: {
    color: "#008FDD",
    fontWeight: "900",
    fontSize: 16,
    alignSelf: "baseline",
    marginLeft: 25,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
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
  saveButton: {
    padding: 10,
    backgroundColor: "#0056FF",
    borderRadius: 5,
    width: "50%",
    marginVertical: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },  
  modalnameContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    zIndex: 1, // Ensure modal is above other content
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  input: {
    height: 40,
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  modalButton: {
    backgroundColor: '#0056FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },  
});

