import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const UpdateCircle = () => {
    const [circleName, setCircleName] = useState('');
    const [circleType, setCircleType] = useState('REGULAR');
    const [available, setAvailable] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const { circleId } = route.params || {};

    const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3Iiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NzM1ODE2fQ.RAk84Mi-zBLIoE_JSM24xeHIKTnpbU_gmylzQFeFQQ4";

    useEffect(() => {
        if (!circleId) {
            alert("Circle ID is missing!");
            navigation.goBack();
            return;
        }

        const fetchCircleDetails = async () => {
            try {
                const response = await fetch(`http://192.168.129.177:8080/circle/${circleId}`, {
                    method: 'GET',
                    headers: { Authorization: token },
                });

                if (!response.ok) throw new Error('Failed to fetch circle details');
                const data = await response.json();
                setCircleName(data.circleName);
                setCircleType(data.circleType);
                setAvailable(data.available);
            } catch (error) {
                console.error("Error fetching data:", error);
                alert(`Error: ${error.message}`);
            }
        };

        fetchCircleDetails();
    }, [circleId]);

    const handleUpdateCircleName = async () => {
        try {
            const response = await fetch(`http://192.168.129.177:8080/circle/${circleId}/update`, {
                method: 'PUT',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    circleName: circleName,
                    circleType: circleType,
                    available: available
                }),
            });

            if (!response.ok) throw new Error('Failed to update circle name');
            alert('Circle name updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error("Error updating circle name:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleDeleteCircle = async () => {
        try {
            const response = await fetch(`http://192.168.129.177:8080/circle/${circleId}/delete`, {
                method: 'DELETE',
                headers: { Authorization: token },
            });

            if (!response.ok) throw new Error('Failed to delete circle');
            navigation.goBack();
        } catch (error) {
            console.error("Error deleting circle:", error);
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
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        Alert.alert(
                            'Delete Circle',
                            'Are you sure you want to delete this circle?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: handleDeleteCircle }
                            ]
                        );
                    }}
                >
                    <Text style={styles.deleteButtonText}>Delete Circle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
        marginTop: 40,
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
    deleteButton: {
        backgroundColor: "#ff4d4f",
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    deleteButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "600",
    },
});

export default UpdateCircle;
