import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import logo from '../assets/images/geenBackground.png';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null); 
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [subject, setSubject] = useState(null); // State voor het subject

  // Haal tokens op bij het starten van de app
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedAccessToken = await SecureStore.getItemAsync('accessToken');
      const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
      
  

      if (storedAccessToken && storedRefreshToken) {
        console.log("Tokens found. Attempting to refresh access token...");
        // Als er een refreshToken is, probeer dan het accessToken te vernieuwen
        await refreshTokens(storedRefreshToken);
      } else {
        console.log("No tokens found. User needs to log in.");
      }
    };
    checkLoggedIn();
  }, []);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
  
    try {

      const response = await fetch('http://192.168.0.114:8080/user/authenticate', { // IP-adres van je thuis wifi


        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const responseText = await response.text();
  
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = null;
        console.log("Error parsing server response:", error);
      }
  
      if (response.ok) {
        console.log("Login successful!");
        if (responseData) {
          const { accessToken, refreshToken } = responseData;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
  
          // Sla de accessToken en refreshToken veilig op in SecureStore
          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('refreshToken', refreshToken);
  
          // Decodeer het JWT token en haal de 'sub' (subject) eruit
          const decodedToken = jwtDecode(accessToken);
          const userId = decodedToken.sub;  // Gebruik sub als userId
          setUserId(userId);  
          setSubject(userId); 
          
          // userId in SecureStore
          await SecureStore.setItemAsync('userId', userId);
  
          
          console.log("Decoded Token: ", decodedToken);
          console.log("User ID (subject): ", userId);
          console.log("Subject: ", userId); 
  
          router.push({ pathname: '/', params: { userId, subject: userId } });
        } else {
          Alert.alert("Error", "Failed to parse server response");
        }
      } else {
        console.log("Login failed with response data: ", responseData);
        Alert.alert("Error", responseData?.message || responseText || "Login failed");
      }
    }
    catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login");}
  };

  const refreshTokens = async (storedRefreshToken) => {
    try {
      console.log("Refreshing tokens...");
      const response = await fetch('http://192.168.0.114:8080/user/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : null;

      if (response.ok) {
        console.log("Token refresh successful.");
        if (responseData) {
          const { accessToken, refreshToken } = responseData;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('refreshToken', refreshToken);

          const decodedToken = jwtDecode(accessToken);
          setUserId(decodedToken.userId);
          setSubject(decodedToken.sub); 
          /* console.log("Decoded Refresh Token: ", decodedToken); 
          console.log("User ID from Refresh: ", decodedToken.userId); 
          console.log("Subject from Refresh: ", decodedToken.sub);  */
        } else {
          Alert.alert("Error", "Failed to parse server response");
        }
      } else {
        //console.log("Token refresh failed. Response data:", responseData);
        Alert.alert("Error", responseData?.message || "Token refresh failed");
      }
    } catch (error) {
      //console.error("Token refresh error:", error);
      Alert.alert("Error", "An error occurred during token refresh");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}> 
        <Image source={logo} style={styles.logo} /> 
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} color="#CD9594" />
        <Link href="/signUp" style={styles.link}><Text>Don't have an account? Register</Text></Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  link: {
    marginTop: 16,
    color: '#007BFF',
  },
});