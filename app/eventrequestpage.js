import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
export default function eventrequestpage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Link href="/event" style={styles.link}>
            <Text style={styles.backText}>Back</Text>
          </Link>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Request Event Circle</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Name Event:</Text>
        <TextInput style={styles.input} placeholder="Enter event name" />

        <Text style={styles.label}>Location Event:</Text>
        <TextInput style={styles.input} placeholder="Enter location" />

        <Text style={styles.label}>Estimated number of visitors:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of visitors"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Starting day:</Text>
        <TextInput style={styles.input} placeholder="DD/MM/YYYY" />

        <Text style={styles.label}>Ending day:</Text>
        <TextInput style={styles.input} placeholder="DD/MM/YYYY" />

        <Text style={styles.label}>Your email for us to contact:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

       
      </View>

      <View style={styles.footer}>
        <Text style={styles.requestInfo}>
          The request can take up to 5 business days to be processed. We will
          contact you once this is completed.
        </Text>

        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request Circle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    marginTop: 15,
    padding: 8,
    backgroundColor: "#f3ebf5",
    borderRadius: 8,
  },
  backText: {
    color: "#d68787",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f3ebf5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#a0a0a0",
    marginTop: 8,
    marginBottom: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ececec",
    paddingTop: 16,
    alignItems: "center",
  },
  requestInfo: {
    fontSize: 14,
    color: "#a0a0a0",
    marginBottom: 16,
    textAlign: "center",
  },
  requestButton: {
    backgroundColor: "#d68787",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
