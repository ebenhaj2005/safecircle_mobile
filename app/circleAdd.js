import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const CircleAdd = () => {
    const [circleName, setCircleName] = useState('');
    const [circles, setCircles] = useState([]);
    const [personName, setPersonName] = useState('');
    const [selectedCircleId, setSelectedCircleId] = useState(null);

    useEffect(() => {
        // Fetch circles from the database when the component mounts
        const fetchCircles = async () => {
            try {
                const response = await fetch('https://your-api-endpoint.com/circles');
                const data = await response.json();
                setCircles(data);
            } catch (error) {
                console.error('Error fetching circles:', error);
            }
        };

        fetchCircles();
    }, []);

    const addCircle = async () => {
        if (circleName.trim()) {
            const newCircle = { id: Date.now().toString(), name: circleName, people: [] };
            
            // Send the new circle to the backend
            try {
                const response = await fetch('https://your-api-endpoint.com/circles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCircle),
                });

                if (response.ok) {
                    const savedCircle = await response.json();
                    setCircles([...circles, savedCircle]);
                    setCircleName('');
                } else {
                    console.error('Failed to save the circle');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const deleteCircle = async (id) => {
        try {
            const response = await fetch(`https://your-api-endpoint.com/circle/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCircles(circles.filter(circle => circle.id !== id));
            } else {
                console.error('Failed to delete the circle');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addPersonToCircle = () => {
        if (personName.trim() && selectedCircleId) {
            setCircles(circles.map(circle => 
                circle.id === selectedCircleId 
                ? { ...circle, people: [...circle.people, personName] } 
                : circle
            ));
            setPersonName('');
        }
    };

    const deletePersonFromCircle = (circleId, personName) => {
        setCircles(circles.map(circle => 
            circle.id === circleId 
            ? { ...circle, people: circle.people.filter(person => person !== personName) } 
            : circle
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add and Delete Circles</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter circle name"
                value={circleName}
                onChangeText={setCircleName}
            />
            <Button title="Add Circle" onPress={addCircle} />
            <FlatList
                data={circles}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.circleContainer}>
                        <Text style={styles.circleName}>{item.name}</Text>
                        <Button title="Delete Circle" onPress={() => deleteCircle(item.id)} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter person name"
                            value={personName}
                            onChangeText={setPersonName}
                        />
                        <Button title="Add Person" onPress={() => { setSelectedCircleId(item.id); addPersonToCircle(); }} />
                        <FlatList
                            data={item.people}
                            keyExtractor={(person, index) => index.toString()}
                            renderItem={({ item: person }) => (
                                <View style={styles.personContainer}>
                                    <Text>{person}</Text>
                                    <TouchableOpacity onPress={() => deletePersonFromCircle(item.id, person)}>
                                        <Text style={styles.deletePerson}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    circleContainer: {
        marginBottom: 20,
    },
    circleName: {
        fontSize: 18,
        marginBottom: 10,
    },
    personContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    deletePerson: {
        color: 'red',
    },
});

export default CircleAdd;