import React, { createContext, useState, useEffect } from "react";
import { auth } from './firebaseConfig'; // Firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Firebase auth methods
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods
import { firestore } from './firebaseConfig'; // Firebase firestore
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage for persistence

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null); // State to store the username
  const [email, setEmail] = useState(null); // State to store the email

  useEffect(() => {
    // Check if the user data exists in AsyncStorage
    const checkUserFromStorage = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUsername(parsedUser.username);
        setEmail(parsedUser.email);
      }
    };

    checkUserFromStorage();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setEmail(userData.email);
          
          // Store user data in AsyncStorage for persistence
          await AsyncStorage.setItem('user', JSON.stringify({ ...user, username: userData.username, email: userData.email }));
        }
      } else {
        setUser(null);
        setUsername(null);
        setEmail(null);
        await AsyncStorage.removeItem('user'); // Remove user data from AsyncStorage on logout
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear user data in context and AsyncStorage
      setUser(null);
      setUsername(null);
      setEmail(null);
      
      await AsyncStorage.removeItem('user'); // Remove user data from AsyncStorage
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, username, email, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
