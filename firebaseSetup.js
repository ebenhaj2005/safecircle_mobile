import messaging from '@react-native-firebase/messaging';

// Request permission to send notifications
export async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = 
    authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

// Get FCM Token
export async function getFcmToken() {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("FCM Token:", fcmToken);
      return fcmToken;
    } else {
      console.warn("FCM Token not found");
    }
  } catch (error) {
    console.error("Error fetching FCM Token:", error);
  }
}

// Listen for Incoming Notifications
export function setupNotificationListeners() {
  messaging().onMessage(async (remoteMessage) => {
    console.log("Notification received in foreground:", remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Notification received in background:", remoteMessage);
  });
}
