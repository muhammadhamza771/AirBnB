import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import GuestTab from './GuestTab';
import HostTab from './HostTab';  


const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />

     
      <Stack.Screen name="GuestTab" component={GuestTab} />
      <Stack.Screen name="HostTab" component={HostTab} />
    </Stack.Navigator>
  );
};

export default RootStack;
