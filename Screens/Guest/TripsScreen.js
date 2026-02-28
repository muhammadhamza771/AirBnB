import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const TripsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const Tab = ({ title }) => (
    <TouchableOpacity onPress={() => setActiveTab(title)}>
      <View style={styles.tabItem}>
        <Text
          style={[
            styles.tabText,
            activeTab === title && styles.activeTabText,
          ]}
        >
          {title}
        </Text>
        {activeTab === title && <View style={styles.activeLine} />}
      </View>
    </TouchableOpacity>
  );

 
  const getCardContent = () => {
    switch (activeTab) {
      case 'Upcoming':
        return {
          emoji: '🌵',
          title: 'No upcoming trips',
          subtitle: 'Time to find your next unique destination.',
          buttonText: 'Browse stays',
          onPress: () => navigation.navigate('Explore'),
        };

      case 'Pending Requests':
        return {
          emoji: '⏳',
          title: 'No pending requests',
          subtitle: 'You don’t have any trip requests right now.',
          buttonText: 'Find a place',
          onPress: () => navigation.navigate('Explore'),
        };

      case 'Past Trips':
        return {
          emoji: '🧳',
          title: 'No past trips',
          subtitle: 'Trips you’ve completed will appear here.',
          buttonText: 'Plan another trip',
          onPress: () => navigation.navigate('Explore'),
        };

      default:
        return {};
    }
  };

  const card = getCardContent();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your trips</Text>

      <View style={styles.tabsContainer}>
        <Tab title="Upcoming" />
        <Tab title="Pending Requests" />
        <Tab title="Past Trips" />
      </View>

     
      <View style={styles.card}>
        <Text style={styles.emoji}>{card.emoji}</Text>
        <Text style={styles.noTrips}>{card.title}</Text>
        <Text style={styles.subText}>{card.subtitle}</Text>

        <TouchableOpacity style={styles.button} onPress={card.onPress}>
          <Text style={styles.buttonText}>{card.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TripsScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 20,
  },

  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  tabItem: {
    marginRight: 25,
    alignItems: 'center',
  },

  tabText: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#000',
  },

  activeLine: {
    marginTop: 6,
    height: 3,
    width: 30,
    backgroundColor: '#000',
    borderRadius: 10,
  },

  card: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  emoji: {
    fontSize: 50,
    marginBottom: 15,
  },

  noTrips: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  subText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
