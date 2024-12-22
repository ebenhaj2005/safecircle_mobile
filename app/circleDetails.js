import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import * as SecureStore from "expo-secure-store";

const InvitationPage = ({ navigation }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

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
    if (accessToken) {
      fetchInvitations();
    }
  }, [accessToken]);

  const fetchInvitations = async () => {
    try {
      const response = await fetch(
        "http://192.168.129.177:8080/invitations", // Replace with the actual endpoint to fetch invitations
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch invitations');
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      Alert.alert("Error", `Failed to load invitations: ${error.message}`);
    }
  };

  const handleAcceptInvitation = async (invitationId, circleId) => {
    if (!accessToken || !circleId) {
      console.error("Circle ID or access token is missing");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.129.177:8080/invitation/${invitationId}/${circleId}/accept`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to accept invitation');
      Alert.alert("Success", "Invitation accepted!");

      // Re-fetch the circles after accepting the invitation
      fetchUserCircles();

    } catch (error) {
      console.error("Error accepting invitation:", error);
      Alert.alert("Error", `Failed to accept invitation: ${error.message}`);
    }
  };

  const fetchUserCircles = async () => {
    // Fetch the user's circles after accepting the invitation
    try {
      const response = await fetch(
        "http://192.168.129.177:8080/user/circles", // Replace with the actual endpoint to fetch circles
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch user circles');
      const data = await response.json();
      // Update the state with the circles data
      // setUserCircles(data);
    } catch (error) {
      console.error("Error fetching user circles:", error);
    }
  };

  const handleInvitationSelect = (invitation) => {
    setSelectedInvitation(invitation);
    setModalVisible(true);  // Show the modal for accepting invitation
  };

  const handleCancelInvitation = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      <FlatList
        data={invitations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.invitationItem}
            onPress={() => handleInvitationSelect(item)}
          >
            <Text style={styles.invitationText}>
              Invitation from {item.sender.firstName} {item.sender.lastName}
            </Text>
            <Text>{item.circleName}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal for accepting invitation */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelInvitation}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to accept the invitation to join the circle:{" "}
              {selectedInvitation?.circleName}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  handleAcceptInvitation(
                    selectedInvitation.id,
                    selectedInvitation.circleId
                  )
                }
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  invitationItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  invitationText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#CD9594",
    paddingVertical: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default InvitationPage;
