import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const UpdateCircle = () => {
    const [circleName, setCircleName] = useState('');
    const [circleType, setCircleType] = useState('REGULAR'); // Added circleType state
    const [available, setAvailable] = useState(true); // Added available state
    const navigation = useNavigation();
    const route = useRoute();
    const { circleId } = route.params || {}; // Get circleId from route params

 //   const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0Iiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NjA2ODExfQ.s0iNWdJx-5c-HJ0g__CnGjG3DL8WMiuYiewRAI3YItM";
    const url = `http://192.168.129.168:8080/circle/${circleId}/update`; // Use dynamic circleId

    useEffect(() => {
        if (!circleId) {
            alert("Circle ID is missing!");
            navigation.goBack();
            return;
        }

        const fetchCircleDetails = async () => {
            try {
                const response = await fetch(`http://10.2.88.221:8080/circle/${circleId}`, {
                    method: 'GET',
                    headers: { Authorization: token },
                });

                if (!response.ok) throw new Error('Failed to fetch circle details');
                const data = await response.json();
                setCircleName(data.circleName); // Set the current circle name for the input field
                setCircleType(data.circleType); // Set the current circle type
                setAvailable(data.available); // Set the current availability status
            } catch (error) {
                console.error("Error fetching data:", error);
                alert(`Error: ${error.message}`);
            }
        };

        fetchCircleDetails();
    }, [circleId]);

    const handleUpdateCircleName = async () => {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    circleName: circleName,   // Send updated circleName
                    circleType: circleType,   // Send updated circleType
                    available: available      // Send updated available status
                }),
            });

            if (!response.ok) throw new Error('Failed to update circle name');
            alert('Circle name updated successfully');
            navigation.goBack(); // Optionally navigate back after update
        } catch (error) {
            console.error("Error updating circle name:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateCircleName}>
                    <Text style={styles.updateButtonText}>Update Circle Name</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",  // Soft background for a modern look
        marginTop: 40,
    },
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
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 30,
        color: "#333",
        textAlign: "center",
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
        elevation: 10,
    },
    settingLabel: {
        fontSize: 18,
        fontWeight: "500",
        color: "#555",
        marginBottom: 12,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
    updateButton: {
        backgroundColor: "#CD9594",  
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    updateButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "600",
    },
});

export default UpdateCircle;
