import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
const Icon = require('react-native-vector-icons/FontAwesome').default;

//Hulp van copilot voor het navbar component

const Navbar = () => {
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      <Link href="/" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/' && styles.activeNavLink]}>
          <Icon name="home" size={24} color={pathname === '/' ? '#CD9594' : '#333'} />
          {pathname === '/' && <Text style={styles.navText}>Home</Text>}
        </View>
      </Link>
      <Link href="/circle" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/circle' && styles.activeNavLink]}>
          <Icon name="circle" size={24} color={pathname === '/circle' ? '#CD9594' : '#333'} />
          {pathname === '/circle' && <Text style={styles.navText}>Circle</Text>}
        </View>
      </Link>
      <Link href="/map" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/map' && styles.activeNavLink]}>
          <Icon name="map" size={24} color={pathname === '/map' ? '#CD9594' : '#333'} />
          {pathname === '/map' && <Text style={styles.navText}>Map</Text>}
        </View>
      </Link>
      <Link href="/event" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/event' && styles.activeNavLink]}>
          <Icon name="calendar" size={24} color={pathname === '/event' ? '#CD9594' : '#333'} />
          {pathname === '/event' && <Text style={styles.navText}>Event</Text>}
        </View>
      </Link>
      <Link href="/profile" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/profile' && styles.activeNavLink]}>
          <Icon name="user" size={24} color={pathname === '/profile' ? '#CD9594' : '#333'} />
          {pathname === '/profile' && <Text style={styles.navText}>Profile</Text>}
        </View>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    height: 100,
    backgroundColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  navLink: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    textAlign: 'center',
    display: 'flex',
    
  },
  activeNavLink: {
    backgroundColor: '#CD9594',
    borderRadius: 20,
    padding: 10,
  },
  navText: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 20,
    color: '#333',
    marginTop: 0,
    marginBottom: 10,
  },
});

export default Navbar;