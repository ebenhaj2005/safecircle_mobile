import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Modal, Alert, TextInput } from 'react-native';
import localImage from '../assets/images/geenBackground.png';
import * as Location from 'expo-location';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [sosSent, setSosSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({}); // For select boxes
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0Iiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTM2MzExfQ.LW7SNfbFOIxId1mkFLWfKDrE4yTTaT0S-bHKr4y3t2w";
  const url = `http://10.2.88.221:8080/location/{userId}`;

  useEffect(() => {
    let interval;
    if (sosSent) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      setIntervalId(interval);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    return () => clearInterval(interval);
  }, [sosSent]);

  const sendLocationToBackend = async (latitude, longitude) => {
    const userId = 4; // The userId should be dynamically set, possibly from logged-in user data
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0Iiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NTM2MzExfQ.LW7SNfbFOIxId1mkFLWfKDrE4yTTaT0S-bHKr4y3t2w"; // tijdelijk jwt token voor testen

    try {
      const response = await fetch(`http://10.2.88.221:8080/location/${userId}?latitude=${latitude}&longitude=${longitude}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Location updated successfully');
      } else {
        console.error('Error updating location', response.statusText);
        Alert.alert('Failed to update location');
      }
    } catch (error) {
      console.error('Error sending location to backend', error);
      Alert.alert('Error updating location');
    }
  };

  const sendLocationToFirebase = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Send the location to Firebase (as you already do)
      await addDoc(collection(db, "locations"), {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });

      // Send the location to the backend as well
      sendLocationToBackend(latitude, longitude);
    } catch (error) {
      console.error("Error sending location: ", error);
    }
  };

  useEffect(() => {
    let locationInterval;
    if (sosSent) {
      locationInterval = setInterval(() => {
        sendLocationToFirebase();
      }, 60000); // Elke 60 seconden
    }

    return () => clearInterval(locationInterval);
  }, [sosSent]);

  const toggleCheckbox = (key) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle between true and false
    }));
  };

  const handleEmergencyPress = () => {
    setModalContent('emergency');
    setModalVisible(true);
  };

  const handleSendPress = () => {
    setModalContent('send');
    setModalVisible(true);
  };

  const handleSendSOS = () => {
    Alert.alert("SOS sent!");
    setSosSent(true);
    sendLocationToFirebase(); // Directe eerste locatie-update
    setModalVisible(false);
  };

  const handleStopSOS = () => {
    setSosSent(false);
    setTimer(0);
  };

  const handleSendFeeling = () => {
    Alert.alert(`Description: ${description}\nDuration: ${duration}`);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sosSent ? (
        <>
          <Text style={styles.timerText}>Timer: {timer}s</Text>
          <TouchableOpacity style={styles.button} onPress={handleStopSOS}>
            <Text style={styles.stopText}>STOP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>Push for Emergency</Text>
          <TouchableOpacity style={styles.button} onPress={handleEmergencyPress}>
            <Image
              source={localImage}
              style={styles.buttonImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </>
      )}
      <View style={styles.separator} />
      <Text style={styles.subText}>Feeling Unsafe</Text>
      <View style={styles.checklist}>
        {["Circle 1", "Circle 2", "Circle 3", "Circle 4", "Circle 5", "Tomorrowland", "Graspop"].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.checklistItem}
            onPress={() => toggleCheckbox(item)}
          >
            <View style={[styles.checkbox, selectedCheckboxes[item] && styles.checkboxSelected]}>
              {selectedCheckboxes[item] && <Text style={styles.checkboxMark}>✔</Text>}
            </View>
            <Text style={styles.checklistText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={handleSendPress}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {modalContent === 'emergency' && (
              <>
                <Text style={styles.modalText}>Select the best matching description:</Text>
                <View style={styles.modalChecklist}>
                  {["Medical Emergencies", "Accidents", "Fire-Related Incidents", "Crimes or Safety Incidents"].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.checklistItem}
                      onPress={() => toggleCheckbox(item)}
                    >
                      <View style={[styles.checkbox, selectedCheckboxes[item] && styles.checkboxSelected]}>
                        {selectedCheckboxes[item] && <Text style={styles.checkboxMark}>✔</Text>}
                      </View>
                      <Text style={styles.checklistText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.modalButtonContainer}>
                  <Button
                    title="Close"
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                  <Button
                    title="Send SOS"
                    onPress={handleSendSOS}
                    color="red"
                  />
                </View>
              </>
            )}
            {modalContent === 'send' && (
              <>
                <Text style={styles.modalText}>Give a short description: </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your description here"
                  value={description}
                  onChangeText={setDescription}
                />
                <Text style={styles.modalText}>Select the duration of the unsafe feeling:</Text>
                {["30min", "1 hour", "2 hours", "8 hours"].map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.checklistItem}
                    onPress={() => setDuration(time)}
                  >
                    <View style={[styles.checkbox, duration === time && styles.checkboxSelected]}>
                      {duration === time && <Text style={styles.checkboxMark}>✔</Text>}
                    </View>
                    <Text style={styles.checklistText}>{time}</Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.modalButtonContainer}>
                  <Button
                    title="Close"
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                  <Button
                    title="Send"
                    onPress={handleSendFeeling}
                    color="red"
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    marginTop: 10,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#CD9594",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    overflow: "hidden",
  },
  buttonImage: {
    width: "130%",
    height: "130%",
    top: "3%",
  },
  stopText: {
    position: 'absolute',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  separator: {
    width: "80%",
    height: 2,
    backgroundColor: "#DDDDDD",
    marginBottom: 20,
  },
  subText: {
    fontSize: 20,
    marginBottom: 20,
  },
  checklist: {
    marginBottom: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 3,
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#000',
  },
  checkboxMark: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  checklistText: {
    fontSize: 18,
  },
  sendButton: {
    backgroundColor: '#CD9594',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sendButtonText: {
    fontSize: 18,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalChecklist: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
