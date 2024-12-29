import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image,Button, Modal, Alert, TextInput, FlatList, ScrollView } from 'react-native';
import localImage from '../assets/images/geenBackground.png';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { PermissionsAndroid, Platform } from 'react-native';


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
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [circles, setCircles] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sosMode, setSosMode] = useState(false); 
  const [locationInterval, setLocationInterval] = useState(180000);
 
  
  


  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");

        if (storedUserId && storedAccessToken) {
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
          
        } else {
          Alert.alert("Error", "Authentication details not found");
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
      }
    };

    fetchAuthData();
  }, []);
  


  
  useEffect(() => {
    let intervalId;

    const startUpdatingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Toestemming voor locatie is geweigerd.");
        return;
      }

      if (intervalId) clearInterval(intervalId);

      intervalId = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          let lati = location.coords.latitude;
          let longi = location.coords.longitude;
          console.log("Locatie opgehaald:", location);
       

          const response = await fetch(
            `http://192.168.0.114:8080/user/location/${userId}?latitude=${lati}&longitude=${longi}`,
         
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                latitude: lati,
                longitude: longi,
              }),
            }
          );

          if (!response.ok) {
            console.error("Fout bij het versturen van de locatie:", response.statusText);
          } else {
            console.log(`Locatie verstuurd naar backend: ${location}`);
          }
        } catch (error) {
          console.error("Fout bij het ophalen of versturen van de locatie:", error);
        }
      }, locationInterval);
    };

    startUpdatingLocation();

    return () => clearInterval(intervalId);
  }, [locationInterval, userId, accessToken]);

  const toggleSosMode = () => {
    setSosMode((prev) => !prev);
    setLocationInterval((prev) => (prev === 10000 ? 1000 : 10000)); // Toggle between 3 minutes and 30 seconds
  };
  
  useEffect(() => {
    const fetchCircles = async () => {
      if (!userId || !accessToken) return;
  
      try {
        const response = await fetch(`http://192.168.0.114:8080/circle/getAll/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const data = await response.json();

        console.log("Circles:", data);
  
        // Check for undefined id and clean data
        const cleanedData = data.map((item) => ({
          ...item,
          id: item.id || Math.random().toString(), // Ensure every item has a valid id
        }));
  
        setCircles(cleanedData);
      } catch (error) {
        console.error("Error fetching circles:", error);
      }
    };
  
    fetchCircles();
  }, [userId, accessToken]);
  
  


 

  

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('Location permission status:', status); // Toevoegen van een log
    if (status !== 'granted') {
      Alert.alert('Location permission denied', 'We need your location permission to send an SOS.');
      return false; // Teruggeven van false als de permissie niet is verleend
    }
    return true;
  };
  

  
  
  // userId && acces
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");

        if (storedUserId && storedAccessToken) {
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
        } else {
          Alert.alert("Error", "Authentication details not found");
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
      }
    };

    fetchAuthData();
  }, []);
  
  //Push token
  useEffect(() => {
    const getPushToken = async () => {
      if (!userId) return; // Wacht totdat userId beschikbaar is
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
          projectId: Constants.expoConfig.extra.projectId,
        });
        console.log('Push Token:', token.data);
  
        const extractedToken = token.data.replace('ExponentPushToken[', '').replace(']', '');
        setPushToken(extractedToken); 
        setOriginalPushToken(token.data); 
  

        
        const response = await fetch(`http://192.168.0.114:8080/user/${userId}/register-token`, {
          method: 'POST',
          headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
          
          body: JSON.stringify({ fcmToken: token.data }),
        });
  
        if (response.ok) {
          console.log('Push token registered');
        } else {
          console.log('Failed to register push token:', response.status);
          console.error('Failed to register push token:', response.status);
        }
      } catch (err) {
        console.error('Error getting push token:', err.message);
      }
    };
  
    getPushToken();
  }, [userId]); // Toevoegen aan dependencies-array
  
  const getLocation = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied. Please enable location services.");
        return null;
      }
  
      // Get current location
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  
      // Check if location was retrieved properly
      if (!location || !location.coords) {
        console.log('Error: Location data is missing');
        Alert.alert('Error', 'Could not retrieve location.');
        return null;
      }
  
      const { latitude, longitude } = location.coords;
      console.log('Location:', latitude, longitude);
  
      return { latitude, longitude }; // Return the coordinates as an object
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not retrieve location.');
      return null;
    }
  };
  
  
  
  //timer

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

  //location

  useEffect(() => {
    let locationInterval;
    if (sosSent) {
      locationInterval = setInterval(() => {
        //sendLocationToFirebase();
      }, 60000); // Elke 60 seconden
    }

    return () => clearInterval(locationInterval);
  }, [sosSent]);

  


  // send notification

