// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './navigation/RootStack';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext'; // ✅ import it

export default function App() {
  return (
    <AuthProvider>
      <PropertyProvider>   {/* ✅ wrap here */}
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </PropertyProvider>
    </AuthProvider>
  );
}