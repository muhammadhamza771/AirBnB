import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ExploreScreen from '../Screens/Guest/Explore';
import FilterScreen from '../Screens/Guest/FilterScreen';
import SearchScreen from '../Screens/Guest/SearchScreen';
import TripsScreen from '../Screens/Guest/TripsScreen';
import WishlistScreen from '../Screens/Guest/WishlistScreen';
import ProfileScreen from '../Screens/Guest/ProfileScreen';
import TravelDetailsScreen from '../Screens/Guest/BookingScreen';
import BookingConfigScreen from '../Screens/Guest/BookingConfigurationScreen';
import PropertyDetailScreen from '../Screens/Guest/PropertyDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Explore Stack
function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreMain" component={ExploreScreen} />
      <Stack.Screen name="Filter" component={FilterScreen} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <Stack.Screen name="WishlistMain" component={WishlistScreen}/>
      <Stack.Screen name="Booking" component={TravelDetailsScreen}/>
      <Stack.Screen name="BookingConfig" component={BookingConfigScreen}/>
    </Stack.Navigator>
  );
}

// Trips Stack
function TripsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TripsMain" component={TripsScreen} />
    </Stack.Navigator>
  );
}

// Wishlist Stack
function WishlistStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WishlistMain" component={WishlistScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain">
        {({ navigation }) => <ProfileScreen rootNavigation={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function GuestTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        // Determine focused route name for hiding tab bar
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';

        // Screens where bottom tab should be hidden
        const hideTabScreens = [
          'Filter',
          'PropertyDetail',
          'Booking',
          'BookingConfig'
        ];

        return {
          headerShown: false,
          tabBarActiveTintColor: '#FF385C',
          tabBarInactiveTintColor: '#888',
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Explore') iconName = 'search';
            else if (route.name === 'Trips') iconName = 'calendar-outline';
            else if (route.name === 'Wishlist') iconName = 'heart-outline';
            else if (route.name === 'Profile') iconName = 'person-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: hideTabScreens.includes(routeName)
            ? { display: 'none' }
            : { height: 60, paddingBottom: 8, paddingTop: 8 },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        };
      }}
    >
      <Tab.Screen name="Explore" component={ExploreStack} options={{ tabBarLabel: 'Explore' }} />
      <Tab.Screen name="Trips" component={TripsStack} options={{ tabBarLabel: 'Trips' }} />
      <Tab.Screen name="Wishlist" component={WishlistStack} options={{ tabBarLabel: 'Wishlist' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
