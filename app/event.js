import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Voor toegang tot opgeslagen tokens

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  // Haal het accessToken op uit SecureStore
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

  // Haal events op zodra het token beschikbaar is
  useEffect(() => {
    const fetchEvents = async () => {
      if (!accessToken) return; // Wacht op het accessToken

      try {
        const response = await fetch(
          "http://192.168.0.110:8080/circle/event/all",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data); // Zorg dat de server een array van events terugstuurt
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [accessToken]);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading events...</Text>
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
        <Text style={styles.title}>Events</Text>
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
          placeholder="Search events"
          placeholderTextColor="#a29da0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
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
    padding: 16
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 30
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  addButton: {
    padding: 8
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3ebf5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16
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
    borderColor: "#ececec"
  },
  eventName: {
    fontSize: 18,
    fontWeight: "500"
  },
  eventDate: {
    fontSize: 14,
    color: "#a0a0a0"
  },
  joinButton: {
    backgroundColor: "#d68787",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  scanButton: {
    backgroundColor: "#d68787",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
