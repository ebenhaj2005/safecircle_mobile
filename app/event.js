import React from "react";
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

const events = [
  { id: "1", name: "Tomorrowland", date: "27/11/2024 - 30/11/2024" },
  { id: "2", name: "Couleur Café", date: "04/12/2024 - 08/12/2024" },
  { id: "3", name: "GRASPOP", date: "03/02/2025 - 07/02/2025" }
];

export default function EventsPage() {
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
          placeholder="search events"
          placeholderTextColor="#a29da0"
        />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
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

      {/* Scan QR Code Button */}
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
