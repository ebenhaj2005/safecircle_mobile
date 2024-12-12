import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
export default function signUp() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatpassword, setRepeatPassword] = useState('');
  const router = useRouter();

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
    Alert.alert('Success', `Welcome, ${firstname } ${lastname}!`, [
      {
        text: 'OK',
        onPress: () => router.push('/'), 
      },
    ]);
  };

    
  ;

  return (
    <View style={styles.container}>
   
   <Image
        source={require("../assets/images/safecirclelogo.png")}
        style={{ width: 300, height: 300, marginBottom: 20 }}
      />
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
      <Button title="Sign Up" onPress={handleSignUp} color="#CD9594" />

      <Link href="/login" style={styles.link}>
        Already have an account? Go to Login
      </Link>
    </View>
  )};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
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
    color: '#CD9594',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});