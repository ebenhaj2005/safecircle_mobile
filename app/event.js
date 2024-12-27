import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function EventsPage() {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  // Fetch the access token from SecureStore
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (token) {
          setAccessToken(token);
        } else {
          throw new Error("Access token not found. Please log in.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAccessToken();
  }, []);

  const fetchCircles = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        "http://192.168.1.61:8080/circle/event/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const text = await response.text(); // Get the response as text
        throw new Error(`Failed to fetch circles: ${text}`);
      }

      const data = await response.json();
      setCircles(data); // Set circles fetched from backend
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch circles when access token is available
  useEffect(() => {
    fetchCircles();
  }, [accessToken]);

  // Filter circles based on the search query
  const filteredCircles = circles.filter((circle) =>
    circle.circleName && circle.circleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCircle = async (circleId) => {
    Alert.alert(
      "Join Circle",
      "Are you sure you want to join this event circle?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              // Fetch userId from SecureStore or any other source
              const userId = await SecureStore.getItemAsync("userId");
              if (!userId) {
                throw new Error("User ID not found.");
              }

              // Step 1: Send a request to add the user to the event (circle)
              const addUserToEventResponse = await fetch(
                `http://192.168.1.61:8080/event/${circleId}/add/${userId}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!addUserToEventResponse.ok) {
                const text = await addUserToEventResponse.text();
                throw new Error(`Failed to join event: ${text}`);
              }

              Alert.alert("Success", "You have successfully joined the event circle!");
              // Optionally re-fetch circles to update the UI
              fetchCircles();
            } catch (err) {
              Alert.alert("Error", `Failed to join circle: ${err.message}`);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading circles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Circles</Text>
        <TouchableOpacity style={styles.addButton}>
          <Link href="/eventrequestpage" style={styles.link}>
            <Icon name="add-circle-outline" size={29} color="#d68787" />
          </Link>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color="#a29da0"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search circles"
          placeholderTextColor="#a29da0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCircles}
        keyExtractor={(item) => String(item.circleId)}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View>
              <Text style={styles.eventName}>{item.circleName}</Text>
              <Text style={styles.eventDate}>Type: {item.circleType}</Text>
            </View>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinCircle(item.circleId)}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan QR-code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3ebf5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  eventCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  eventName: {
    fontSize: 18,
    fontWeight: "500",
  },
  eventDate: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  joinButton: {
    backgroundColor: "#d68787",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scanButton: {
    backgroundColor: "#d68787",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
