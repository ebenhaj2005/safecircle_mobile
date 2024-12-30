import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";

const LocationUpdater = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");

        if (storedUserId && storedAccessToken) {
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
        } else {
          console.error("Authentication details not found");
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
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Toestemming voor locatie is geweigerd.");
        return;
      }

      // Fetch location every 3 minutes and send to the backend
      intervalId = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const lati = location.coords.latitude;
          const longi = location.coords.longitude;
          console.log("Locatie opgehaald:", location);

          // Send location to the backend
          const response = await fetch(
            `http://192.168.129.177:8080/user/location/${userId}?latitude=${lati}&longitude=${longi}`,
            {
              method: 'PUT',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "Fout bij het versturen van de locatie:",
              response.statusText
            );
          } else {
            console.log(`Locatie verstuurd naar backend: latitude=${lati}, longitude=${longi}`);
          }
        } catch (error) {
          console.error(
            "Fout bij het ophalen of versturen van de locatie:",
            error
          );
        }
      }, 180000); // 3 minutes in milliseconds
    };

    startUpdatingLocation();
  });
};

export default LocationUpdater;
