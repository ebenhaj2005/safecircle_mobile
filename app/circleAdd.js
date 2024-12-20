import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Updated import
import { useNavigation } from "@react-navigation/native";

const CircleAdd = () => {
  const [circleName, setCircleName] = useState("");
  const [circleType, setCircleType] = useState("REGULAR"); // Default value
  const [available, setAvailable] = useState(true); // Default value
  const navigation = useNavigation();

  const userId = 7; // Replace with dynamic user ID if needed
  const token =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3Iiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NzM1ODE2fQ.RAk84Mi-zBLIoE_JSM24xeHIKTnpbU_gmylzQFeFQQ4";
  const addCircleUrl = `http://192.168.129.177:8080/circle/${userId}/create`;

  const handleAddCircle = async () => {
    if (!circleName.trim()) {
      Alert.alert("Error", "Circle name cannot be empty");
      return;
    }

    try {
      const response = await fetch(addCircleUrl, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          circleName,
          circleType,
          available
        })
      });

      if (response.ok) {
        Alert.alert("Success", "Circle added successfully!");
        navigation.goBack(); // Navigate back to the Circles page
      } else {
        const result = await response.json();
        Alert.alert("Error", result.message || "Failed to add circle");
      }
    } catch (error) {
      console.error("Error adding circle:", error);
      Alert.alert("Error", "Unable to connect to the server");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Add a New Circle</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter circle name"
        value={circleName}
        onChangeText={setCircleName}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddCircle}>
        <Text style={styles.addButtonText}>Add Circle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: "#CD9594",  // Attractive blue color
        borderRadius: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#CD9594"
  },
  input: {
    borderWidth: 1,
    borderColor: "#CD9594",
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginBottom: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#CD9594"
  },
  picker: {
    borderWidth: 1,
    borderColor: "#CD9594",
    borderRadius: 10,
    marginBottom: 20
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  addButton: {
    backgroundColor: "#CD9594",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default CircleAdd;
