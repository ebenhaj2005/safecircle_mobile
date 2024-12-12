import React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

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
        <Link href="/profile" style={styles.link}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </Link>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image style={styles.profileImage} source={{ uri: user.profileImage }} />
            <View style={styles.editProfileImage}>
              <FontAwesome name="pencil" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>First name:</Text>
            <Text style={styles.info}>{user.firstName}</Text>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Last name:</Text>
            <Text style={styles.info}>{user.lastName}</Text>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Phone number:</Text>
            <Text style={styles.info}>{user.phoneNumber}</Text>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesome name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
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
    width: '100%',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ccc',
  },
  editProfileImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  info: {
    fontSize: 16,
    color: '#555',
    flex: 2,
  },
  editButton: {
    backgroundColor: '#CD9594',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
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
  link: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});