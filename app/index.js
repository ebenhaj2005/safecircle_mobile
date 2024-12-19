import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Button, Modal, Alert, TextInput } from 'react-native';
import localImage from '../assets/images/geenBackground.png';
import { Link } from 'expo-router';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [sosSent, setSosSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({}); // For select boxes
  const [pushToken, setPushToken] = useState(null);
  const [originalPushToken, setOriginalPushToken] = useState(null);

  const userId = 4; 
  
  
  useEffect(() => {
    const getPushToken = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
  
        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== 'granted') {
            Alert.alert('Push-notificatie-permissie geweigerd');
            return;
          }
        }
  
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: "e6eaafe3-e57c-499b-9782-d0e460a3f22e",
        });
        console.log('Push Token:', token.data);
  
        
        const extractedToken = token.data.replace('ExponentPushToken[', '').replace(']', '');
        //console.log('Extracted Token:', extractedToken); 
  
        setPushToken(extractedToken); 
        setOriginalPushToken(token.data); 
  
        // to backend
        const response = await fetch(`http://10.2.88.103:8080/user/3/register-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fcmToken: extractedToken }),  // extracted token
        });
  
        if (response.ok) {
          console.log('Push token registered');
        } else {
          console.error('Failed to register push token:', response.status);
        }
      } catch (err) {
        console.error('Error getting push token:', err.message);
      }
    };
  
    getPushToken();
  }, []);
  
  

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


  useEffect(() => {
    let locationInterval;
    if (sosSent) {
      locationInterval = setInterval(() => {
        sendLocationToFirebase();
      }, 60000); // Elke 60 seconden
    }

    return () => clearInterval(locationInterval);
  }, [sosSent]);


  const sendPushNotification = async () => {
    if (!pushToken) {
      console.error('No push token available.');
      return;
    }

    try {
      console.log('Sending push notification...');

      const message = {
        to: originalPushToken,  // Use the pushToken stored in the state
        sound: 'default',
        title: 'SOS Alert',
        body: 'SOS alert sent, press stop to stop it.',
        data: { extraData: 'extra data', userId: userId },
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        console.log('Notification sent successfully!');
      } else {
        console.error('Failed to send notification:', response.status);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };
  
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
    Alert.alert("SOS verzonden!");
    setSosSent(true);
    sendPushNotification();  // Send the push notification
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#CD9594",
  },
  checkboxMark: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
marginBottom: 20,
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
