import { Stack, useSegments } from "expo-router";
import Navbar from "../components/Navbar";


export default function RootLayout() {
  const segments: string[] = useSegments();
  const hideNavbar = segments.includes("login") || segments.includes("signUp") || segments.includes("passwordForget") || segments.includes("eventrequestpage");
  return (
    <>
    <Stack>


        <Stack.Screen name="index" options={{ title: "Home" , headerShown: false}} />
        <Stack.Screen name="circle" options={{ title: "circle" , headerShown: false}} />
        <Stack.Screen name="circleAdd" options={{ title: "circleAdd" , headerShown: false}} />
        <Stack.Screen name="map" options={{ title: "map",headerShown: false }} />
        <Stack.Screen name="event" options={{ title: "event",headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "profile",headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "login",headerShown: false }} />
        <Stack.Screen name="signUp" options={{ title: 'signUp', headerShown: false }} />     
        <Stack.Screen name="profilePI" options={{ title: "profilePI",headerShown: false }} />
        <Stack.Screen name="passwordForget" options={{ title: 'passwordForget', headerShown: false }} />
        <Stack.Screen name="eventrequestpage" options={{ title: 'eventrequestpage', headerShown: false }} />
        <Stack.Screen name="profileHistory" options={{ title: "profileHistory",headerShown: false }} />
        <Stack.Screen name="profileChildren" options={{ title: "profileChildren",headerShown: false }} />
        <Stack.Screen name="profileAddChild" options={{ title: "profileAddChild",headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: "settings",headerShown: false }} />
        <Stack.Screen name="contact" options={{ title: "contact",headerShown: false }} />
      </Stack>
      
      {!hideNavbar && <Navbar />}
    </>

  );
}
