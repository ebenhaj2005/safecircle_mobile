import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { format } from "date-fns"; // Importing date-fns for date formatting
import LocationUpdater from './location';

const CircleHistory = () => {
  const [alertHistory, setAlertHistory] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { circleId } = route.params || {};

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
        } else {
          console.error("Access token not found");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAuthData();
  }, []);

  useEffect(() => {
    if (!accessToken || !circleId) return;

    const fetchAlertHistory = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        if (!storedUserId) {
          console.error("User ID is missing");
          Alert.alert("Error", "User ID is missing");
          return;
        }

        const response = await fetch(
          `http://192.168.1.61:8080/alert/${storedUserId}/${circleId}/getAllCircleAlerts`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch alert history");
        const data = await response.json();
        setAlertHistory(data);
      } catch (error) {
        console.error("Error fetching alert history:", error);
        Alert.alert("Error", `Failed to fetch alert history: ${error.message}`);
      }
    };

    fetchAlertHistory();
  }, [accessToken, circleId]);

  const openLocationInMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", `Unable to open the map: ${err.message}`)
    );
  };

  return (
    <View style={styles.container}> <LocationUpdater />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Alert History</Text>
      <FlatList
        data={alertHistory}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={({ item }) => {
          // Formatting the date
          const formattedDate = format(new Date(item.createdAt), "PPpp");

          return (
            <View style={styles.alertItem}>
              <Text>{item.description}</Text>
              <Text>{formattedDate}</Text> {/* Display formatted date */}
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() =>
                  openLocationInMaps(
                    item.location.latitude,
                    item.location.longitude
                  )
                }
              >
                <Text style={styles.locationButtonText}>Show Location</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#CD9594",
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  alertItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  locationButton: {
    marginTop: 10,
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  locationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CircleHistory;