/*   const sendPushNotification = async () => {
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
        badge: 1,  // app logo
        priority: 'high',  
        channelId: 'default',  // channels voor Android
        //_displayInForeground: true, more like an alert
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
 */
  //sos
  
  const handleSendSOS = async () => {
    console.log('handleSendSOS function called');
    
    // Retrieve description from selected checkboxes
    const description = Object.keys(selectedCheckboxes)
      .filter(key => selectedCheckboxes[key])  // Only include checked boxes
      .join(', ');  // Join them as a comma-separated string

    // If no description is selected, show an alert
    if (!description) {
      Alert.alert('Error', 'Selecteer een beschrijving voor de SOS!');
      return;
    }

    // Request location permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    // Get current location
    const location = await getLocation();
    if (!location) {
      Alert.alert('Error', 'Could not retrieve location.');
      return;
    }

    console.log('Sending SOS alert...');

    // Construct the SOS data object
    const sosData = {
      status: 'SOS',
      description,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      //userId: userId,  // The user's ID
    };

    console.log('SOS Data to send:', JSON.stringify(sosData));

    // Send the SOS data to the server
    fetch(`http://192.168.0.114:8080/alert/${userId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(sosData),
    })
      .then(response => response.text())  // Gebruik .text() in plaats van .json()
      .then(data => {
        /* console.log('Raw response from server:', data); */
        Alert.alert("Server response", data); 
        //sendPushNotification();
        setSosSent(true);
        setModalVisible(false);
      })
      .catch(error => {
        console.error('Error sending SOS alert:', error);
        Alert.alert('Error', 'Failed to send SOS alert.');
      });
    
    }    


    //SOS stop

    const handleStopSOS = async () => {
      // Reset the SOS state
      setSosSent(false);
      setTimer(0);
    
      try {
        const response = await fetch(`http://192.168.0.114:8080/alert/${userId}/stop`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
    
        if (response.ok) {
          console.log('SOS stopped successfully.');
        } else {
          console.error('Failed to stop SOS:', response.status);
          Alert.alert('Error', 'Failed to stop SOS alert.');
        }
      } catch (error) {
        console.error('Error stopping SOS:', error);
        Alert.alert('Error', 'An unexpected error occurred while stopping SOS.');
      }
    };
    

  /* // receive notification
  useEffect(() => {
/*     const setupNotifications = async () => {
      // Configureer notificatiekanalen voor Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };
  
    setupNotifications();
  
    // Luister naar inkomende meldingen
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped', response);
      Alert.alert('You tapped the notification!');
    });
   
    return () => responseListener.remove();
  }, []); // Alleen één keer uitvoeren
  

  useEffect(() => {
    
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        //console.log('Notification received in foreground', notification);
        return {
          shouldShowAlert: false, 
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });
  
    // Luister naar inkomende meldingen
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped', response);
      Alert.alert('You tapped the notification!');
    });
  
    return () => responseListener.remove();
  }, []);


  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped', response);
  
      // Wanneer de gebruiker op de notificatie klikt, kun je bepaalde acties uitvoeren.
      Alert.alert('You tapped the notification!');
    });
  
    return () => responseListener.remove();
  }, []);


   */
  
  
  
  //checkbox
  const toggleCheckbox = (circleId) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [circleId]: !prev[circleId], // Toggle de checkbox voor de geselecteerde circleId
    }));
  };


  //handle emergency 
  const handleEmergencyPress = () => {
    setModalContent('emergency');
    setModalVisible(true);
  };

  //handle send press
  const handleSendPress = () => {
    setModalContent('send');
    setModalVisible(true);
  
    // Haal de geselecteerde circleIds op uit selectedCheckboxes
    const selectedCircleIds = Object.keys(selectedCheckboxes).filter(
      (key) => selectedCheckboxes[key] // Alleen de geselecteerde checkboxes
    );
  
    console.log("Selected CircleIds:", selectedCircleIds); // Log de geselecteerde circleIds
  
    // Hier kun je de selectedCircleIds doorsturen naar een server of een andere functie
  };
  
  
    
  



 
  //send feeling
  const handleSendFeeling = async () => {
    try {
      // Controleer of een beschrijving is ingevuld
      if (!description) {
        Alert.alert('Error', 'Please provide a description.');
        return;
      }
      setModalVisible(false);

      // Haal de geselecteerde circleIds op
      const selectedCircleIds = Object.keys(selectedCheckboxes).filter(
        (key) => selectedCheckboxes[key] // Alleen geselecteerde checkboxes
      );

      if (selectedCircleIds.length === 0) {
        Alert.alert('Error', 'Please select at least one circle.');
        return;
      }

      // Zet de duur in het juiste formaat (bijv. PT30M voor 30 minuten)
      let formattedDuration = 'PT30M'; // Standaard duur is 30 minuten
      if (duration === '30min') {
        formattedDuration = 'PT30M';
      } else if (duration === '1 hour') {
        formattedDuration = 'PT1H';
      } else if (duration === '2 hours') {
        formattedDuration = 'PT2H';
      } else if (duration === '8 hours') {
        formattedDuration = 'PT8H';
      }

      // Haal locatiegegevens op (je moet de `getLocation` functie implementeren)
      const location = { latitude: 50.96099997216114, longitude: 4.372219992158251 }; // Voorbeeldlocatie

      // Maak het "unsafe" data object
      const unsafeData = {
        status: 'UNSAFE',
        description,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        duration: formattedDuration, // De geselecteerde duur
        circles: selectedCircleIds.map((id) => parseInt(id)), // De geselecteerde circleIds
      };

      console.log('UNSAFE Data to send:', JSON.stringify(unsafeData));

      // Verstuur naar de backend
      const response = await fetch(`http://192.168.0.114:8080/alert/${userId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(unsafeData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your unsafe alert has been sent.');
      } else {
        const errorText = await response.text();
        console.error('Error sending UNSAFE alert:', errorText);
        Alert.alert('Error', 'Failed to send UNSAFE alert.');
      }
    } catch (error) {
      console.error('Error sending UNSAFE alert:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };
  



  return (
    
    <View style={styles.container}>
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
          <TouchableOpacity style={styles.button} onPress={() => { handleEmergencyPress(); toggleSosMode(); }}>
            <Image
              source={localImage}
              style={styles.buttonImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </>
        
      )}
     

      
     <View style={styles.container}>
        <View style={styles.separator} />
      
        <Text style={styles.subText}>Feeling Unsafe</Text>

        <View style={styles.checklist}>
                      {circles.map((item) => (
                        <TouchableOpacity
                          key={item.circleId}
                          style={styles.checklistItem}
                          onPress={() => toggleCheckbox(item.circleId)}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              selectedCheckboxes[item.circleId] && styles.checkboxSelected,
                            ]}
                          >
                            {selectedCheckboxes[item.circleId] && (
                              <Text style={styles.checkboxMark}>✔</Text>
                            )}
                          </View>
                          <Text style={styles.checklistText}>{item.circleName}</Text>
                        </TouchableOpacity>
                      ))}
        </View>


        
    </View>

    
    <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 100, }}>
          <TouchableOpacity style={styles.sendButton} onPress={() => { handleSendPress(); }}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

      

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
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 70,

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
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#CD9594",
    borderRadius: 5,
    marginBottom: 20,
  /*   borderWidth: 2,
    borderColor: "blue", */
    //position: 'absolute',
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
