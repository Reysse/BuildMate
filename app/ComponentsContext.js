import React, { createContext, useState, useEffect } from "react";
import { firestore } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Create a Context for storing components data
export const ComponentsContext = createContext();

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState({
    cpus: [],
    motherboards: [],
    rams: [],
    gpus: [],
    psus: [],
    ssds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cpuSnapshot = await getDocs(collection(firestore, "CPU"));
        const motherboardSnapshot = await getDocs(collection(firestore, "Motherboard"));
        const ramSnapshot = await getDocs(collection(firestore, "RAM"));
        const gpuSnapshot = await getDocs(collection(firestore, "GPU"));
        const psuSnapshot = await getDocs(collection(firestore, "PSU"));
        const ssdSnapshot = await getDocs(collection(firestore, "SSD"));

        setComponents({
          cpus: cpuSnapshot.docs.map((doc) => ({
            label: doc.data().Name,
            value: { ...doc.data(), id: doc.id }, // Ensure value contains document data and ID
            key: doc.id, // Ensure key is the document ID
          })),
          motherboards: motherboardSnapshot.docs.map((doc) => ({
            label: doc.data().Name,
            value: { ...doc.data(), id: doc.id },
            key: doc.id,
          })),
          rams: ramSnapshot.docs.map((doc) => ({
            label: doc.data().Name,
            value: { ...doc.data(), id: doc.id },
            key: doc.id,
          })),
          gpus: gpuSnapshot.docs.map((doc) => ({
            label: doc.data().Name,
            value: { ...doc.data(), id: doc.id },
            key: doc.id,
          })),
          psus: psuSnapshot.docs.map((doc) => ({
            label: doc.data().Name,
            value: { ...doc.data(), id: doc.id },
            key: doc.id,
          })),
          ssds: ssdSnapshot.docs.map((doc) => ({
            label: doc.data().Name,
            value: { ...doc.data(), id: doc.id },
            key: doc.id,
          })),
        });
      } catch (error) {
        console.error("Error fetching data from Firestore", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ComponentsContext.Provider value={components}>
      {children}
    </ComponentsContext.Provider>
  );
 
};
export default ComponentsContext;
