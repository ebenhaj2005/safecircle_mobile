import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Switch } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';  // Import useTranslation
import i18n from '../i18n'; // Import i18n-config bestand
import LocationUpdater from './location';

export default function Settings() {
  const navigation = useNavigation();
  const { t } = useTranslation(); // Krijg de vertaalfunctie van i18n
  const [language, setLanguage] = useState(i18n.language); // Bewaar de geselecteerde taal
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const languages = [
    { label: t('dutch'), value: 'nl' },
    { label: t('english'), value: 'en' },
    { label: t('french'), value: 'fr' },
    { label: t('spanish'), value: 'es' },
    { label: t('german'), value: 'de' },
  ];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang); // Verander de taal in de hele app
    setModalVisible(false); // Sluit de modal
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}> <LocationUpdater />
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{t('back')}</Text>  {/* Vertaal de "Back" knop */}
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings')}</Text> {/* Vertaal de titel */}

        {/* Language Settings */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>{t('language')}</Text> {/* Vertaal de label */}
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {languages.find(lang => lang.value === language)?.label}
            </Text>
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
                {languages.map(lang => (
                  <TouchableOpacity
                    key={lang.value}
                    style={styles.modalItem}
                    onPress={() => handleLanguageChange(lang.value)}
                  >
                    <Text style={styles.modalItemText}>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        {/* Notification Settings */}
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>{t('notifications')}</Text> {/* Vertaal de notificaties tekst */}
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
          />
        </View>
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
    marginTop: 60
  },
  container: {
    alignItems: "center",
    width: "100%"
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
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333"
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
  }
});
