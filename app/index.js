import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <Link href="/login" style={styles.link}>
        Go to circle Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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