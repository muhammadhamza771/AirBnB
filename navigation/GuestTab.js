import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ExploreScreen from '../Screens/Guest/Explore';
import SearchScreen from '../Screens/Guest/SearchScreen';
import TripsScreen from '../Screens/Guest/TripsScreen';
import WishlistScreen from '../Screens/Guest/WishlistScreen';
import ProfileScreen from '../Screens/Guest/ProfileScreen';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ExploreStackNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PropertyListScreen" component={ExploreScreen} />
    
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
}

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
         
          if (route.name === 'Trips') icon = 'calendar-outline';
          if (route.name === 'Wishlist') icon = 'heart-outline';
          if (route.name === 'Profile') icon = 'person-outline';

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreStackNav} />
     
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen rootNavigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}