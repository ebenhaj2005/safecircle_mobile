import React from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileChildren() {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  };

  const children = [
    { id: 1, name: 'Jane Doe' },
    { id: 2, name: 'Jack Doe' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Link href="/profile">
            <Text style={styles.backButtonText}>Back</Text>
          </Link>
        </TouchableOpacity>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image style={styles.profileImage} source={{ uri: user.profileImage }} />
          </View>
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        </View>

        <View style={styles.breakline} />

        {/* Children List */}
        {children.map((child) => (
          <View key={child.id} style={styles.childContainer}>
            <Text style={styles.childName}>{child.name}</Text>
            <View style={styles.childActions}>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="pencil" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="trash" size={20} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.breakline} />

        {/* Add Child Button */}
        <TouchableOpacity style={styles.addButton}>
        <Link href="/profileAddChild">

          <Text style={styles.addButtonText}>Add Child</Text>
          </Link>
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
    marginTop: 60,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#CD9594',
    borderRadius: 5,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  breakline: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  childContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childName: {
    fontSize: 16,
    color: '#333',
  },
  childActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80, // Adjust the width to add more space between icons
  },
  actionButton: {
    marginLeft: 10,
  },
  addButton: {
    width: '90%',
    backgroundColor: '#CD9594',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});