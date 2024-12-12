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
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/safecirclelogo.png")}
        style={{ width: 300, height: 300 ,marginBottom: 20 }}
      />

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
      <Link href="/passwordForget" style={styles.recovery}>
        Forgot Password?
      </Link>
      <Button title="Login" onPress={handleLogin} color="#CD9594" />

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
    color: "black",
    backgroundColor: "white",
  },
  link: {
    marginTop: 20,
    color: "#CD9594",
    textDecorationLine: "underline",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 50,
  },
  recovery: {
    float: "right",
    color: "#CD9594",
    textDecorationLine: "underline",
    fontSize: 13,

    fontWeight: "bold",
    marginBottom: 50,
  },
});
