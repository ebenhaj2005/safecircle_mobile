import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import LocationUpdater from './location';

export default function ProfileHistory() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}> <LocationUpdater />
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Link href="/profilePI" style={{ alignSelf: "flex-start" }}>
            <Text style={styles.backButtonText}>Back</Text>
          </Link>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Alert History</Text>
        <View style={styles.breakline} />

        {/* Example Alert */}
        <View style={styles.alertContainer}>
          <Text style={styles.alertDate}>2023-10-01</Text>
          <Text style={styles.alertText}>You sent SOS</Text>
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
    marginBottom: 20,
  },
  alertContainer: {
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
  alertDate: {
    fontSize: 16,
    color: '#555',
  },
  alertText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  link: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});