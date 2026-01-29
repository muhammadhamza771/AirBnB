import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Step1Basic from '../Screens/Host/AddProperty/Basic';
import  PropertyName from '../Screens/Host/AddProperty/PropertyName';
import PropertyType from '../Screens/Host/AddProperty/PropertyType';
import GuestCapacity from '../Screens/Host/AddProperty/GuestCapacity';

import RoomsScreen from '../Screens/Host/AddProperty/Rooms';
import HouseHighlights from '../Screens/Host/AddProperty/househightlight';
import CreateDescriptionScreen from '../Screens/Host/AddProperty/CreateDescriptionScreen';
import AmenitiesScreen from '../Screens/Host/AddProperty/AmenitiesScreen';
import AddDiscountsScreen from '../Screens/Host/AddProperty/Add DiscountsScreen';
import AddressScreen from '../Screens/Host/AddProperty/LocationScreen';

import PropertyImageUpload from '../Screens/Host/AddProperty/ImageScreen';
const Stack = createNativeStackNavigator();

const PropertyStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Step1Basic" component={Step1Basic} />
    <Stack.Screen name="PropertyName" component={PropertyName} />
      <Stack.Screen name="Step2PropertyType" component={PropertyType} />
      
      <Stack.Screen name="GuestCapacity" component={GuestCapacity} />
      <Stack.Screen name="RoomsScreen" component={RoomsScreen} />
      <Stack.Screen name="HouseHighlights" component={HouseHighlights} />
      <Stack.Screen name="CreateDescriptionScreen" component={CreateDescriptionScreen} />
      <Stack.Screen name="AmenitiesScreen" component={AmenitiesScreen} />
      <Stack.Screen name="AddDiscountsScreen" component={AddDiscountsScreen} />
      <Stack.Screen name="LocationScreen" component={AddressScreen} />
      <Stack.Screen name="PropertyImageUpload" component={PropertyImageUpload} />
    
    </Stack.Navigator>
  );
};

export default PropertyStackNavigator;

