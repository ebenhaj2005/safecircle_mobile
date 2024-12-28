import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const Circle = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [circles, setCircles] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const numColumns = 2;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");

        if (storedUserId && storedAccessToken) {
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
        } else {
          console.error("Authentication details not found");
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
      }
    };

    fetchAuthData();
  }, []);

  useEffect(() => {
    const fetchCircles = async () => {
      if (!userId || !accessToken) {
        return;
      }

      const url = `http://192.168.0.114:8080/circle/getAll/${userId}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const contentType = response.headers.get("Content-Type");

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not in JSON format.");
        }

        const data = await response.json();
        console.log("Received Circles Data:", data);

        setCircles(data);
      } catch (error) {
        console.error("Error fetching circles data:", error);
      }
    };

    const fetchInvitations = async () => {
      if (!userId || !accessToken) {
        //console.error("User  ID or Access Token is missing");
        return;
      }

      const url = `http://192.168.0.114:8080/invitation/showAll/${userId}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok)
          throw new Error(`Network response was not ok: ${response.status}`);
        const data = await response.json();
        setInvitations(data);
      } catch (error) {
        //console.error("Error fetching invitations data:", error);
      }
    };

    fetchCircles();
    fetchInvitations();
  }, [userId, accessToken]);

  const handleAcceptInvitation = async (invitationId, circleId, receiverId) => {
    if (!accessToken || !circleId || !receiverId) {
      console.error("Circle ID, invitation ID, or receiver ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.0.114:8080/invitation/${invitationId}/${circleId}/${receiverId}/accept`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to accept invitation");
      Alert.alert("Success", "Invitation accepted!");

      fetchCircles(); // Re-fetch circles to include the newly joined circle
      setInvitations((prev) =>
        prev.filter((inv) => inv.invitationId !== invitationId)
      ); // Remove the accepted invitation from the list
    } catch (error) {
      console.error("Error accepting invitation:", error);
      Alert.alert("Error", `Failed to accept invitation: ${error.message}`);
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    const url = `http://192.168.0.114:8080/invitation/${invitationId}/decline`;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Failed to decline invitation");
      setInvitations((prev) =>
        prev.filter((inv) => inv.invitationId !== invitationId)
      );
      alert("Invitation declined successfully");
    } catch (error) {
      console.error("Error declining invitation:", error);
      alert("Failed to decline invitation");
    }
  };

  const renderItem = ({ item }) => {
    const isRegularCircle = item.circleType === "REGULAR";  // Check if circle is "REGULAR"
    
    return (
      <View style={styles.circleContainer}>
        <TouchableOpacity
          onPress={() => {
            if (isRegularCircle) {
              navigation.navigate("circleDetails", { circleId: item.circleId });
            } else {
              Alert.alert("Access Denied", "You cannot update this circle");
            }
          }}
          style={styles.circle}
        >
          <Text style={styles.circleName}>{item.circleName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInvitationItem = ({ item }) => (
    <View style={styles.invitationContainer}>
      <Text
        style={styles.invitationText}
      >{`Invitation from User ${item.senderId} to join ${item.circleName}`}</Text>
      <View style={styles.invitationButtons}>
        <TouchableOpacity
          onPress={() => handleAcceptInvitation(item.invitationId, item.circleId, userId)}
          style={styles.acceptButton}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeclineInvitation(item.invitationId)}
          style={styles.declineButton}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.notificationIcon}
      >
        <Ionicons name="notifications-outline" size={30} color="#FF" />
        {invitations.length > 0 && <View style={styles.notificationBubble} />}
      </TouchableOpacity>
      <Text style={styles.title}>Circles</Text>
      <TouchableOpacity onPress={() => navigation.navigate("circleAdd")}>
        <Ionicons name="add-circle-outline" size={30} color="#FF" />
      </TouchableOpacity>
    </View>
  );

  const regularCircles = circles.filter(circle => circle.circleType === "REGULAR");
  const eventCircles = circles.filter(circle => circle.circleType === "EVENT");

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.separator} />
      
      {/* Render Regular Circles */}
      {regularCircles.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Regular Circles</Text>
          <FlatList
            data={regularCircles}
            keyExtractor={(item) => item.circleId.toString()}
            renderItem={renderItem}
            numColumns={numColumns}
            contentContainerStyle={styles.list}
          />
          <View style={styles.separator} />
        </>
      )}

      {/* Render Event Circles */}
      {eventCircles.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Event Circles</Text>
          <FlatList
            data={eventCircles}
            keyExtractor={(item) => item.circleId.toString()}
            renderItem={renderItem}
            numColumns={numColumns}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={invitations}
              keyExtractor={(item) => String(item.invitationId)}
              renderItem={renderInvitationItem}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingBottom: 100
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
    paddingVertical: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#CD9594"
  },
  notificationIcon: {
    position: "relative"
  },
  notificationBubble: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red"
  },
  circleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "48%"
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#CD9594",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10
  },
  circleName: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center"
  },
  noCirclesText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray"
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#CD9594",
    alignSelf: "center",
    marginBottom: 20
  },
  list: {
    paddingHorizontal: 10
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#CD9594",
    marginBottom: 10,
    textAlign: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#CD9594"
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#CD9594",
    borderRadius: 10
  },
  closeButtonText: {
    color: "white",
    fontSize: 18
  },
  invitationContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10
  },
  invitationText: {
    fontSize: 16,
    marginBottom: 10
  },
  invitationButtons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5
  },
  declineButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});

export default Circle;
