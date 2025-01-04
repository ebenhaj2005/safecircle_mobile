import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Linking } from "react-native";
import * as SecureStore from "expo-secure-store";
import LocationUpdater from "./location";
import { format } from "date-fns"; // Importing date-fns for date formatting

export default function Home() {
  const [location, setLocation] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const mapRef = useRef(null);

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

  const fetchAlerts = async (circleId) => {
    try {
      const response = await fetch(`http://192.168.1.61:8080/alert/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      } else {
        console.error("Failed to fetch alerts:", response.status);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAlerts(userId);

      const interval = setInterval(() => {
        fetchAlerts(userId);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [accessToken, userId]);

  const moveToUserLocation = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
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
      <LocationUpdater />
      <View style={styles.markerDefinitions}>
        <Text style={styles.markerDefinitionText}>Marker Color Legend:</Text>
        <Text style={styles.markerDefinitionText}>🔵 Blue: Your Current Location</Text>
        <Text style={styles.markerDefinitionText}>🔴 Red: Active SOS Alert</Text>
        <Text style={styles.markerDefinitionText}>🟢 Green: Stopped SOS Alert</Text>
        <Text style={styles.markerDefinitionText}>🟡 Yellow: Unsafe Alert</Text>
      </View>
      <Text style={styles.text}>Alert Map</Text>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        {/* User's Current Location Marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          pinColor="blue"
          description="This is your current location"
        />

        {/* Alerts Markers */}
        {alerts.map((alert, index) => {
          if (alert.status === "SOS") {
            return alert.active ? (
              // Active SOS: Red Marker (User Location)
              <Marker
                key={`green-${index}`}
                coordinate={{
                  latitude: alert.userLocation.latitude,
                  longitude: alert.userLocation.longitude,
                }}
                title={`${alert.firstName} has sent an SOS`}
                description={alert.description}
                pinColor="green"
              />
            ) : (
              // Stopped SOS: Green Marker (Static Location)
              <Marker
                key={`red-${index}`}
                coordinate={{
                  latitude: alert.location.latitude,
                  longitude: alert.location.longitude,
                }}
                title={`${alert.firstName} has sent an SOS alert `}
                description={alert.description + " (Stopped)"} 


                pinColor="red"
              />
            );
          }

          if (alert.status === "UNSAFE") {
  
            return (
              <Marker
                key={`yellow-${index}`}
                coordinate={{
                  latitude: alert.location.latitude,
                  longitude: alert.location.longitude,
                }}
                title={`${alert.firstName} is unsafe`}
                description={alert.description}
                pinColor="yellow"
              />
            );
          }

          return null;
        })}
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
  markerDefinitions: {
    position: "absolute",
    top: 150,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    zIndex: 1000,
  },
  markerDefinitionText: {
    fontSize: 16,
    color: "#000",
  },
});
