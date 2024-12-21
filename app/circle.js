import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from "expo-secure-store";

const Circle = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [circles, setCircles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const numColumns = 2;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        console.log("Stored User ID: ", storedUserId);
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
        console.error("User ID or Access Token is missing");
        return;
      }

      const url = `http://192.168.0.110:8080/circle/getAll/${userId}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
        const data = await response.json();
        setCircles(data);
      } catch (error) {
        console.error("Error fetching circles data:", error);
      }
    };

    fetchCircles();
  }, [userId, accessToken]); // Fetch circles when userId or accessToken changes

    const renderItem = ({ item }) => (
        <View style={styles.circleContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('circleDetails', { circleId: item.circleId })}
                style={styles.circle}>
                <Text style={styles.circleName}>{item.circleName}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="notifications-outline" size={30} color="#FF" />
            </TouchableOpacity>
            <Text style={styles.title}>Circles</Text>
            <TouchableOpacity onPress={() => navigation.navigate('circleAdd')}>
                <Ionicons name="add-circle-outline" size={30} color="#FF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <View style={styles.separator} />
            {circles.length === 0 ? (
                <Text style={styles.noCirclesText}>No circles available</Text>
            ) : (
                <FlatList
                    data={circles}
                    keyExtractor={(item) => item.id ? String(item.id) : Math.random().toString()}
                    renderItem={renderItem}
                    numColumns={numColumns}
                    contentContainerStyle={styles.list}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notifications</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
        paddingBottom: 100,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f9f9f9",
        paddingVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#CD9594",
    },
    circleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        width: '48%',
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
        elevation: 10,
    },
    circleName: {
        fontSize: 20,
        color: "#fff",
        textAlign: "center",
    },
    noCirclesText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'gray',
    },
    separator: {
        height: 1,
        width: "80%",
        backgroundColor: "#CD9594",
        alignSelf: "center",
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 10,
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
        color: "#CD9594",
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

export default Circle;
