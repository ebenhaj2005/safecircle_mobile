import React from 'react';
import { Text, View, Image, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';


export default function Profile() {
  return (

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile Picture */}
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
        />

        {/* Profile Information */}
        <Text style={styles.name}>John Doe</Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}           >
            <Text style={styles.buttonText}><Link href="/profilePI" style={styles.link}>
            Personal Information
            </Link></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Children</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>App Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Link href="/login" style={styles.link}>
            <Text style={styles.buttonText}>Log Out</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
    marginTop: 40, // Increased margin at the top
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    backgroundColor: '#CD9594',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});