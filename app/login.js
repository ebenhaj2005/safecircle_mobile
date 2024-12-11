import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "" || password === "") {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }
    Alert.alert(
      "Login Successful",
      `Username: ${username}\nPassword: ${password}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} color="skyblue" />

      <Link href="/signUp" style={styles.link}>
        Don't have an account? Sign Up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  text: {
    color: "black",
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "white",
  },
  link: {
    marginTop: 20,
    color: "skyblue",
    textDecorationLine: "underline",
    fontSize: 18,
  },
});
