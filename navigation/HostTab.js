import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
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

        // 🔥 ICONS
        tabBarIcon: ({ color, size }) => {
          let icon;
          switch (route.name) {
            case 'Today':
              icon = 'time-outline';
              break;
            case 'My Properties':
              icon = 'home-outline';
              break;
            case 'AddProperty':
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

      {/* 🔥 ADD PROPERTY TAB (TAB HIDE LOGIC HERE) */}
      <Tab.Screen
        name="AddProperty"
        component={PropertyStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'Step1Basic';

          const hideTabScreens = [
            'Step1Basic',
            'Step2PropertyType',
            'PropertyType',
            'GuestCapacity',
            'RoomsScreen',
            'HouseHighlights',
            'CreateDescriptionScreen',
            'AmenitiesScreen',
            'AddDiscountsScreen',
          ];

          return {
            tabBarStyle: hideTabScreens.includes(routeName)
              ? { display: 'none' }
              : undefined,
          };
        }}
      />

      <Tab.Screen name="Booking" component={BookingScreen} />

      <Tab.Screen name="Profile">
        {() => <ProfileScreen rootNavigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default HostTab;
