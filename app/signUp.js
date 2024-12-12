import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Cookies from 'js-cookie';

const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MzQwMTI5MjcsInN1YiI6IjIiLCJyb2xlIjoiVVNFUiJ9.LEhOFKH8xSB3tum115Mm6qaXecurwnD3v6cYCOtTFEg';
Cookies.set('bearer_token', token, { expires: 1 }); // De token vervalt na 1 dag

export default function signUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    
    
    if (firstName.trim().length === 0) {
      Alert.alert('Error', 'Firstname cannot be empty');
      return;
    }
    if (lastName.trim().length === 0) {
      Alert.alert('Error', 'Lastname cannot be empty');
      return;
    }
    if (email.trim().length === 0) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (repeatPassword !== password) {
      Alert.alert('Error', 'Password is not matching');
      return;
    }

    const token = Cookies.get('bearer_token'); // Haal de Bearer token uit de cookie

    try {
      const response = await fetch('http://10.2.16.27:8080/user/authenticate', { // Gebruik het juiste IP-adres
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Welcome, ${firstName} ${lastName}!`, [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Sign up error:', error); // Log de fout in de console
      Alert.alert('Error', 'Failed to sign up');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/safecirclelogo.png")}
        style={{ width: 300, height: 300, marginBottom: 20 }}
      />
      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
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
      <TextInput
        style={styles.input}
        placeholder="Repeat Password"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone (optional)"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
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