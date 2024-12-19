import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import profilePicture from '../assets/images/PP-removebg-preview.png';

export default function ProfilePI() {
  const [user, setUser] = useState({
    firstName: "Loading...",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        const accessToken = await SecureStore.getItemAsync("accessToken");

        if (userId && accessToken) {
          const response = await fetch(`http://10.2.88.103:8080/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser({
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              phone: userData.phone || "Not provided",
              dateOfBirth: userData.dateOfBirth || "Not provided",
              
            });
          } else {
            console.error("API error:", response.status);
          }
        } else {
          console.error("User ID or access token not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Link href="/profile" style={{ alignSelf: "flex-start" }}>
            <Text style={styles.backButtonText}>Back</Text>
          </Link>
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image style={styles.profilePicture} source={profilePicture} />
            <View style={styles.editProfilePicture}>
              <FontAwesome name="pencil" size={24} color="#fff" />
            </View>
          </View>

          {/* User Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>First name:</Text>
            <Text style={styles.info}>{user.firstName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Last name:</Text>
            <Text style={styles.info}>{user.lastName}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{user.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Phone number:</Text>
            <Text style={styles.info}>{user.phone}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.info}>{user.dateOfBirth}</Text>
          </View>
        </View>

        {/* History Button */}
        <TouchableOpacity style={styles.historyButton}>
          <Link href="/profileHistory" style={styles.link}>
            <Text style={styles.historyButtonText}>History</Text>
          </Link>
        </TouchableOpacity>
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
    marginTop: 60
  },
  container: {
    alignItems: "center",
    width: "100%"
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#CD9594",
    borderRadius: 5
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    width: "100%"
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#ccc"
  },
  editProfilePicture: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 20
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1
  },
  info: {
    fontSize: 16,
    color: "#555",
    flex: 2
  },
  editButton: {
    backgroundColor: "#CD9594",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
    marginTop: 20
  },
  historyButton: {
    width: "90%",
    backgroundColor: "#CD9594",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  historyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  link: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
