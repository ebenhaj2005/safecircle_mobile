import React, { useEffect } from "react";
import { Alert } from "react-native";

import { requestPermission, getFcmToken, setupNotificationListeners } from "./firebaseSetup";

export default function App() {

  
  useEffect(() => {
    async function setupFirebase() {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        const token = await getFcmToken();
        console.log("Device FCM Token:", token);

        // You can send this token to your backend for notifications
        await sendTokenToBackend(token); 
      } else {
        Alert.alert("Permission Denied", "Enable notifications in settings.");
      }

      // Set up notification listeners
      setupNotificationListeners();
    }

    setupFirebase();
  }, []);

  async function sendTokenToBackend(token) {
    // Example API call
    await fetch("http://192.168.0.108:8080/api/users/register-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fcmToken: token }),
    });
  }


}
