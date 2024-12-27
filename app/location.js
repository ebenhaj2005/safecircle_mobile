import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import * as Location from "expo-location";

const LocationUpdater = () => {
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
      // Vraag toestemming om locatie te gebruiken
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Toestemming voor locatie is geweigerd.");
        return;
      }

      // Haal locatie elke 3 minuten op en stuur naar backend
      intervalId = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
       const lati = location.coords.latitude;
       const longi = location.coords.longitude;
          console.log("Locatie opgehaald:", location);

          // Stuur locatie naar backend
          const response = await fetch(`http://192.168.1.61:8080/location/${userId}?latitude=${lati}&longitude=${longi}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }),
          });

          if (!response.ok) {
            console.error("Fout bij het versturen van de locatie:", response.statusText);
          }else{
            console.log(`Locatie verstuurd naar backend: ${location}`);}
        } catch (error) {
          console.error("Fout bij het ophalen of versturen van de locatie:", error);
        }
      }, 10000); // 3 minuten in milliseconden
    };

    startUpdatingLocation();

    // Opruimen van interval wanneer component wordt ontladen
    return () => clearInterval(intervalId);
  }, []);

 
};

export default LocationUpdater;
