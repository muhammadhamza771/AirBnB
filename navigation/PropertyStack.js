// navigation/PropertyStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// ✅ PropertyProvider YAHAN SE HATAO - kyunke already App.js mein hai
// import { PropertyProvider } from '../context/PropertyContext';  // ❌ REMOVE

import Step1Basic from '../Screens/Host/AddProperty/Basic';
import PropertyName from '../Screens/Host/AddProperty/PropertyName';
import PropertyType from '../Screens/Host/AddProperty/PropertyType';
import GuestCapacity from '../Screens/Host/AddProperty/GuestCapacity';
import RoomsScreen from '../Screens/Host/AddProperty/Rooms';
import HouseHighlights from '../Screens/Host/AddProperty/househightlight';
import CreateDescriptionScreen from '../Screens/Host/AddProperty/CreateDescriptionScreen';
import AmenitiesScreen from '../Screens/Host/AddProperty/AmenitiesScreen';
import AddDiscountsScreen from '../Screens/Host/AddProperty/Add DiscountsScreen';
import AddressScreen from '../Screens/Host/AddProperty/LocationScreen';
import PropertyImageUpload from '../Screens/Host/AddProperty/ImageScreen';
import PriceScreen from '../Screens/Host/AddProperty/PriceScreen';
import CancellationPoliciesScreen from '../Screens/Host/AddProperty/CancellationPoliciesScreen';
import PetsStepScreen from '../Screens/Host/AddProperty/Petscreen';
import BookingTypeScreen from '../Screens/Host/AddProperty/BookingTypeScreen';
import SafetyDetailsScreen from '../Screens/Host/AddProperty/safetydetailsscreen';
import ServicesScreen from '../Screens/Host/AddProperty/servicesScreen';
import AvailabilityScreen from '../Screens/Host/AddProperty/AvailabilityScreen';

const Stack = createNativeStackNavigator();

const PropertyStackNavigator = () => {
  return (
    // ✅ PropertyProvider HATAO - sirf Stack.Navigator rakho
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Step1Basic" 
        component={Step1Basic} 
        // ✅ initialParams mat do
      />
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
      <Stack.Screen name="PriceScreen" component={PriceScreen} />
      <Stack.Screen name="CancellationPoliciesScreen" component={CancellationPoliciesScreen} />
      <Stack.Screen name="PetsStepScreen" component={PetsStepScreen} />
      <Stack.Screen name="BookingTypeScreen" component={BookingTypeScreen} /> 
      <Stack.Screen name="SafetyDetailsScreen" component={SafetyDetailsScreen} />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
      <Stack.Screen name="AvailabilityScreen" component={AvailabilityScreen} />
    </Stack.Navigator>
  );
};

export default PropertyStackNavigator;