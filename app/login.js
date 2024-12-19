import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Link, router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import logo from '../assets/images/geenBackground.png'; // Importeer de afbeelding bovenaan

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null); 
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
  
    try {
      const response = await fetch('http://192.168.0.110:8080/user/authenticate', { // IP-adres van je thuis wifi
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const responseText = await response.text();
      //console.log("Server response text:", responseText);
  
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = null;
      }
  
      //console.log("Server response JSON:", responseData);
  
      if (response.ok) {
        if (responseData) {
          const { accessToken, refreshToken } = responseData;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          const decodedToken = jwtDecode(accessToken);
          setUserId(decodedToken.userId);
          router.push({ pathname: '/', params: { userId: decodedToken.userId } });
        } else if (responseText) {
          // Handle the case where the response is a JWT token
          const accessToken = responseText;
          setAccessToken(accessToken);
          const decodedToken = jwtDecode(accessToken);
          setUserId(decodedToken.userId);
          router.push({ pathname: '/', params: { userId: decodedToken.userId } });
        } else {
          Alert.alert("Error", "Failed to parse server response");
        }
      } else {
        Alert.alert("Error", responseData?.message || responseText || "Login failed");
      }
    } catch (error) {
      //console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login");
    }
  };

  const refreshTokens = async () => {
    try {
      const response = await fetch('http://10.2.88.103:8080/user/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const responseText = await response.text();
      const responseData = responseText ? JSON.parse(responseText) : null;
      //console.log("Refresh response:", responseData);

      if (response.ok) {
        if (responseData) {
          const { accessToken, refreshToken } = responseData;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          const decodedToken = jwtDecode(accessToken);
          setUserId(decodedToken.userId);
        } else {
          Alert.alert("Error", "Failed to parse server response");
        }
      } else {
        Alert.alert("Error", responseData?.message || "Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
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