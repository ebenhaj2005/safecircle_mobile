import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function EventRequestPage() {
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [visitors, setVisitors] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [email, setEmail] = useState("");

  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");

        if (storedUserId && storedAccessToken) {
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
        } else {
          Alert.alert("Error", "Authentication details not found");
        }
      } catch (error) {
        console.error("Error fetching authentication data:", error);
      }
    };

    fetchAuthData();
  }, []);

  const geocodeLocation = async (address) => {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        Alert.alert("Error", "Unable to geocode the location");
        return null;
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      Alert.alert("Error", "Geocoding failed");
      return null;
    }
  };
  
 


  const handleRequestEvent = async () => {
    console.log("Requesting event circle...");
  
    // Controleer of de vereiste velden ingevuld zijn
    if (!eventName.trim() || !location.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill out all required fields");
      return;
    }
  
    if (!userId || !accessToken) {
      console.log("User ID or Access Token is missing");
      Alert.alert("Error", "User ID or Access Token is missing");
      return;
    }
  
    // Geocode de locatie
    const geocodedLocation = await geocodeLocation(location);
    if (!geocodedLocation) {
      return;
    }
  
    const { lat, lon } = geocodedLocation;
   /*  console.log("Geocoded location:", lat, lon); */
  
   
  
    const requestUrl = 'http://192.168.0.110:8080/event/request';
  
console.log("eheheh")

    // Request body opstellen
    const requestBody = {
      userCountEstimate: parseInt(visitors,10), // Zorg ervoor dat visitors wordt omgezet naar een integer
      eventName: eventName,
      eventStatus: "PENDING", // Event status (verander naar "PENDING" of "DRAFT" zoals je wil)
      email: email,
      startDate: startDay, // Startdatum geformatteerd
      endDate: endDay,     // Einddatum geformatteerd
      location: {
        latitude: lat,    // Latitude van de geocode
        longitude: lon,   // Longitude van de geocode
      }
    };
/*     console.log("eheheh")
  
    console.log("Request body:", JSON.stringify(requestBody)); */
  
    // Verstuur de request
    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',  // Voeg token toe aan de headers
        },
        body: JSON.stringify(requestBody),
      });

      console.log("baba")
  
      if (response.ok) {
        Alert.alert("Success", "Event request submitted successfully!");
      } else {
        /* console.log("Server response:", response);
        const result = await response.json();
        console.log("Server response:", result); // Log de server response voor debugging */
        Alert.alert("Error", result.message || "Failed to submit event request");
      }
    } catch (error) {
      console.error("Error submitting event request:", error);
      Alert.alert("Error", "Unable to connect to the server");
    }
  };
  

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
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={eventName}
          onChangeText={setEventName}
        />

        <Text style={styles.label}>Location Event:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Estimated number of visitors:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of visitors"
          keyboardType="numeric"
          value={visitors}
          onChangeText={setVisitors}
        />

        <Text style={styles.label}>Starting day:</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={startDay}
          onChangeText={setStartDay}
        />

        <Text style={styles.label}>Ending day:</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={endDay}
          onChangeText={setEndDay}
        />

        <Text style={styles.label}>Your email for us to contact:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.requestInfo}>
          The request can take up to 5 business days to be processed. We will
          contact you once this is completed.
        </Text>

        <TouchableOpacity style={styles.requestButton} onPress={handleRequestEvent}>
          <Text style={styles.requestButtonText}>Request Circle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  // Style properties remain the same
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
