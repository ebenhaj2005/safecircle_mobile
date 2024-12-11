import React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function ProfilePI() {

  const user = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+123456789',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}><Link href="/profile" style={styles.link}>
          Back
            </Link></Text>
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image style={styles.profileImage} source={{ uri: user.profileImage }} />

          <Text style={styles.name}>{user.firstName}</Text>
          <Text style={styles.lastName}>{user.lastName}</Text>
          <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
        </View>

        {/* History Button */}
        <TouchableOpacity style={styles.historyButton}>
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
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
    marginTop: 40,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#CD9594',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
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
  },
  lastName: {
    fontSize: 20,
    color: '#555',
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 18,
    color: '#777',
    marginBottom: 30,
  },
  historyButton: {
    width: '90%',
    backgroundColor: '#CD9594',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
