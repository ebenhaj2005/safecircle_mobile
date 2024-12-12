import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    // Validaties
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
      const response = await fetch('http://10.2.88.110:8080/user/create', {
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
        }),
      });
  
      const rawData = await response.text(); // Lees de serverrespons als tekst
      console.log('Server response:', rawData); // Log de ruwe string voor debugging
  
      if (response.ok) {
        Alert.alert('Success', rawData, [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]);
      } else {
        Alert.alert('Error', `Server Error: ${rawData}`);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Failed to sign up. Please try again later.');
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
        keyboardType="email-address"
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
        keyboardType="phone-pad"
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
