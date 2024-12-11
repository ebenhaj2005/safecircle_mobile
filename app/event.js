import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function event() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Event Screen</Text>
      <Link href="/profile" style={styles.link}>
        Go to profile Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
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