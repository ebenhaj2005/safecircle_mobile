import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; 
import { Linking } from "react-native";
import * as SecureStore from 'expo-secure-store'; // Make sure to import SecureStore

export default function Home() {
  const [location, setLocation] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userId, setUserId] = useState(null);
  const [alerts, setAlerts] = useState([]); // State to hold alerts

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

  const mapRef = useRef(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 120000, 
        distanceInterval: 0,  
      },
      (newLocation) => {
        setLocation(newLocation.coords);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch("http://192.168.1.61:8080/alert/latest/sos", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setAlerts(data); // Save the alerts array to state
      } 
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };
 
  useEffect(() => {
    fetchAlerts(); // Fetch alerts when the component mounts

    const interval = setInterval(fetchAlerts, 10000); // Fetch every 5 minutes
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [accessToken]);

  const moveToUserLocation = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0050, 
          longitudeDelta: 0.0050, 
        },
        2000 
      );
    }
  };

  const handleAlertMarkerPress = (latitude, longitude) => {
    Alert.alert(
      "Navigate?",
      "Do you want to open this location in Google Maps?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Go", onPress: () => Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`) },
      ]
    );
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Find Your Friends</Text>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0020,
          longitudeDelta: 0.0020,
        }}
      >
        <Marker style={styles.marker}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          pinColor="blue"
          onPress={() => handleAlertMarkerPress(location.latitude, location.longitude)}
        />

        {alerts.map((alert, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: alert.location.latitude,
              longitude: alert.location.longitude,
            }}
            title={`${alert.firstName} has sent an sos`}
            description={alert.description}
            pinColor={alert.status === "UNSAFE" ? "yellow" : "red"} // Differentiate markers by status
            onPress={() => handleAlertMarkerPress(alert.location.latitude, alert.location.longitude)}
          />
        ))}
      </MapView>

      <Button
        title="My Location"
        color="#CD9594"
        onPress={moveToUserLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 0,
    marginBottom: 40,
  },
  text: {
    marginBottom: 30,
    color: "#CD9594",
    fontSize: 30,
    fontWeight: "bold",
  },
  map: {
    width: "90%",
    height: "65%",
    borderRadius: 20,
    marginBottom: 30,
  },
 
});
