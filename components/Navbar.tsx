import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, usePathname } from 'expo-router';
const Icon = require('react-native-vector-icons/FontAwesome').default;

const Navbar = () => {
  const pathname = usePathname();

  return (
    <View style={styles.navbar}>
      <Link href="/" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/' && styles.activeNavLink]}>
          <Icon name="home" size={24} color={pathname === '/' ? '#993d3d' : '#333'} style={pathname === '/' && styles.activeIcon} />
          {pathname === '/' && <Text style={styles.navText}>Home</Text>}
        </View>
      </Link>
      <Link href="/circle" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/circle' && styles.activeNavLink]}>
          <Icon name="circle" size={24} color={pathname === '/circle' ? '#993d3d' : '#333'} style={pathname === '/circle' && styles.activeIcon} />
          {pathname === '/circle' && <Text style={styles.navText}>Circle</Text>}
        </View>
      </Link>
      <Link href="/map" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/map' && styles.activeNavLink]}>
          <Icon name="map" size={24} color={pathname === '/map' ? '#993d3d' : '#333'} style={pathname === '/map' && styles.activeIcon} />
          {pathname === '/map' && <Text style={styles.navText}>Map</Text>}
        </View>
      </Link>
      <Link href="/event" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/event' && styles.activeNavLink]}>
          <Icon name="calendar" size={24} color={pathname === '/event' ? '#993d3d' : '#333'} style={pathname === '/event' && styles.activeIcon} />
          {pathname === '/event' && <Text style={styles.navText}>Event</Text>}
        </View>
      </Link>
      <Link href="/profile" style={styles.navItem}>
        <View style={[styles.navLink, pathname === '/profile' && styles.activeNavLink]}>
          <Icon name="user" size={24} color={pathname === '/profile' ? '#993d3d' : '#333'} style={pathname === '/profile' && styles.activeIcon} />
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
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  navLink: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeNavLink: {
    backgroundColor: '#CD9594',
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIcon: {
    color: '#993d3d',
    
    
    // Zelfde kleur als navText
  },
  navText: {
    fontSize: 14,
    color: '#993d3d',
    marginLeft: 8,
  },
});


export default Navbar;
