import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, FlatList, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native"; // Add TouchableWithoutFeedback and Keyboard
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"; // For bottom menu icons
import { ComponentsContext } from "./ComponentsContext"; // Importing the ComponentsContext
import AuthContext from "./AuthContext"; // Importing the AuthContext

export default function PartPicker() {
  const router = useRouter();
  const { user, username } = useContext(AuthContext); // Destructure user and username from AuthContext
  const components = useContext(ComponentsContext); // Consume the ComponentsContext to get components data

  const [selectedCpu, setSelectedCpu] = useState(null);
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedGpu, setSelectedGpu] = useState(null);
  const [selectedPsu, setSelectedPsu] = useState(null);
  const [selectedSsd, setSelectedSsd] = useState(null);

  const [isCpuModalVisible, setIsCpuModalVisible] = useState(false);
  const [isMotherboardModalVisible, setIsMotherboardModalVisible] = useState(false);
  const [isRamModalVisible, setIsRamModalVisible] = useState(false);
  const [isGpuModalVisible, setIsGpuModalVisible] = useState(false);
  const [isPsuModalVisible, setIsPsuModalVisible] = useState(false);
  const [isSsdModalVisible, setIsSsdModalVisible] = useState(false);

  const [compatibleMotherboards, setCompatibleMotherboards] = useState([]);
  const [compatibleCpus, setCompatibleCpus] = useState([]);
  const [compatibleRam, setCompatibleRam] = useState([]);
  const [compatibleGpus, setCompatibleGpus] = useState([]);
  const [compatiblePsu, setCompatiblePsu] = useState([]);
  const [compatibleSsd, setCompatibleSsd] = useState([]);

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

    const requiredWattage = calculateRequiredWattage();

    // Filter logic as before
    if (selectedCpu) {
        const cpuSocketType = cleanSocketType(selectedCpu.value["Socket Type"]);

        filteredMotherboards = components.motherboards
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
        filteredMotherboards = components.motherboards
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
        filteredMotherboards = components.motherboards
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

    // SSD Compatibility Logic
    if (selectedSsd) {
        filteredSsd = components.ssds
            .filter((ssd) => selectedMotherboard?.value["Supported SSD Interface"] === ssd.value["Interface"])
            .map((ssd, index) => ({
                label: ssd.value["Name"],
                value: ssd.value,
                key: `ssd-${ssd.value["ID"] || index}`,
            }));
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
}, [
    selectedCpu, selectedMotherboard, selectedRam, selectedGpu, selectedPsu, selectedSsd, components,
]);





  const navigateTo = (route) => {
    router.push(route);
  };

  // Static image mapping (adjust based on your actual image names)
const images = {
  IntelCorei513600K: require("../assets/images/Intel Core i5-13600K.png"),
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

        <Text style={styles.subtitle}>CPU</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCpuModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedCpu ? selectedCpu.label : "Select a CPU"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Motherboard</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsMotherboardModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedMotherboard ? selectedMotherboard.label : "Select a Motherboard"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>RAM</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsRamModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedRam ? selectedRam.label : "Select RAM"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>GPU</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsGpuModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedGpu ? selectedGpu.label : "Select a GPU"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>PSU</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsPsuModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedPsu ? selectedPsu.label : "Select a PSU"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>SSD</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsSsdModalVisible(true)}
        >
          <Text style={styles.buttonText}>
            {selectedSsd ? selectedSsd.label : "Select an SSD"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
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

      {/* Repeat for RAM, GPU, PSU, SSD modals */}

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
});

