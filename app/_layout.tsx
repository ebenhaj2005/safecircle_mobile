
import React, { useEffect } from "react";
import { Stack, useSegments, useRouter } from "expo-router";
import Navbar from "../components/Navbar";


export default function RootLayout() {
  const router = useRouter();
  const segments: string[] = useSegments();
  const hideNavbar =
    segments.includes("login") ||
    segments.includes("signUp") ||
    segments.includes("passwordForget") ||
    segments.includes("eventrequestpage") ||
    segments.includes("profileAddChild") ||
    segments.includes("profileChildren") ||
    segments.includes("profileHistory") ||
    segments.includes("settings") ||
    segments.includes("contact") ||
    segments.includes("profilePI");
  useEffect(() => {
    return router.push("/login");
  }, [router]);
  return (
    <>

      <Stack>
        
        <Stack.Screen
          name="login"
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen
          name="circle"
          options={{ title: "Circle", headerShown: false }}
        />
        <Stack.Screen
          name="circleAdd"
          options={{ title: "CircleAdd", headerShown: false }}
        />
        <Stack.Screen
          name="map"
          options={{ title: "Map", headerShown: false }}
        />
        <Stack.Screen
          name="event"
          options={{ title: "Event", headerShown: false }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: "Profile", headerShown: false }}
        />
        <Stack.Screen
          name="signUp"
          options={{ title: "Sign Up", headerShown: false }}
        />
        <Stack.Screen
          name="profilePI"
          options={{ title: "Profile PI", headerShown: false }}
        />
        <Stack.Screen
          name="passwordForget"
          options={{ title: "Password Forget", headerShown: false }}
        />
        <Stack.Screen
          name="eventrequestpage"
          options={{ title: "Event Request", headerShown: false }}
        />
        <Stack.Screen
          name="profileHistory"
          options={{ title: "Profile History", headerShown: false }}
        />
        <Stack.Screen
          name="profileChildren"
          options={{ title: "Profile Children", headerShown: false }}
        />
        <Stack.Screen
          name="profileAddChild"
          options={{ title: "Profile Add Child", headerShown: false }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Settings", headerShown: false }}
        />
        <Stack.Screen
          name="contact"
          options={{ title: "Contact", headerShown: false }}
        />
        <Stack.Screen name="circleDetails" options={{ title: "circleDetails",headerShown: false }} />
      </Stack>

      {!hideNavbar && <Navbar />}
    </>
  );
}
