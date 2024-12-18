import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await getPermissionsAsync();

      if (status !== 'granted') {
        const { status: newStatus } = await requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.log('Push notification permissions denied');
          return;
        }
      }

      // Haal de token op
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('FCM Token:', token);

      try {
        // Stuur de token naar je backend-server of direct naar Firebase
        await fetch('https://10.2.88.152:8080/user/register-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
          }),
        });
      } catch (error) {
        console.log('Fout bij verzenden van de token:', error.message);
      }
    })();
  }, []);

  return <View><Text>Push notificatie actief</Text></View>;
}
