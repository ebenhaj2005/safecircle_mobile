import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal
} from "react-native";
import { Link } from "expo-router";
import LocationUpdater from './location';

export default function Contact() {
  const [subject, setSubject] = useState("Choose a subject");
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const subjects = [
    "User complaint",
    "Technical Support",
    "Feedback",
    "bug report",
    "Other"
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}> <LocationUpdater />

      <TouchableOpacity style={styles.backButton}>
          <Link href="/profile" style={{ alignSelf: "flex-start" }}>
            <Text style={styles.backButtonText}>Back</Text>
          </Link>
        </TouchableOpacity>

        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.description}>
          Please fill out this form to contact the admin.
        </Text>

        {/* Subject Dropdown */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Subject</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownText}>{subject}</Text>
          </TouchableOpacity>
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalContainer}
              activeOpacity={1}
              onPressOut={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                {subjects.map((subj, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.modalItem}
                    onPress={() => {
                      setSubject(subj);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{subj}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {/* Message Input */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Message</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {/* Email Input */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>*Your Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.button} onPress={() => alert("Message sent!")}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
    marginTop: 40
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#CD9594",
    borderRadius: 5
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  container: {
    alignItems: "center",
    width: "100%"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center"
  },
  settingContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10
  },
  dropdown: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  dropdownText: {
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20
  },
  modalItem: {
    padding: 10
  },
  modalItemText: {
    fontSize: 18
  },
  textInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    textAlignVertical: "top"
  },
  button: {
    width: "90%",
    backgroundColor: "#CD9594",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  }
});