import { View, Text, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';

export default function passwordForget() {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    Alert.alert('Recovery Email Sent', `A password recovery email has been sent to ${email}.`);
    router.push('/index');
  };

  return (
    <View style={styles.container}>
         <Image
        source={require("../assets/images/safecirclelogo.png")}
        style={{ width: 300, height: 300, marginBottom: 20 }}
      />
      <Text style={styles.title}>Password Recovery</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.link} onPress={handlePasswordRecovery}>
        Send Recovery Email
      </Text>
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
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#CD9594',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 10,
    color: 'white',
   borderRadius: 20,
    fontSize: 18,
    backgroundColor: '#CD9594',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 200,
  },
 
});
