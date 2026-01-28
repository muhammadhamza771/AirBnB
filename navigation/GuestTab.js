import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PropertyListScreen from '../Screens/Guest/PropertyListScreen';
import SearchScreen from '../Screens/Guest/SearchScreen';
import BookingScreen from '../Screens/Guest/BookingScreen';
import WishlistScreen from '../Screens/Guest/WishlistScreen';
import ProfileScreen from '../Screens/Guest/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function GuestTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF385C',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Explore') icon = 'search';
          if (route.name === 'Search') icon = 'search-outline';
          if (route.name === 'Trips') icon = 'calendar-outline';
          if (route.name === 'Wishlist') icon = 'heart-outline';
          if (route.name === 'Profile') icon = 'person-outline';

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={PropertyListScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Trips" component={BookingScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen rootNavigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}