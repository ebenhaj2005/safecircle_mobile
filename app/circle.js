import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal, Alert, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Zorg ervoor dat je 'expo/vector-icons' hebt geïnstalleerd

const circlesData = [
  { id: "1", name: "Circle 1" },
  { id: "2", name: "Circle 2" },
  { id: "3", name: "Circle 3" },
  { id: "4", name: "Circle 4" },
  { id: "5", name: "Circle 5" },
  // Voeg meer cirkels toe indien nodig
];

const eventsData = [
  { id: "1", name: "Gras Pop" },
  { id: "2", name: "Rock Werchter" },
  // Voeg meer events toe indien nodig
];

const invitationsData = [
  { id: "1", name: "Invitation 1" },
  { id: "2", name: "Invitation 2" },
  // Voeg meer uitnodigingen toe indien nodig
];

const CircleCard = ({ name }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  return (
    <Animated.View style={[styles.circle, { transform: [{ translateY }] }]}>
      <Text style={styles.circleText}>{name}</Text>
    </Animated.View>
  );
};

const EventCard = ({ name }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  return (
    <Animated.View style={[styles.eventCircle, { transform: [{ translateY }] }]}>
      <Text style={styles.eventCircleText}>{name}</Text>
    </Animated.View>
  );
};

const InvitationCard = ({ name, canAccept }) => (
  <View style={styles.invitationCard}>
    <Text style={styles.invitationText}>{name}</Text>
    <View style={styles.invitationButtons}>
      <TouchableOpacity
        onPress={() => {
          if (!canAccept) {
            Alert.alert("Max Circles Reached", "You have reached the maximum number of circles.");
          } else {
            // Voeg hier de logica toe om de uitnodiging te accepteren
            Alert.alert("Invitation Accepted", `You have accepted the invitation to join ${name}.`);
          }
        }}
      >
        <Ionicons name="checkmark-circle-outline" size={40} color={canAccept ? "green" : "green"} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="close-circle-outline" size={40} color="red" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function Circle() {
  const [modalVisible, setModalVisible] = useState(false);
  const numColumns = 2;
  const maxCircles = 5;
  const displayedCirclesData = circlesData.slice(0, maxCircles); // Zorg ervoor dat er maximaal 5 cirkels worden weergegeven
  const canAcceptMoreCircles = displayedCirclesData.length < maxCircles;

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="notifications-outline" size={30} color="#CD9594" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={30} color="#CD9594" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Circles</Text>
      <View style={styles.separator} />
    </>
  );

  const renderFooter = () => (
    <>
      <View style={styles.separator} />
      <Text style={styles.title}>Events</Text>
      <View style={styles.separator} />
      <FlatList
        data={eventsData}
        renderItem={({ item }) => <EventCard name={item.name} />}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={`${numColumns}-events`} // Different key to force re-render
        contentContainerStyle={styles.list}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedCirclesData}
        renderItem={({ item }) => <CircleCard name={item.name} />}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns} 
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invitations</Text>
            <FlatList
              data={invitationsData}
              renderItem={({ item }) => <InvitationCard name={item.name} canAccept={canAcceptMoreCircles} />}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#000",
    alignSelf: "center",
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#CD9594",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    margin: 10,
  },
  circleText: {
    color: "#fff",
    fontSize: 24,
  },
  eventCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#B77E7D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    margin: 10,
  },
  eventCircleText: {
    color: "#fff",
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  invitationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: "100%",
  },
  invitationText: {
    fontSize: 18,
  },
  invitationButtons: {
    flexDirection: "row",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#CD9594",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});