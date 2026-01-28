import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

const GuestProfileScreen = ({ rootNavigation }) => {


  const handleSwitchToHost = () => {
    rootNavigation.replace('HostTab');
  };


  const handleLogout = () => {
    rootNavigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Hamza</Text>
        <Text style={styles.role}>Guest</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={handleSwitchToHost}
        >
          <Text style={styles.switchButtonText}>Switch to Host</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GuestProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222222',
  },
  role: {
    fontSize: 14,
    color: '#717171',
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  switchButton: {
    backgroundColor: '#FF385C',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FF385C',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF385C',
    fontSize: 16,
    fontWeight: '600',
  },
});
