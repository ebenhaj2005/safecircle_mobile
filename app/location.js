import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied.");
        return;
      }

      intervalId = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

   

          const response = await fetch(
            `http://192.168.1.61:8080/user/${userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                userLocation: {
                  latitude,
                  longitude,
                },
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            /* console.error(
              "Error sending location to backend:",
              response.statusText,
              errorText
            ); */
          } else {
            console.log(
              `Location sent to backend: latitude=${latitude}, longitude=${longitude}`
            );
          }
        } catch (error) {
          console.error("Error retrieving or sending location:", error);
        }
      }, 180000); // Update every 3 minutes
    };

    startUpdatingLocation();

    // Cleanup the interval when the component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userId, accessToken]);

  if (errorMsg) {
    return (
      <View>
        <Text>{errorMsg}</Text>
      </View>
    );
  }


};

export default LocationUpdater;
