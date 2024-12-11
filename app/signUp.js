import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Link } from 'expo-router';

export default function signUp() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatpassword, setRepeatPassword] = useState('');


  const handleSignUp = () => {
    if (firstname.trim().length === 0) {
      Alert.alert('Error', 'Firstname cannot be empty');
      return;
    }
    if (lastname.trim().length === 0) {
        Alert.alert('Error', 'Lastame cannot be empty');
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
    if (repeatpassword != password) {
        Alert.alert('Error', 'Password is not matching');
        return;
      }
    Alert.alert('Success', `Welcome, ${firstname } ${lastname}!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstname}
        onChangeText={setFirstName}
      />

<TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastname}
        onChangeText={setLastName}
      />
       <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
    
     

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
       
      />
 <TextInput
        style={styles.input}
        placeholder="Repeat Password"
        secureTextEntry
        value={repeatpassword}
        onChangeText={setRepeatPassword}
   
      />
      <Button title="Sign Up" onPress={handleSignUp} color="skyblue" />

      <Link href="/login" style={styles.link}>
        Already have an account? Go to Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#black',
    backgroundColor: 'white',
  },
  link: {
    marginTop: 20,
    color: 'skyblue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});