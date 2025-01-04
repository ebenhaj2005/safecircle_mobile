import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location"; 
import { Linking } from "react-native";
import * as SecureStore from 'expo-secure-store';
import LocationUpdater from './location';

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
        const filteredAlerts = data
          .filter(alert => alert.active) // Only active alerts
          .filter(alert => {
            const alertTime = new Date(alert.createdAt).getTime();
            const currentTime = new Date().getTime();
            return (currentTime - alertTime) <= 24 * 60 * 60 * 1000; // Keep alerts within the last 24 hours
          });

        setAlerts(filteredAlerts);
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
    <View style={styles.container}> <LocationUpdater />
     <View style={styles.markerDefinitions}>
        <Text style={styles.markerDefinitionText}>Marker Color Legend:</Text>
        <Text style={styles.markerDefinitionText}>🔵 Blue: Your Current Location</Text>
        <Text style={styles.markerDefinitionText}>🟡 Yellow: User Location</Text>
        <Text style={styles.markerDefinitionText}>🔴 Red: SOS Alert Location</Text>
        <Text style={styles.markerDefinitionText}>🟠 Orange: Unsafe Alert Location</Text>
      </View>
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
        {/* User's Current Location Marker (Blue Marker) */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          pinColor="blue"
          description={alerts.length > 0 && alerts[0].status === "SOS" ? alerts[0].description : ""}
          onPress={() => handleAlertMarkerPress(location.latitude, location.longitude)}
        />

        {/* Static SOS Markers (Red Markers) */}
        {alerts.map((alert, index) => {
          if (alert.status === "SOS") {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: alert.location.latitude,
                  longitude: alert.location.longitude,
                }}
                title={`${alert.firstName} has sent an SOS`}
                description={alert.description}
                pinColor="red"
                onPress={() => handleAlertMarkerPress(alert.location.latitude, alert.location.longitude)}
              />
            );
          }
          return null;
        })}

        {/* Static UNSAFE Markers (Yellow Markers) */}
        {alerts.map((alert, index) => {
          if (alert.status === "UNSAFE") {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: alert.location.latitude,
                  longitude: alert.location.longitude,
                }}
                title={`${alert.firstName} is in an unsafe situation`}
                description={alert.description}
                pinColor="yellow"
                onPress={() => handleAlertMarkerPress(alert.location.latitude, alert.location.longitude)}
              />
            );
          }
          return null;
        })}

        {/* User's Current Location Marker for Alerts (Orange Marker) */}
        {alerts.map((alert, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: alert.userLocation.latitude,
                longitude: alert.userLocation.longitude,
              }}
              title={`${alert.firstName}'s Current Location`}
              pinColor="orange"
              description={alert.description}
              onPress={() => handleAlertMarkerPress(alert.userLocation.latitude, alert.userLocation.longitude)}
            />
          );
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
