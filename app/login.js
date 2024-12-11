import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map Screen</Text>
      <Link href="/event" style={styles.link}>
        Go to event Screen
      </Link>
      <Link href="/event" style={styles.link}>
        Go to event Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
  link: {
    marginTop: 20,
    color: 'skyblue',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
});