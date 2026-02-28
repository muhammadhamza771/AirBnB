import React, { createContext, useState } from 'react';

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [propertyData, setPropertyData] = useState({
   
    basic: {},
    propertyName: '',
    
   
    propertyType: '',
    guestCapacity: [],
    rooms: {},
    
   
    highlights: [],
    description: '',
    amenities: [],
    
  
    discounts: [],
    price: 0,
    cancellationPolicy: '',
    
    
    images: [],
    location: {},
    
   
    habits: [],
    pets: [],
    bookingType: 'instant',
    
    
    safetyDetails: {},
    services: [],
  });

  const updatePropertyData = (key, value) => {
    setPropertyData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateMultiple = (updates) => {
    setPropertyData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetPropertyData = () => {
    setPropertyData({
      basic: {},
      propertyName: '',
      propertyType: '',
      guestCapacity: 0,
      rooms: {},
      highlights: [],
      description: '',
      amenities: [],
      discounts: [],
      price: 0,
      cancellationPolicy: '',
      images: [],
      location: {},
      habits: [],
      pets: [],
      bookingType: 'instant',
      safetyDetails: {},
      services: [],
    });
  };

  return (
    <PropertyContext.Provider value={{
      propertyData,
      updatePropertyData,
      updateMultiple,
      resetPropertyData,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};
