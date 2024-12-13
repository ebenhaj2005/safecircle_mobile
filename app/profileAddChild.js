import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function ProfileAddChild() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log(form);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Link href="/profileChildren">
            <Text style={styles.backButtonText}>Back</Text>
          </Link>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Add Child</Text>
        <View style={styles.breakline} />

        {/* Form Section */}
        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="First Name *"
            value={form.firstName}
            onChangeText={(value) => handleChange('firstName', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name *"
            value={form.lastName}
            onChangeText={(value) => handleChange('lastName', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth *"
            value={form.dateOfBirth}
            onChangeText={(value) => handleChange('dateOfBirth', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChangeText={(value) => handleChange('phoneNumber', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email to Manage Account"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username *"
            value={form.username}
            onChangeText={(value) => handleChange('username', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password *"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
          />
        </View>

        {/* Create Child Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Create Child</Text>
        </TouchableOpacity>

        {/* Required Fields Note */}
        <Text style={styles.requiredNote}>All fields marked with a '*' are required</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  breakline: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  formSection: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
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
  },
  addButton: {
    width: '90%',
    backgroundColor: '#CD9594',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  requiredNote: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});