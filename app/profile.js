import React, {useEffect, useState} from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Link } from "expo-router";
import profilePicture from '../assets/images/PP-removebg-preview.png';

export default function Profile() {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Haal de userId op uit Secure Storage
        const userId = await SecureStore.getItemAsync("userId");
        const accessToken = await SecureStore.getItemAsync("accessToken");

        if (userId && accessToken) {
          
          const response = await fetch(`http://192.168.0.110:8080/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`, 
            },
          });

          if (response.ok) {
            const userData = await response.json();
            const fullName = `${userData.firstName} ${userData.lastName}`; 
            setUserName(fullName);
            console.log("User data:", userData);
          } else {
            console.error("API error:", response.status);
            setUserName("Unknown User");
          }
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("Error");
      }
    };

    fetchUserData();
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image
            style={styles.profilePicture}
            source={profilePicture}
          />
        </View>

        {/* Profile Information */}
        <Text style={styles.name}>{userName}</Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Link href="/profilePI" style={styles.link}>
              <Text style={styles.buttonText}>Personal Information</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Link href="/profileChildren" style={styles.link}>
              <Text style={styles.buttonText}>Children</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Link href="/app/settings" style={styles.link}>
              <Text style={styles.buttonText}>App Settings</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Link href="/contact" style={styles.link}>
              <Text style={styles.buttonText}>Contact</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Link href="/login" style={styles.link}>
            <Text style={styles.buttonText}>Log Out</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
    marginTop: 40
  },
  container: {
    alignItems: "center",
    width: "100%"
  },
  profilePictureContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center"
  },
  button: {
    width: "90%",
    backgroundColor: "#CD9594",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  link: {
    width: "100%"
  }
});
