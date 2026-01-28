import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PropertyType from '../Screens/Host/AddProperty/PropertyType';
import GuestCapacity from '../Screens/Host/AddProperty/GuestCapacity';
import PropertyName from '../Screens/Host/AddProperty/Property';
import RoomsScreen from '../Screens/Host/AddProperty/Rooms';
import HouseHighlights from '../Screens/Host/AddProperty/househightlight';
import CreateDescriptionScreen from '../Screens/Host/AddProperty/CreateDescriptionScreen';
import AmenitiesScreen from '../Screens/Host/AddProperty/AmenitiesScreen';
import AddDiscountsScreen from '../Screens/Host/AddProperty/Add DiscountsScreen';

const Stack = createNativeStackNavigator();

const PropertyStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     
      <Stack.Screen name="Step2PropertyType" component={PropertyName} />
      <Stack.Screen name="PropertyType" component={PropertyType} />
      <Stack.Screen name="GuestCapacity" component={GuestCapacity} />
      <Stack.Screen name="RoomsScreen" component={RoomsScreen} />
      <Stack.Screen name="HouseHighlights" component={HouseHighlights} />
      <Stack.Screen name="CreateDescriptionScreen" component={CreateDescriptionScreen} />
      <Stack.Screen name="AmenitiesScreen" component={AmenitiesScreen} />
      <Stack.Screen name="AddDiscountsScreen" component={AddDiscountsScreen} />
    </Stack.Navigator>
  );
};

export default PropertyStackNavigator;

