import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Modal, Alert, TextInput } from 'react-native';
import localImage from '../assets/images/geenBackground.png'
import { Link } from 'expo-router';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [sosSent, setSosSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

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

  const sendLocationToFirebase = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await addDoc(collection(db, "locations"), {
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      });
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
            {/* <Image
              source={{ uri: 'https://example.com/stop-image.png' }} // Vervang door de juiste URL van de stop-afbeelding
              style={styles.buttonImage}
              resizeMode="cover"
            /> */}
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
        <View style={styles.checklistItem}>
          <View style={styles.checkbox} />
          <Text style={styles.checklistText}>Circle 1</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checkbox} />
          <Text style={styles.checklistText}>Circle 2</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checkbox} />
          <Text style={styles.checklistText}>Circle 3</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checkbox} />
          <Text style={styles.checklistText}>Circle 4</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checkbox} />
          <Text style={styles.checklistText}>Circle 5</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.checklistItem}>
          <View style={styles.checkbox} />
          <Text style={styles.checklistText}>Tomorrowland</Text>
        </View>
        <View style={styles.checklistItem}>
          <View style={styles.checkbox} />
          <Text style={styles.checklistText}>Graspop</Text>
        </View>
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
                  <View style={styles.checklistItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>Medical Emergencies</Text>
                  </View>
                  <View style={styles.checklistItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>Accidents</Text>
                  </View>
                  <View style={styles.checklistItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>Fire-Related Incidents</Text>
                  </View>
                  <View style={styles.checklistItem}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>Crimes or Safety Incidents</Text>
                  </View>
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
                <View style={styles.modalChecklist}>
                  <TouchableOpacity style={styles.checklistItem} onPress={() => setDuration('30min')}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>30min</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.checklistItem} onPress={() => setDuration('1 hour')}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>1 hour</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.checklistItem} onPress={() => setDuration('2 hours')}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>2 hours</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.checklistItem} onPress={() => setDuration('8 hours')}>
                    <View style={styles.checkbox} />
                    <Text style={styles.checklistText}>8 hours</Text>
                  </TouchableOpacity>
                </View>
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
    marginTop: 50,
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
    width: "130%", // Groter dan de knop
    height: "130%", // Groter dan de knop
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
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  subText: {
    fontSize: 20,
    marginBottom: 10,
  },
  checklist: {
    alignItems: "flex-start",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#CD9594",
    marginRight: 10,
  },
  checklistText: {
    fontSize: 16,
  },
  sendButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#CD9594",
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalChecklist: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});