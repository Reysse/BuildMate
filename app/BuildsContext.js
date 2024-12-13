import React, { createContext, useState, useEffect, useContext } from 'react';
import { firestore } from './firebaseConfig'; // Firebase configuration
import { collection, getDocs } from 'firebase/firestore'; // Firestore methods

// Create the context
const BuildsContext = createContext();

// Create the provider component
export const BuildsProvider = ({ children }) => {
  const [builds, setBuilds] = useState([]); // State to store builds
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        setLoading(true);
        const buildsRef = collection(firestore, 'builds'); // Reference to the 'builds' collection
        const querySnapshot = await getDocs(buildsRef);
        
        const buildsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setBuilds(buildsData); // Set fetched builds
      } catch (error) {
        setError('Error fetching builds data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, []); // Only run once on mount

  return (
    <BuildsContext.Provider value={{ builds, loading, error }}>
      {children}
    </BuildsContext.Provider>
  );
};

// Custom hook to use BuildsContext in other components

export default BuildsContext;

