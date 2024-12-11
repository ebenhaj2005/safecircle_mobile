import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Circle() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CIRCLE Screen</Text>
      <Link href="/map" style={styles.link}>
        Go to map Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
  link: {
    marginTop: 20,
    color: "skyblue",
    textDecorationLine: "underline",
    fontSize: 18,
  },
});
