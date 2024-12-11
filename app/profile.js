import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Link href="/" style={styles.link}>
        Go to home Screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
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