import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image
} from "react-native";
import { Link, router } from "expo-router";
import { jwtDecode } from "jwt-decode";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null); 

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
  
    try {
      const response = await fetch('http://192.168.0.108:8080/user/authenticate', { // IP-adres van je thuis wifi
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const responseText = await response.text();
      console.log("Server response:", responseText);
  
      if (response.ok) {
        // Decode the JWT
        const decoded = jwtDecode(responseText);
        const userId = decoded.sub; 
        
  
        setUserId(userId); // Opslaan van userId in de state
        Alert.alert("Login Successful", `Welcome: ${email}`);
        router.push("/");
      } else {
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login. Please try again later.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/safecirclelogo.png")}
        style={{ width: 300, height: 300 ,marginBottom: 20 }}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Link href="/signUp">Don't have an account? Sign up</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});