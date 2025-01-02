import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const UpdateCircle = () => {
  const [circleName, setCircleName] = useState("");
  const [circleType, setCircleType] = useState("REGULAR");
  const [available, setAvailable] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // To store the user to be added
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility

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
    if (!circleId) {
      Alert.alert("Error", "Circle ID is missing!");
      navigation.goBack();
      return;
    }

    const fetchCircleDetails = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `http://192.168.1.61:8080/circle/${circleId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );

        if (!response.ok) throw new Error("Failed to fetch circle details");
        const data = await response.json();
        setCircleName(data.circleName);
        setCircleType(data.circleType);
        setAvailable(data.available);
      } catch (error) {
        console.error("Error fetching circle details:", error);
        Alert.alert("Error", `Failed to load circle details: ${error.message}`);
      }
    };

    fetchCircleDetails();
  }, [circleId, accessToken]);

  const handleSearchUsers = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      Alert.alert("Error", "Please enter at least a first name or last name.");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.61:8080/user/search?firstName=${firstName}&lastName=${lastName}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) throw new Error("Failed to search users");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
      Alert.alert("Error", `Failed to search users: ${error.message}`);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the user for the confirmation modal
    setModalVisible(true); // Show the modal
  };

  const handleSendInvitation = async () => {
    if (!selectedUser) return;

    try {
      // Retrieve sender (logged-in user) ID from SecureStore
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (!storedUserId) {
        console.error("User ID is missing");
        Alert.alert("Error", "User ID is missing");
        return;
      }

      // Prepare the invitation data
      const senderId = storedUserId; // Sender is the logged-in user
      const receiverId = selectedUser.userId; // Receiver is the selected user

      const response = await fetch(
        `http://192.168.1.61:8080/invitation/create/${circleId}/from/${senderId}/to/${receiverId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) throw new Error("Failed to send invitation");
      Alert.alert("Success", "Invitation sent successfully.");
      setModalVisible(false); // Hide the modal after sending invitation
    } catch (error) {
      console.error("Error sending invitation:", error);
      Alert.alert("Error", `Failed to send invitation: ${error.message}`);
    }
  };

  const handleCancelInvitation = () => {
    setModalVisible(false); // Hide the modal if user cancels
  };

  const handleAddUsersToCircle = async () => {
    // Logic to add users to the circle (if any other action needed)
    navigation.goBack();
  };

  const handleUpdateCircleName = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.61:8080/circle/${circleId}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            circleName,
            circleType,
            available
          })
        }
      );

      if (!response.ok) throw new Error("Failed to update circle");
      Alert.alert("Success", "Circle updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating circle:", error);
      Alert.alert("Error", `Failed to update circle: ${error.message}`);
    }
  };

  const handleDeleteCircle = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.61:8080/circle/${circleId}/delete`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (!response.ok) throw new Error("Failed to delete circle");
      Alert.alert("Success", "Circle deleted successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting circle:", error);
      Alert.alert("Error", `Failed to delete circle: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Update Circle</Text>
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Circle Name</Text>
          <TextInput
            style={styles.input}
            value={circleName}
            onChangeText={setCircleName}
            placeholder="Circle Name"
          />
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateCircleName}
          >
            <Text style={styles.updateButtonText}>Update Circle Name</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Search Users</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
          />
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
          />
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleSearchUsers}
          >
            <Text style={styles.updateButtonText}>Search</Text>
          </TouchableOpacity>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleUserSelect(item)} // Show modal when user is selected
                style={styles.resultItem}
              >
                <Text>{`${item.firstName} ${item.lastName}`}</Text>
                <Text>{item.email}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Button to navigate to Circle History */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate("circleHistory", { circleId })}
        >
          <Text style={styles.historyButtonText}>View Circle History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Delete Circle",
              "Are you sure you want to delete this circle?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: handleDeleteCircle }
              ]
            );
          }}
        >
          <Text style={styles.deleteButtonText}>Delete Circle</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for user selection confirmation */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelInvitation}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to add {selectedUser?.firstName}{" "}
              {selectedUser?.lastName} to the circle?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSendInvitation}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCancelInvitation}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    marginTop: 40,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#CD9594",
    borderRadius: 10
  },
  backButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold"
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333",
    textAlign: "center"
  },
  settingContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
    marginBottom: 12
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fafafa"
  },
  updateButton: {
    backgroundColor: "#CD9594",
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  updateButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600"
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 70,
  },
  deleteButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600"
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center"
  },
  modalText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#CD9594",
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center"
  },
  resultItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10
  },
  historyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  historyButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600"
  }
});

export default UpdateCircle;