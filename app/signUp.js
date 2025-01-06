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
import logo from '../assets/images/geenBackground.png'; // Import the image at the top
import LocationUpdater from './location';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDate] = useState("");

  const handleSignUp = async () => {
    // Validations
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name cannot be empty');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name cannot be empty');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (repeatPassword !== password) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {


      const response = await fetch('http://192.168.1.61:8080/user/create', { // IP-adres van je thuis wifi (ipconfig)


        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
          dateOfBirth
        }),
      });
  
      const rawData = await response.text(); // Lees de serverrespons als tekst
      console.log('Server response:', rawData); // Log de ruwe string voor debugging
  
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully');
        // Navigate to another page or perform other actions
      } else {
        Alert.alert('Error', 'Failed to create account');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      Alert.alert('Error', 'An error occurred during sign-up');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}><LocationUpdater />
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={setLastName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Repeat Password"
          placeholderTextColor="#888"
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#888"
          value={dateOfBirth}
          onChangeText={setDate}
          
        />
        <Button title="Sign Up" onPress={handleSignUp} color="#CD9594" />
        <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
        </Link>
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
    width: 300,
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