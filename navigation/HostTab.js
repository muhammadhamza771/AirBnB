import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import TodayScreen from '../Screens/Host/TodayScreen';
import MyPropertiesScreen from '../Screens/Host/MyPropertiesScreen';

import BookingScreen from '../Screens/Host/BookingScreen';
import ProfileScreen from '../Screens/Host/ProfileScreen';

import PropertyStackNavigator from './PropertyStack';
const Tab = createBottomTabNavigator();

const HostTab = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF385C',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          let icon;
          switch (route.name) {
            case 'Today':
              icon = 'time-outline';
              break;
            case 'My Properties':
              icon = 'home-outline';
              break;
            case 'Add Property':
              icon = 'add-circle-outline';
              break;
            case 'Booking':
              icon = 'calendar-outline';
              break;
            case 'Profile':
              icon = 'person-outline';
              break;
          }
          return <Icon name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="My Properties" component={MyPropertiesScreen} />
      <Tab.Screen name="Add Property" component={PropertyStackNavigator } />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen rootNavigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default HostTab;
